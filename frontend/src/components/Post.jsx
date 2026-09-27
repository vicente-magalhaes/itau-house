import React from 'react';
import { Icon } from '../ds.js';
import { Foto } from './comuns.jsx';
import { NumeroVivo, Pulso } from './movimento.jsx';
import { irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { iconeTipo, tempoRelativo } from '../data/catalogo.js';
import { useEstreito } from '../tela.js';

// Um "gostei" por pessoa por ativo. Clicar de novo desfaz (RF-28). Com a API, a curtida vai para o back.
export function BotaoCurtir({ ativo, noCard, desativado }) {
  const { curtidoDe, curtir, curtidasDe } = useSessao();
  const curtido = curtidoDe(ativo);
  const total = curtidasDe(ativo);
  return (
    <button
      type="button"
      className={'btn btn-curtir' + (noCard ? ' btn-curtir-card' : '')}
      aria-pressed={curtido}
      aria-label={`Gostei. ${total} curtidas`}
      disabled={desativado}
      onClick={(e) => {
        e.stopPropagation();
        if (!desativado) curtir(ativo);
      }}
    >
      <Pulso gatilho={curtido} efeito="seta">
        <Icon name="arrow-big-up" size={noCard ? 16 : 18} />
      </Pulso>
      <NumeroVivo valor={total} />
    </button>
  );
}

// No celular o card vira post de linha do tempo, como no X: foto na coluna da esquerda, o tipo
// em cima como linha de contexto, nome e hora, texto e as ações espalhadas embaixo.
function PostLinha({ ativo, preview, abrir, verAutor }) {
  const { reusosDe } = useSessao();
  const quando = ativo.atualizadoEm ? tempoRelativo(ativo.atualizadoEm) : 'agora';
  return (
    <article className="post-linha" onClick={abrir} style={preview ? { cursor: 'default' } : undefined}>
      <span className="tipo-ativo post-contexto">
        <Icon name={iconeTipo(ativo.tipo)} size={16} color="var(--brand)" />
        {ativo.tipo}
      </span>
      <button type="button" className="post-foto" aria-label={`Perfil de ${ativo.autor.nome}`} onClick={verAutor}>
        <Foto pessoa={ativo.autor} tamanho={40} />
      </button>
      <div className="post-conteudo">
        <div className="post-cabeca">
          <span className="nome">{ativo.autor.nome}</span>
          <span className="meta post-cabeca-resto">
            {ativo.autor.cargo} · {quando}
          </span>
        </div>
        <h3 className="titulo-card">
          {preview ? (
            ativo.titulo
          ) : (
            <a href={'#/ativo/' + ativo.id} className="link-reset" onClick={(e) => e.stopPropagation()}>
              {ativo.titulo}
            </a>
          )}
        </h3>
        <p className="texto resumo-2">{ativo.resumo}</p>
        <div className="post-acoes">
          <BotaoCurtir ativo={ativo} noCard desativado={preview} />
          <span className="contagem" title="Reaproveitamentos">
            <Icon name="repeat" size={18} label="Reaproveitamentos" />
            {reusosDe(ativo)}
          </span>
          <span className="contagem" title="Adaptações">
            <Icon name="git-fork" size={18} label="Adaptações" />
            {ativo.adapt}
          </span>
        </div>
      </div>
    </article>
  );
}

// Card de ativo do início e do perfil (RF-25). O card inteiro abre a página; o título é o link do teclado.
export function PostCard({ ativo, preview }) {
  const { reusosDe } = useSessao();
  const estreito = useEstreito();
  const abrir = preview ? undefined : () => irPara('/ativo/' + ativo.id);
  const verAutor = (e) => {
    e.stopPropagation();
    if (!preview) irPara('/perfil/' + ativo.autor.id);
  };
  if (estreito) return <PostLinha ativo={ativo} preview={preview} abrir={abrir} verAutor={verAutor} />;
  return (
    <article className="card-ativo" onClick={abrir} style={preview ? { cursor: 'default' } : undefined}>
      <div className="card-corpo">
        <span className="tipo-ativo">
          <Icon name={iconeTipo(ativo.tipo)} size={20} color="var(--brand)" />
          {ativo.tipo}
        </span>
        <h3 className="titulo-card">
          {preview ? (
            ativo.titulo
          ) : (
            <a href={'#/ativo/' + ativo.id} className="link-reset" onClick={(e) => e.stopPropagation()}>
              {ativo.titulo}
            </a>
          )}
        </h3>
        <p className="texto resumo-2">{ativo.resumo}</p>
        <button type="button" className="linha-pessoa card-autor" onClick={verAutor}>
          <Foto pessoa={ativo.autor} tamanho={32} />
          <span className="meta">
            <strong>{ativo.autor.nome}</strong> · {ativo.autor.cargo}
          </span>
        </button>
      </div>

      <div className="card-rodape">
        <BotaoCurtir ativo={ativo} noCard desativado={preview} />
        <span className="contagem" title="Reaproveitamentos">
          <Icon name="repeat" size={16} label="Reaproveitamentos" />
          {reusosDe(ativo)}
        </span>
        <span className="contagem" title="Adaptações">
          <Icon name="git-fork" size={16} label="Adaptações" />
          {ativo.adapt}
        </span>
        <span className="meta card-quando">{ativo.atualizadoEm ? tempoRelativo(ativo.atualizadoEm) : 'agora'}</span>
      </div>
    </article>
  );
}
