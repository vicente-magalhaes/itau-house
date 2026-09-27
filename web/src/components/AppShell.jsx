import React from 'react';
import { Logo, Icon, Button, IconButton, Input, Select } from '../ds.js';
import { Avatar, SeloSimulado } from './comuns.jsx';
import { useSessao } from '../sessao.jsx';
import { Link, irPara } from '../router.jsx';
import { filaAprovacao } from '../data/governanca.js';
import { ativos, TIPOS, visivelPara } from '../data/catalogo.js';

const PRINCIPAL = [
  { para: '/', rotulo: 'Início', icone: 'house' },
  { para: '/sugestao', rotulo: 'No seu editor', icone: 'square-terminal' },
];

const COORDENACAO = [
  { para: '/coord/fila', rotulo: 'Fila de aprovação', icone: 'inbox', contador: filaAprovacao.length },
  { para: '/coord/dados', rotulo: 'Dados', icone: 'chart-column' },
];

function ItemNav({ para, rotulo, icone, contador, ativo }) {
  return (
    <Link para={para} className="nav-item" aria-current={ativo ? 'page' : undefined}>
      <Icon name={icone} size={20} />
      {rotulo}
      {contador > 0 && <span className="contador">{contador}</span>}
    </Link>
  );
}

function Grupo({ titulo, children }) {
  const [aberto, setAberto] = React.useState(true);
  return (
    <div className="stack">
      <button type="button" className="nav-grupo" aria-expanded={aberto} onClick={() => setAberto(!aberto)}>
        {titulo}
        <Icon name={aberto ? 'chevron-up' : 'chevron-down'} size={16} />
      </button>
      {aberto && children}
    </div>
  );
}

export function AppShell({ rota, children }) {
  const { pessoa, ehCoordenador, perfil, trocarPerfil, sair, busca, setBusca } = useSessao();

  // Só entram na lateral os tipos e frentes que a pessoa consegue ver (RF-05).
  const visiveis = ativos.filter((a) => visivelPara(a, pessoa));
  const tipos = TIPOS.filter((t) => visiveis.some((a) => a.tipo === t.value));
  const frentes = [...new Set(visiveis.map((a) => a.frente))].sort((a, b) => a.localeCompare(b));

  return (
    <div>
      <header className="topo">
        <Link para="/" aria-label="Itaú House, ir para o início">
          <span className="row row-3">
            <Logo size={32} basePath="/" />
            <span style={{ font: 'var(--fw-bold) var(--fs-h3)/1 var(--font-display)', letterSpacing: 'var(--ls-display)' }}>Itaú House</span>
          </span>
        </Link>

        <div className="topo-busca">
          <label htmlFor="busca-global" className="sr-only">Buscar no Itaú House</label>
          <Input
            id="busca-global"
            icon="search"
            placeholder="Buscar skills, agentes, MCPs"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              if (rota !== '/' && !rota.startsWith('/t/') && !rota.startsWith('/f/')) irPara('/');
            }}
          />
        </div>

        <div className="row row-3">
          <SeloSimulado placement="bottom" ajuda="Protótipo do Hackathon Itaú 2026. Não é um produto oficial do Itaú. Login, pessoas e números são fictícios.">
            Protótipo
          </SeloSimulado>
          <Button variant="outline" size="sm" iconLeft="plus" onClick={() => irPara("/publicar")}>
            Publicar
          </Button>
          <label>
            <span className="sr-only">Perfil de demonstração</span>
            <Select
              size="sm"
              options={[
                { value: 'dev', label: 'Dev' },
                { value: 'coordenador', label: 'Coordenação' },
              ]}
              value={perfil}
              onChange={(e) => {
                trocarPerfil(e.target.value);
                if (e.target.value !== 'coordenador' && rota.startsWith('/coord')) irPara('/');
              }}
              style={{ width: 168 }}
            />
          </label>
          <span title={`${pessoa.nome} · ${pessoa.squad}`}>
            <Avatar iniciais={pessoa.iniciais} tamanho={36} />
          </span>
          <IconButton icon="log-out" label="Sair" size={40} onClick={() => { sair(); irPara('/entrar'); }} />
        </div>
      </header>

      <div className="casca">
        <nav className="lateral" aria-label="Navegação">
          {PRINCIPAL.map((i) => (
            <ItemNav key={i.para} {...i} ativo={i.para === '/' ? rota === '/' : rota.startsWith(i.para)} />
          ))}

          {ehCoordenador && (
            <Grupo titulo="Coordenação">
              {COORDENACAO.map((i) => (
                <ItemNav key={i.para} {...i} ativo={rota.startsWith(i.para)} />
              ))}
            </Grupo>
          )}

          <hr className="divider" style={{ margin: 'var(--space-2) 0' }} />

          <Grupo titulo="Tipos">
            {tipos.map((t) => (
              <ItemNav key={t.value} para={'/t/' + t.value} rotulo={t.plural} icone={t.icone} ativo={rota === '/t/' + t.value} />
            ))}
          </Grupo>

          <Grupo titulo="Frentes">
            {frentes.map((f) => {
              const para = '/f/' + encodeURIComponent(f);
              return <ItemNav key={f} para={para} rotulo={f} icone="users" ativo={rota === para} />;
            })}
          </Grupo>

          <p className="caption" style={{ marginTop: 'auto', padding: 'var(--space-4) var(--space-3) 0' }}>
            Protótipo · Hackathon Itaú 2026 · dados fictícios
          </p>
        </nav>

        <main className="conteudo">{children}</main>
      </div>
    </div>
  );
}
