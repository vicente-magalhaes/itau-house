import React from 'react';
import { Button, Icon } from '../ds.js';
import { Avatar, SeloSimulado } from '../components/comuns.jsx';
import { BotaoCurtir, Instalacoes } from '../components/Post.jsx';
import { Link, irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { cenarioSugestao } from '../data/governanca.js';
import { acharAtivo, iconeTipo, rotuloTipo } from '../data/catalogo.js';

// Descoberta no fluxo (RF-02 a RF-10): o aviso chega no editor de quem está codando.
// Tudo aqui é simulado: a transcrição é um roteiro fixo de data/governanca.js.

const MS_POR_LINHA = 700;

// O laranja é só do Itaú House.
const AUTORES = {
  dev: { prefixo: 'você', cor: 'var(--itau-branco)' },
  hook: { prefixo: 'hook', cor: 'var(--gray-300)' },
  agente: { prefixo: 'Itaú House', cor: 'var(--brand)' },
};

const DECISOES = [
  { valor: 'reaproveitar', rotulo: 'Reaproveitar', icone: 'download', variante: 'primary' },
  { valor: 'adaptar', rotulo: 'Adaptar', icone: 'git-fork', variante: 'secondary' },
  { valor: 'criar', rotulo: 'Criar do zero', icone: 'pencil', variante: 'outline' },
];

function resultadoDe(valor, ativo) {
  if (valor === 'reaproveitar') return `Instalado na versão ${ativo.versao}. O reuso conta no post de ${ativo.autor.nome}.`;
  if (valor === 'adaptar') return `Cópia criada a partir da versão ${ativo.versao}, com "derivado de" apontando para o original.`;
  return 'Seguimos sem reuso. O convite para publicar volta no fim da tarefa.';
}

export function Sugestao() {
  const { instalar } = useSessao();
  const linhas = cenarioSugestao.transcricao;
  const achado = cenarioSugestao.achado;
  const ativo = acharAtivo(achado.ativoId);

  const [visiveis, setVisiveis] = React.useState(0);
  const [animando, setAnimando] = React.useState(false);
  const [decisao, setDecisao] = React.useState(null);

  // Sem clique, a transcrição se completa sozinha: numa demo a tela nunca pode parecer vazia.
  React.useEffect(() => {
    if (animando || visiveis > 0) return undefined;
    const t = setTimeout(() => setVisiveis(linhas.length), 1000);
    return () => clearTimeout(t);
  }, [animando, visiveis, linhas.length]);

  React.useEffect(() => {
    if (!animando) return undefined;
    const timers = linhas.map((_, i) =>
      setTimeout(() => {
        setVisiveis(i + 1);
        if (i === linhas.length - 1) setAnimando(false);
      }, MS_POR_LINHA * (i + 1)),
    );
    return () => timers.forEach(clearTimeout);
  }, [animando, linhas]);

  function rodar() {
    setDecisao(null);
    setVisiveis(0);
    setAnimando(true);
  }

  function decidir(valor) {
    setDecisao(valor);
    if (valor !== 'criar' && ativo) instalar(ativo.id);
  }

  const concluido = visiveis >= linhas.length;

  return (
    <div className="stack stack-5" style={{ maxWidth: 760 }}>
      <div className="row spread">
        <h1 className="titulo-pagina">No seu editor</h1>
        <SeloSimulado ajuda="A detecção por hook é simulada. Nenhuma ferramenta de código está conectada.">Momento simulado</SeloSimulado>
      </div>

      <div style={{ borderRadius: 'var(--radius-md)', background: 'var(--surface-inverse)', color: 'var(--text-inverse)', overflow: 'hidden' }}>
        <div className="row spread" style={{ padding: 'var(--space-2) var(--space-4)', boxShadow: 'inset 0 -1px 0 var(--gray-800)' }}>
          <span className="row row-2 caption" style={{ color: 'var(--gray-300)' }}>
            <Icon name="square-terminal" size={16} />
            Claude Code · {cenarioSugestao.dev.squad}
          </span>
          <span className="row row-1">
            <button type="button" className="chip" style={{ color: 'var(--gray-300)', height: 28 }} onClick={rodar} disabled={animando}>
              <Icon name="play" size={14} />
              Rodar de novo
            </button>
          </span>
        </div>
        <div className="mono stack stack-2" role="log" aria-live="polite" style={{ padding: 'var(--space-4)', minHeight: 132 }}>
          {linhas.slice(0, visiveis).map((l, i) => {
            const a = AUTORES[l.de] || AUTORES.dev;
            return (
              <div key={i} style={{ color: a.cor }}>
                <span style={{ color: 'var(--gray-400)' }}>{a.prefixo} › </span>
                {l.texto}
              </div>
            );
          })}
        </div>
      </div>

      {concluido && ativo && (
        <div className="caixa stack stack-4">
          <div className="post-meta">
            <Avatar iniciais={ativo.autor.iniciais} tamanho={20} tone="neutro" />
            <span className="strong">{ativo.autor.nome}</span>
            <span aria-hidden="true">·</span>
            <span>{ativo.squad}</span>
            <span className="grow" />
            <span className="pastilha" style={{ background: 'var(--brand)', color: 'var(--on-brand)' }}>
              {achado.aderencia}% parecido
            </span>
            <span className="pastilha">
              <Icon name={iconeTipo(ativo.tipo)} size={14} />
              {rotuloTipo(ativo.tipo)}
            </span>
          </div>
          <Link para={'/ativo/' + ativo.id} className="post-titulo">
            {ativo.nome}
          </Link>
          <ul className="stack stack-2" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {achado.porques.map((p) => (
              <li key={p} className="row row-2 small" style={{ alignItems: 'flex-start' }}>
                <Icon name="check" size={16} color="var(--status-success)" style={{ marginTop: 2 }} />
                {p}
              </li>
            ))}
            <li className="row row-2 small" style={{ alignItems: 'flex-start' }}>
              <Icon name="triangle-alert" size={16} style={{ marginTop: 2 }} />
              {achado.limite}
            </li>
          </ul>
          <div className="post-acoes">
            <BotaoCurtir ativo={ativo} />
            <Instalacoes ativo={ativo} />
          </div>

          <hr className="divider" />

          {decisao ? (
            <div className="row row-3">
              <Icon name={decisao === 'criar' ? 'pencil' : 'circle-check'} size={20} color="var(--status-success)" />
              <span className="small grow" role="status">{resultadoDe(decisao, ativo)}</span>
            </div>
          ) : (
            <div className="row row-3 wrap">
              {DECISOES.map((d) => (
                <Button key={d.valor} variant={d.variante} size="sm" iconLeft={d.icone} onClick={() => decidir(d.valor)}>
                  {d.rotulo}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {concluido && (
        <section className="stack stack-2">
          <h2 className="small strong">Parecidos</h2>
          {cenarioSugestao.parecidos.map((p) => {
            const outro = acharAtivo(p.ativoId);
            if (!outro) return null;
            return (
              <div key={p.ativoId} className="post" onClick={() => irPara('/ativo/' + outro.id)}>
                <div className="row row-3">
                  <span className="pastilha">{p.aderencia}%</span>
                  <Link para={'/ativo/' + outro.id} className="small strong grow" onClick={(e) => e.stopPropagation()}>
                    {outro.nome}
                  </Link>
                </div>
                <span className="caption">{p.porque}</span>
              </div>
            );
          })}
        </section>
      )}

    </div>
  );
}
