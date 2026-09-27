import React from 'react';
import { Icon, Badge, Tooltip } from '../ds.js';

// Peças pequenas que várias telas repetem. Tudo por token: nada de hex ou px de marca solto.

export function Avatar({ iniciais, tamanho = 40, tone = 'brand', style }) {
  const cores = {
    brand: ['var(--brand)', 'var(--on-brand)'],
    escuro: ['var(--itau-preto)', 'var(--itau-branco)'],
    neutro: ['var(--surface-muted)', 'var(--text-primary)'],
  };
  const [bg, fg] = cores[tone] || cores.brand;
  return (
    <span
      aria-hidden="true"
      style={{
        width: tamanho,
        height: tamanho,
        flex: 'none',
        borderRadius: 'var(--radius-pill)',
        display: 'grid',
        placeItems: 'center',
        background: bg,
        color: fg,
        font: `var(--fw-bold) ${Math.round(tamanho * 0.4)}px/1 var(--font-text)`,
        ...style,
      }}
    >
      {iniciais}
    </span>
  );
}

// Marca o que é simulado. O regulamento exige deixar isso explícito em tela.
// O gatilho é focável e leva a explicação em texto: quem usa teclado ou leitor de tela também lê o aviso.
export function SeloSimulado({ children = 'Simulado', ajuda = 'Esta parte é uma simulação do protótipo. Nada é conectado a um sistema real do Itaú.', placement = 'top', style }) {
  const idAjuda = React.useId();
  return (
    <Tooltip content={ajuda} placement={placement}>
      <span tabIndex={0} aria-describedby={idAjuda} style={{ display: 'inline-flex', borderRadius: 'var(--radius-pill)', cursor: 'help' }}>
        <Badge tone="neutral" style={style}>{children}</Badge>
        <span id={idAjuda} className="sr-only">{ajuda}</span>
      </span>
    </Tooltip>
  );
}

export function Vazio({ icone = 'search-x', titulo, acao }) {
  return (
    <div className="stack stack-3" style={{ alignItems: 'center', textAlign: 'center', padding: 'var(--space-8) var(--space-5)' }}>
      <Icon name={icone} size={32} color="var(--text-tertiary)" />
      <p className="strong">{titulo}</p>
      {acao}
    </div>
  );
}

// Grau de risco do ativo: define quais gates a publicação precisa passar.
export function SeloGrau({ grau }) {
  if (grau === 'alto') return <Badge tone="dark">Grau alto</Badge>;
  return <Badge tone="neutral">Grau baixo</Badge>;
}

// Toast fixo no canto, igual em todas as telas.
export function Aviso({ children }) {
  return <div style={{ position: 'fixed', right: 'var(--space-5)', bottom: 'var(--space-5)', zIndex: 1100 }}>{children}</div>;
}
