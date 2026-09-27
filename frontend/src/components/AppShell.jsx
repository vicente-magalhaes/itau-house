import React from 'react';
import { Logo, Icon } from '../ds.js';
import { Foto, BotaoSec, Recado } from './comuns.jsx';
import { InstalarNoAgente } from './InstalarNoAgente.jsx';
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

// Só o ícone na tela. O rótulo fica para o leitor de tela e para a dica do mouse.
function ItemNav({ para, rotulo, icone, contador, ativo }) {
  return (
    <Link
      para={para}
      className="btn btn-nav"
      aria-current={ativo ? 'page' : undefined}
      aria-label={contador > 0 ? `${rotulo}, ${contador}` : rotulo}
      title={rotulo}
    >
      <Icon name={icone} size={18} />
      {contador > 0 && <span className="contador">{contador}</span>}
    </Link>
  );
}

export function AppShell({ rota, children }) {
  const { pessoa, usuarioId, ehCoordenador, limparFiltros, recado } = useSessao();
  const [instalando, setInstalando] = React.useState(false);
  const fecharInstalar = React.useCallback(() => setInstalando(false), []);
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

        {/* RF-01: instalar o Itaú House no agente da pessoa, de qualquer tela. Fundo branco e a tomada
            laranja, como o ícone do tipo do ativo. No celular, só a tomada. */}
        <BotaoSec className="btn-instalar" aria-label="Instale no seu agente" title="Instale no seu agente" onClick={() => setInstalando(true)}>
          <Icon name="plug" size={18} color="var(--brand)" />
          <span className="some-no-celular">Instale no seu agente</span>
        </BotaoSec>

        <span className="topo-espaco" />

        <nav className="topo-nav" aria-label="Navegação">
          {itens.map((i) => (
            <ItemNav key={i.para} {...i} ativo={i.para === '/' ? rota === '/' : rota.startsWith(i.para)} />
          ))}
        </nav>

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

      {/* RNF-06: toda tela diz que é protótipo de hackathon e não produto oficial. */}
      <footer className="rodape caption">Protótipo do Hackathon Itaú 2026. Não é um produto oficial do Itaú.</footer>

      {instalando && <InstalarNoAgente pessoa={pessoa} usuarioId={usuarioId} onClose={fecharInstalar} />}

      {recadoMostrado && (
        <Recado key={recadoMostrado} saindo={recadoSaindo}>
          {recadoMostrado}
        </Recado>
      )}
    </div>
  );
}
