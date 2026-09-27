import React from 'react';
import { Logo, Icon } from '../ds.js';
import { Foto, BotaoSec, Recado } from './comuns.jsx';
import { useSaida } from './movimento.jsx';
import { useSessao } from '../sessao.jsx';
import { Link, irPara } from '../router.jsx';
import { useFila } from '../fila.js';
import { pedidos } from '../data/catalogo.js';

const NAV = [
  { para: '/', rotulo: 'Início', icone: 'house' },
  { para: '/pedidos', rotulo: 'Pedidos', icone: 'hand', contador: pedidos.length },
];

// Área da coordenação (RF-24): só aparece no perfil Coordenação. O contador da fila vem da mesma leitura da tela.
function navCoordenacao(naFila) {
  return [
    { para: '/coord/fila', rotulo: 'Fila', icone: 'inbox', contador: naFila },
    { para: '/coord/dados', rotulo: 'Dados', icone: 'chart-column' },
  ];
}

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
  const { pessoa, ehCoordenador, limparFiltros, recado } = useSessao();
  const fila = useFila();
  const itens = ehCoordenador ? [...NAV, ...navCoordenacao(fila.dados ? fila.dados.length : 0)] : NAV;
  const [recadoMostrado, recadoSaindo] = useSaida(recado);

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

        {/* Secundário de propósito: o único laranja da tela é a ação principal da página. */}
        <BotaoSec icone="plus" onClick={() => irPara('/publicar')}>
          Publicar
        </BotaoSec>
        <button type="button" className="topo-foto" title={pessoa.nome} aria-label={`Seu perfil, ${pessoa.nome}`} onClick={() => irPara('/perfil')}>
          <Foto pessoa={pessoa} tamanho={40} />
        </button>
      </header>

      {/* A chave pela rota remonta a página e a entrada anima a cada troca de tela. */}
      <main key={rota} className="pagina anima-entrar">
        {children}
      </main>

      {recadoMostrado && (
        <Recado key={recadoMostrado} saindo={recadoSaindo}>
          {recadoMostrado}
        </Recado>
      )}
    </div>
  );
}
