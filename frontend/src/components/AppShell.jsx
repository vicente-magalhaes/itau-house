import React from 'react';
import { Logo, Icon } from '../ds.js';
import { Foto, BotaoSec, Recado } from './comuns.jsx';
import { InstalarNoAgente } from './InstalarNoAgente.jsx';
import { useSaida } from './movimento.jsx';
import { useSessao } from '../sessao.jsx';
import { Link, irPara } from '../router.jsx';
import { useFila } from '../fila.js';
import { pedidos } from '../data/catalogo.js';
import { useEstreito } from '../tela.js';

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

// Telas de dentro no celular: a barra de cima troca a foto por voltar e mostra o nome da tela.
function tituloInterno(rota) {
  if (rota.startsWith('/ativo/')) return 'Ativo';
  if (rota.startsWith('/perfil/')) return 'Perfil';
  if (rota === '/publicar') return 'Publicar';
  if (rota.startsWith('/coord/dados/')) return 'Dados do ativo';
  return null;
}

function voltar() {
  if (window.history.length > 1) window.history.back();
  else irPara('/');
}

// Celular, no desenho do X: foto e logo em cima, abas só com ícone embaixo e Publicar flutuando.
// O laranja fica no logo, no botão de publicar e no ponto da aba atual.
function AppShellMovel({ rota, itens, children, recadoMostrado, recadoSaindo, aoInstalar, instalar }) {
  const { pessoa, limparFiltros } = useSessao();
  const titulo = tituloInterno(rota);
  const abas = [...itens, { para: '/perfil', rotulo: 'Perfil', icone: 'user-round' }];
  const inicio = () => {
    limparFiltros();
    irPara('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-movel">
      <header className="topo-movel">
        {titulo ? (
          <button type="button" className="topo-movel-botao" aria-label="Voltar" onClick={voltar}>
            <Icon name="arrow-left" size={22} />
          </button>
        ) : (
          <button type="button" className="topo-movel-botao" aria-label={`Seu perfil, ${pessoa.nome}`} onClick={() => irPara('/perfil')}>
            <Foto pessoa={pessoa} tamanho={32} />
          </button>
        )}
        {titulo ? (
          <span className="topo-movel-titulo">{titulo}</span>
        ) : (
          <button type="button" className="topo-movel-marca" aria-label="Itaú House, ir para o início" onClick={inicio}>
            <Logo size={32} basePath="/" />
          </button>
        )}
        {/* RF-01: instalar no agente, de qualquer tela. No celular, só a tomada laranja. */}
        <button type="button" className="topo-movel-botao" aria-label="Instale no seu agente" onClick={aoInstalar}>
          <Icon name="plug" size={22} color="var(--brand)" />
        </button>
      </header>

      <main key={rota} className="pagina anima-entrar">
        {children}
      </main>

      <footer className="rodape caption">Protótipo do Hackathon Itaú 2026. Não é um produto oficial do Itaú.</footer>

      {/* Como no X: o botão flutuante fica no início e no perfil. Nas outras telas a ação principal é da página. */}
      {(rota === '/' || rota === '/perfil') && (
        <button type="button" className="fab" aria-label="Publicar" onClick={() => irPara('/publicar')}>
          <Icon name="plus" size={26} />
        </button>
      )}

      <nav className="abas-movel" aria-label="Navegação">
        {abas.map((i) => {
          const ativo = i.para === '/' ? rota === '/' : rota === i.para || rota.startsWith(i.para + '/');
          return (
            <Link key={i.para} para={i.para} className="aba-movel" aria-current={ativo ? 'page' : undefined} aria-label={i.rotulo}>
              <Icon name={i.icone} size={24} />
              {i.contador > 0 && <span className="contador aba-movel-contador">{i.contador}</span>}
            </Link>
          );
        })}
      </nav>

      {instalar}

      {recadoMostrado && (
        <Recado key={recadoMostrado} saindo={recadoSaindo}>
          {recadoMostrado}
        </Recado>
      )}
    </div>
  );
}

export function AppShell({ rota, children }) {
  const { pessoa, usuarioId, ehCoordenador, limparFiltros, recado } = useSessao();
  const [instalando, setInstalando] = React.useState(false);
  const fecharInstalar = React.useCallback(() => setInstalando(false), []);
  const fila = useFila();
  const itens = ehCoordenador ? [...NAV, ...navCoordenacao(fila.dados ? fila.dados.length : 0)] : NAV;
  const [recadoMostrado, recadoSaindo] = useSaida(recado);
  const estreito = useEstreito();

  if (estreito) {
    return (
      <AppShellMovel
        rota={rota}
        itens={itens}
        recadoMostrado={recadoMostrado}
        recadoSaindo={recadoSaindo}
        aoInstalar={() => setInstalando(true)}
        instalar={instalando && <InstalarNoAgente pessoa={pessoa} usuarioId={usuarioId} onClose={fecharInstalar} />}
      >
        {children}
      </AppShellMovel>
    );
  }

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
