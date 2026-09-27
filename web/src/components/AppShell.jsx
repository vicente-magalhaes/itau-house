import React from 'react';
import { Logo, Icon, Button, Badge, Select } from '../ds.js';
import { Avatar, SeloSimulado } from './comuns.jsx';
import { useSessao } from '../sessao.jsx';
import { Link, irPara } from '../router.jsx';
import { filaAprovacao } from '../data/governanca.js';

const ITENS = [
  { para: '/', rotulo: 'Catálogo', icone: 'layout-grid' },
  { para: '/sugestao', rotulo: 'No seu fluxo', icone: 'wand-sparkles' },
  { para: '/publicar', rotulo: 'Publicar', icone: 'upload' },
  { para: '/aprovacoes', rotulo: 'Aprovações', icone: 'clipboard-check', soCoordenador: true },
];

function ItemNav({ item, ativo, contador }) {
  const [h, setH] = React.useState(false);
  return (
    <Link para={item.para}>
      <span
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          height: 40,
          padding: '0 var(--space-3)',
          borderRadius: 'var(--radius-md)',
          background: ativo ? 'var(--surface-muted)' : h ? 'var(--surface-subtle)' : 'transparent',
          color: ativo ? 'var(--text-primary)' : 'var(--text-secondary)',
          font: `var(--fw-bold) var(--fs-body-sm)/1 var(--font-text)`,
          transition: 'background var(--dur-fast) var(--ease-standard)',
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name={item.icone} size={18} />
        {item.rotulo}
        {contador > 0 && <Badge tone="brand">{contador}</Badge>}
      </span>
    </Link>
  );
}

export function AppShell({ rota, children }) {
  const { pessoa, rotuloPerfil, ehCoordenador, perfil, trocarPerfil, sair } = useSessao();
  const itens = ITENS.filter((i) => !i.soCoordenador || ehCoordenador);

  return (
    <div className="stack" style={{ minHeight: '100vh' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'var(--surface-page)',
          boxShadow: 'inset 0 -1px 0 var(--border-subtle)',
        }}
      >
        <div className="container row spread row-4" style={{ height: 72 }}>
          <div className="row row-5">
            <Link para="/" aria-label="Itaú House, ir para o catálogo">
              <span className="row row-3">
                <Logo size={36} basePath="/" />
                <span style={{ font: 'var(--fw-bold) var(--fs-h3)/1 var(--font-display)', letterSpacing: 'var(--ls-display)' }}>
                  Itaú House
                </span>
              </span>
            </Link>
            <nav className="row row-2" aria-label="Seções">
              {itens.map((i) => (
                <ItemNav
                  key={i.para}
                  item={i}
                  ativo={i.para === '/' ? rota === '/' : rota.startsWith(i.para)}
                  contador={i.para === '/aprovacoes' ? filaAprovacao.length : 0}
                />
              ))}
            </nav>
          </div>

          <div className="row row-3">
            <SeloSimulado
              placement="bottom"
              ajuda="Login por SSO simulado. Troque o perfil aqui para ver o que cada um enxerga."
            >
              Perfil de demonstração
            </SeloSimulado>
            <Select
              size="sm"
              label="Perfil"
              options={[
                { value: 'dev', label: 'Dev' },
                { value: 'coordenador', label: 'Coordenação' },
              ]}
              value={perfil}
              onChange={(e) => trocarPerfil(e.target.value)}
              style={{ width: 224 }}
            />
            <span className="row row-2">
              <Avatar iniciais={pessoa.iniciais} tamanho={36} />
              <span className="stack" style={{ lineHeight: 1.2 }}>
                <span style={{ font: 'var(--fw-bold) var(--fs-body-sm)/1.2 var(--font-text)' }}>{pessoa.nome}</span>
                <span className="caption">{rotuloPerfil} · {pessoa.squad}</span>
              </span>
            </span>
            <Button variant="ghost" size="sm" iconLeft="log-out" onClick={() => { sair(); irPara('/entrar'); }}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="grow">{children}</main>

      <footer style={{ background: 'var(--surface-subtle)', marginTop: 'var(--space-8)' }}>
        <div className="container stack stack-2" style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-6)' }}>
          <div className="row row-3 wrap">
            <Logo size={30} basePath="/" />
            <span style={{ font: 'var(--fw-bold) var(--fs-body-sm)/1 var(--font-text)' }}>Itaú House</span>
            <SeloSimulado ajuda="Todos os ativos, pessoas e números desta tela são fictícios.">Dados fictícios</SeloSimulado>
          </div>
          <p className="caption" style={{ maxWidth: 720 }}>
            Protótipo do Hackathon Itaú 2026 (Case C, Jornada de agentes), feito pela equipe da Poli Júnior.
            Não é um produto oficial do Itaú e não se conecta a nenhum sistema do banco.
          </p>
        </div>
      </footer>
    </div>
  );
}
