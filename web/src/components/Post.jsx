import React from 'react';
import { Icon } from '../ds.js';
import { Avatar } from './comuns.jsx';
import { Link, irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { iconeTipo, rotuloTipo, tempoRelativo, iconeVisibilidade, rotuloVisibilidade } from '../data/catalogo.js';

// Um "gostei" por pessoa por ativo. Clicar de novo desfaz (RF-28).
export function BotaoCurtir({ ativo, desativado }) {
  const { curtidos, curtir, curtidasDe } = useSessao();
  const curtido = curtidos.includes(ativo.id);
  const total = curtidasDe(ativo);
  return (
    <button
      type="button"
      className="pill"
      aria-pressed={curtido}
      aria-label={`Gostei. ${total} curtidas`}
      disabled={desativado}
      onClick={(e) => {
        e.stopPropagation();
        if (!desativado) curtir(ativo.id);
      }}
    >
      <Icon name="arrow-big-up" size={18} />
      {total}
    </button>
  );
}

export function Instalacoes({ ativo }) {
  const { instalacoesDe } = useSessao();
  const total = instalacoesDe(ativo);
  return (
    <span className="pill pill-fixa" aria-label={`${total} instalações`}>
      <Icon name="download" size={16} />
      {total}
    </span>
  );
}

// Linha do feed. O artigo inteiro abre o post com o mouse; o título é o link do teclado.
export function PostCard({ ativo, preview }) {
  const abrir = preview ? undefined : () => irPara('/ativo/' + ativo.id);
  const restrito = ativo.visibilidade !== 'banco';
  return (
    <article className="post" onClick={abrir} style={preview ? { cursor: 'default', margin: 0 } : undefined}>
      <div className="post-meta">
        <Avatar iniciais={ativo.autor.iniciais} tamanho={20} tone="neutro" />
        <span className="strong">{ativo.autor.nome}</span>
        <span aria-hidden="true">·</span>
        <span>{ativo.squad}</span>
        <span aria-hidden="true">·</span>
        <span>{tempoRelativo(ativo.publicadoEm || '2026-09-25')}</span>
        <span className="grow" />
        {restrito && (
          <Icon name={iconeVisibilidade(ativo.visibilidade)} size={14} color="var(--text-tertiary)" label={'Alcance: ' + rotuloVisibilidade(ativo.visibilidade)} />
        )}
        <span className="pastilha">
          <Icon name={iconeTipo(ativo.tipo)} size={14} />
          {rotuloTipo(ativo.tipo)}
        </span>
      </div>

      <h2 style={{ margin: 0 }}>
        {preview ? (
          <span className="post-titulo">{ativo.nome}</span>
        ) : (
          <Link para={'/ativo/' + ativo.id} className="post-titulo" onClick={(e) => e.stopPropagation()}>
            {ativo.nome}
          </Link>
        )}
      </h2>
      <p className="post-resumo">{ativo.resumo}</p>

      <div className="post-acoes">
        <BotaoCurtir ativo={ativo} desativado={preview} />
        {preview ? (
          <span className="pill pill-fixa">
            <Icon name="message-circle" size={16} />0
          </span>
        ) : (
          <Link
            para={'/ativo/' + ativo.id}
            className="pill"
            aria-label={`${ativo.comentarios.length} comentários`}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon name="message-circle" size={16} />
            {ativo.comentarios.length}
          </Link>
        )}
        <Instalacoes ativo={ativo} />
      </div>
    </article>
  );
}
