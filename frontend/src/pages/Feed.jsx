import React from 'react';
import { Button, Icon } from '../ds.js';
import { Foto, Vazio } from '../components/comuns.jsx';
import { Filtro } from '../components/Filtro.jsx';
import { PostCard } from '../components/Post.jsx';
import { irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { ativos, pedidos, ESTANTES, PAPEIS, ORDENS, ordenar, buscar, visivelPara } from '../data/catalogo.js';
import { ativoDaApi } from '../data/daApi.js';
import { listarAtivos, useDaApi } from '../api.js';
import { useEstreito } from '../tela.js';

const OPCOES_ESTANTE = [{ value: 'tudo', label: 'Todas as estantes' }, ...Object.entries(ESTANTES).map(([value, e]) => ({ value, label: e.nome }))];

// Filtros que saem dos próprios ativos (RF-26): papel de quem publicou e frente.
// Da API vêm papéis que os fictícios não têm, como Risco e Coordenação: entram depois dos cinco de sempre.
function opcoesPapel(lista) {
  const extras = [...new Set(lista.map((a) => a.autor.papel).filter((p) => p && !PAPEIS.includes(p)))].sort();
  return [{ value: 'todos', label: 'Todos os papéis' }, ...[...PAPEIS, ...extras].map((p) => ({ value: p, label: p }))];
}

function opcoesFrente(lista) {
  const frentes = [...new Set(lista.map((a) => a.frente).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  return [{ value: 'todas', label: 'Todas as frentes' }, ...frentes.map((f) => ({ value: f, label: f }))];
}

// Pedidos abertos e os ativos mais reaproveitados. Fica fixa ao rolar.
function Lateral({ visiveis }) {
  const { querem, reusosDe } = useSessao();
  const top = visiveis
    .slice()
    .sort((a, b) => reusosDe(b) - reusosDe(a))
    .slice(0, 5);

  return (
    <aside className="coluna-lateral lateral-fixa">
      <div className="painel">
        <div className="row spread row-2">
          <h2 className="titulo-card">Pedidos abertos</h2>
          <button type="button" className="btn-texto" onClick={() => irPara('/pedidos')}>
            Ver todos
          </button>
        </div>
        {pedidos.slice(0, 3).map((p) => (
          <button key={p.id} type="button" className="linha-pessoa" style={{ alignItems: 'flex-start' }} onClick={() => irPara('/pedidos')}>
            <Foto pessoa={p.autor} tamanho={48} />
            <span className="stack stack-1" style={{ minWidth: 0 }}>
              <span className="nome">{p.titulo}</span>
              <span className="meta">
                {p.autor.primeiro} · {p.querem + (querem.includes(p.id) ? 1 : 0)} pessoas também querem
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="painel">
        <h2 className="titulo-card">Mais reaproveitados</h2>
        {top.map((a) => (
          <button key={a.id} type="button" className="linha-pessoa" onClick={() => irPara('/ativo/' + a.id)}>
            <Foto pessoa={a.autor} tamanho={48} />
            <span className="stack stack-1 grow">
              <span className="nome">{a.titulo}</span>
              <span className="meta">
                {a.autor.primeiro} · {a.autor.papel}
              </span>
            </span>
            <span className="nome" title="Reaproveitamentos">
              {reusosDe(a)}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

// Início: busca em linguagem natural, filtros e cards por popularidade (RF-25, RF-26, RF-28).
export function Feed() {
  const { pessoa, usuarioId, busca, setBusca, filtros, setFiltros, curtidasDe, reusosDe } = useSessao();
  const estreito = useEstreito();
  const mudar = (campo) => (valor) => setFiltros((f) => ({ ...f, [campo]: valor }));

  // A API já devolve só o que a persona pode ver (RF-05). Nos dados fictícios, o filtro de alcance é daqui.
  // A ordem fica na tela: as cinco ordens do filtro saem da mesma lista.
  const { dados, erro, carregando } = useDaApi(
    'ativos:' + usuarioId,
    () => listarAtivos(usuarioId).then((lista) => lista.map(ativoDaApi)),
    () => ativos.filter((a) => visivelPara(a, pessoa)),
  );
  const visiveis = React.useMemo(() => dados || [], [dados]);
  const papeis = React.useMemo(() => opcoesPapel(visiveis), [visiveis]);
  const frentes = React.useMemo(() => opcoesFrente(visiveis), [visiveis]);

  const lista = React.useMemo(() => {
    const filtrados = visiveis.filter(
      (a) =>
        (filtros.estante === 'tudo' || a.estante === filtros.estante) &&
        (filtros.papel === 'todos' || a.autor.papel === filtros.papel) &&
        (filtros.frente === 'todas' || a.frente === filtros.frente),
    );
    return buscar(filtrados, busca) || ordenar(filtrados, filtros.ordem, curtidasDe, reusosDe);
  }, [visiveis, filtros, busca, curtidasDe, reusosDe]);

  const termo = busca.trim();
  const titulo = termo
    ? `${lista.length} ${lista.length === 1 ? 'resultado' : 'resultados'} pra "${termo}"`
    : filtros.estante !== 'tudo'
      ? ESTANTES[filtros.estante].nome
      : filtros.frente !== 'todas'
        ? `Da frente ${filtros.frente}`
        : filtros.ordem === 'alta'
        ? 'Em alta no banco'
          : ORDENS.find((o) => o.value === filtros.ordem).label;

  const conteudo =
    carregando ? (
      <Vazio icone="loader" titulo="Carregando o catálogo" />
    ) : erro ? (
      <Vazio icone="circle-alert" titulo={erro.message} />
    ) : lista.length === 0 ? (
      <div className="painel anima-entrar" style={{ alignItems: 'flex-start', padding: 'var(--space-6)' }}>
        <span className="icone-quadrado">
          <Icon name="hand" size={20} />
        </span>
        <h2 className="titulo-secao">Ninguém publicou isso ainda</h2>
        <p className="texto" style={{ maxWidth: '52ch' }}>
          Que tal fazer um pedido? A gente avisa quando alguém criar. Se você mesmo criar, publique e o crédito fica com você.
        </p>
        <Button variant="primary" size="sm" iconLeft="hand" onClick={() => irPara('/pedidos')}>
          Fazer um pedido
        </Button>
      </div>
    ) : (
      // Filtro novo remonta a grade e os cards entram de novo, um a um.
      <div key={filtros.estante + filtros.papel + filtros.frente + filtros.ordem} className="grade anima-escalonada">
        {lista.map((a) => (
          <PostCard key={a.id} ativo={a} />
        ))}
      </div>
    );

  if (estreito) {
    return (
      <div className="feed-movel">
        {/* As ordens viram abas fixas, como o "Para você" do X. */}
        <div className="abas-ordem" role="tablist" aria-label="Ordenar">
          {ORDENS.map((o) => (
            <button
              key={o.value}
              type="button"
              role="tab"
              className="aba-ordem"
              aria-selected={filtros.ordem === o.value}
              onClick={() => mudar('ordem')(o.value)}
            >
              <span>{o.label}</span>
            </button>
          ))}
        </div>

        <label className="compositor">
          <Foto pessoa={pessoa} tamanho={40} />
          <span className="sr-only">Buscar no Itaú House</span>
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="O que você vai criar hoje?" enterKeyHint="search" />
          {termo && (
            <button type="button" className="busca-limpar" aria-label="Limpar busca" onClick={() => setBusca('')}>
              <Icon name="x" size={16} />
            </button>
          )}
        </label>

        <div className="filtros-movel">
          <Filtro rotulo="Estante" valor={filtros.estante} opcoes={OPCOES_ESTANTE} onChange={mudar('estante')} />
          <Filtro rotulo="Publicado por" valor={filtros.papel} opcoes={papeis} onChange={mudar('papel')} />
          <Filtro rotulo="Frente" valor={filtros.frente} opcoes={frentes} onChange={mudar('frente')} />
        </div>

        {(termo || filtros.estante !== 'tudo' || filtros.frente !== 'todas') && (
          <p className="meta feed-movel-titulo" aria-live="polite">
            {titulo}
          </p>
        )}

        {conteudo}
      </div>
    );
  }

  return (
    <div className="colunas">
      <div className="coluna-principal">
        <section className="stack stack-4">
          <span className="nome" style={{ color: 'var(--ih-ink2)' }}>
            Oi, {pessoa.primeiro}
          </span>
          <h1 className="titulo-pagina">
            O que você vai <span className="destaque">criar hoje?</span>
          </h1>
          <label className="busca">
            <Icon name="search" size={20} color="var(--ih-ink3)" />
            <span className="sr-only">Buscar no Itaú House</span>
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Descreva o que você precisa, do jeito que você falaria" />
            {termo && (
              <button type="button" className="busca-limpar" aria-label="Limpar busca" onClick={() => setBusca('')}>
                <Icon name="x" size={16} />
              </button>
            )}
          </label>
        </section>

        <div className="row wrap spread row-4">
          <h2 className="titulo-secao" aria-live="polite">
            {titulo}
          </h2>
          <div className="row wrap row-2">
            <Filtro rotulo="Estante" valor={filtros.estante} opcoes={OPCOES_ESTANTE} onChange={mudar('estante')} />
            <Filtro rotulo="Publicado por" valor={filtros.papel} opcoes={papeis} onChange={mudar('papel')} />
            <Filtro rotulo="Frente" valor={filtros.frente} opcoes={frentes} onChange={mudar('frente')} />
            <Filtro rotulo="Ordenar" valor={filtros.ordem} opcoes={ORDENS} onChange={mudar('ordem')} />
          </div>
        </div>

        {conteudo}
      </div>

      <Lateral visiveis={visiveis} />
    </div>
  );
}
