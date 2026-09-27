import React from 'react';
import { Icon } from '../ds.js';
import { Foto } from './comuns.jsx';
import { irPara } from '../router.jsx';
import { useSessao } from '../sessao.jsx';
import { iconeTipo, tempoRelativo } from '../data/catalogo.js';

// Um "gostei" por pessoa por ativo. Clicar de novo desfaz (RF-28).
export function BotaoCurtir({ ativo, noCard, desativado }) {
  const { curtidos, curtir, curtidasDe } = useSessao();
  const curtido = curtidos.includes(ativo.id);
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
        if (!desativado) curtir(ativo.id);
      }}
    >
      <Icon name="arrow-big-up" size={noCard ? 16 : 18} />
      {total}
    </button>
  );
}

// Card de ativo do início e do perfil (RF-25). O card inteiro abre a página; o título é o link do teclado.
export function PostCard({ ativo, preview }) {
  const { reusosDe } = useSessao();
  const abrir = preview ? undefined : () => irPara('/ativo/' + ativo.id);
  const verAutor = (e) => {
    e.stopPropagation();
    if (!preview) irPara('/perfil/' + ativo.autor.id);
  };
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
          <Foto pessoa={ativo.autor} tamanho={24} />
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
