import React from 'react';
import { Logo, Icon, Button } from '../ds.js';
import { Foto, BotaoSec, Recado } from './comuns.jsx';
import { useSessao } from '../sessao.jsx';
import { Link, irPara } from '../router.jsx';
import { filaAprovacao } from '../data/governanca.js';
import { pedidos } from '../data/catalogo.js';

const NAV = [
  { para: '/', rotulo: 'Início', icone: 'house' },
  { para: '/pedidos', rotulo: 'Pedidos', icone: 'hand', contador: pedidos.length },
];

// Área da coordenação (RF-24): só aparece no perfil Coordenação.
const NAV_COORDENACAO = [
  { para: '/coord/fila', rotulo: 'Fila', icone: 'inbox', contador: filaAprovacao.length },
  { para: '/coord/dados', rotulo: 'Dados', icone: 'chart-column' },
];

function ItemNav({ para, rotulo, icone, contador, ativo }) {
  return (
    <Link para={para} className="btn btn-nav" aria-current={ativo ? 'page' : undefined}>
      <Icon name={icone} size={18} />
      {rotulo}
      {contador > 0 && <span className="contador">{contador}</span>}
    </Link>
  );
}

export function AppShell({ rota, children }) {
  const { pessoa, ehCoordenador, tema, trocarTema, limparFiltros, recado } = useSessao();
  const itens = ehCoordenador ? [...NAV, ...NAV_COORDENACAO] : NAV;
  const escuro = tema === 'escuro';
  const rotuloTema = escuro ? 'Ativar modo claro' : 'Ativar modo escuro';

  return (
    <div>
      <header className="topo">
        <button
          type="button"
          className="topo-marca"
          aria-label="Itaú House, ir para o início"
          onClick={() => {
            limparFiltros();
            irPara('/');
          }}
        >
          <Logo size={36} basePath="/" />
          <span className="some-no-estreito">Itaú House</span>
        </button>

        <span className="selo" tabIndex={0} title="Protótipo do Hackathon Itaú 2026 · dados fictícios">
          Protótipo
          <span className="sr-only">do Hackathon Itaú 2026. Não é um produto oficial do Itaú. Login, pessoas e números são fictícios.</span>
        </span>

        <nav className="topo-nav" aria-label="Navegação">
          {itens.map((i) => (
            <ItemNav key={i.para} {...i} ativo={i.para === '/' ? rota === '/' : rota.startsWith(i.para)} />
          ))}
        </nav>

        <span className="topo-espaco" />

        <BotaoSec icone={escuro ? 'sun' : 'moon'} onClick={trocarTema} aria-label={rotuloTema} title={rotuloTema}>
          <span className="some-no-estreito">{escuro ? 'Claro' : 'Escuro'}</span>
        </BotaoSec>
        <Button variant="primary" size="sm" iconLeft="plus" onClick={() => irPara('/publicar')}>
          Publicar
        </Button>
        <button type="button" className="topo-foto" title={pessoa.nome} aria-label={`Seu perfil, ${pessoa.nome}`} onClick={() => irPara('/perfil')}>
          <Foto pessoa={pessoa} tamanho={36} />
        </button>
      </header>

      <main className="pagina">{children}</main>

      {recado && <Recado>{recado}</Recado>}
    </div>
  );
}
