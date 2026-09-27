import React from 'react';
import { Icon, Badge, Tooltip } from '../ds.js';

// Peças pequenas que várias telas repetem. Tudo por token: nada de hex ou px de marca solto.

export function Avatar({ iniciais, tamanho = 40, tone = 'brand', style }) {
  const cores = {
    brand: ['var(--itau-laranja)', 'var(--itau-preto)'],
    escuro: ['var(--itau-preto)', 'var(--itau-branco)'],
    neutro: ['var(--gray-100)', 'var(--itau-preto)'],
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
        font: `var(--fw-bold) ${Math.round(tamanho * 0.36)}px/1 var(--font-text)`,
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
      <span
        tabIndex={0}
        aria-describedby={idAjuda}
        style={{ display: 'inline-flex', borderRadius: 'var(--radius-pill)', cursor: 'help' }}
      >
        <Badge tone="neutral" style={{ gap: 'var(--space-1)', ...style }}>
          <Icon name="flask-conical" size={12} />
          {children}
        </Badge>
        <span id={idAjuda} className="sr-only">{ajuda}</span>
      </span>
    </Tooltip>
  );
}

// Bloco de apoio (aviso, nota, explicação) sem o peso de um card. Raio único: --radius-md.
export function Painel({ icone, cor = 'var(--text-tertiary)', children, style }) {
  return (
    <div
      className="row row-3"
      style={{
        alignItems: 'flex-start',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-subtle)',
        ...style,
      }}
    >
      {icone && <Icon name={icone} size={20} color={cor} style={{ flex: 'none', marginTop: 2 }} />}
      <div className="stack stack-1 grow small">{children}</div>
    </div>
  );
}

export function Meta({ icone, children, style }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        color: 'var(--text-secondary)',
        font: 'var(--fw-regular) var(--fs-body-sm)/1.2 var(--font-text)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icone && <Icon name={icone} size={16} color="var(--text-tertiary)" />}
      {children}
    </span>
  );
}

export function Secao({ titulo, acao, children, style }) {
  return (
    <section className="stack stack-4" style={style}>
      <div className="row spread row-3">
        <h2 style={{ font: `var(--fw-bold) var(--fs-h3)/var(--lh-heading) var(--font-display)` }}>{titulo}</h2>
        {acao}
      </div>
      {children}
    </section>
  );
}

export function Vazio({ icone = 'search-x', titulo, children, acao }) {
  return (
    <div
      className="stack stack-3"
      style={{
        alignItems: 'center',
        textAlign: 'center',
        padding: 'var(--space-8) var(--space-5)',
        background: 'var(--surface-subtle)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <Icon name={icone} size={40} color="var(--text-tertiary)" />
      <h2 style={{ font: 'var(--fw-bold) var(--fs-h3)/var(--lh-heading) var(--font-display)' }}>{titulo}</h2>
      {children && <p className="muted" style={{ maxWidth: 420 }}>{children}</p>}
      {acao}
    </div>
  );
}

// Grau de risco do ativo: define quais gates a publicação precisa passar.
export function SeloGrau({ grau }) {
  if (grau === 'alto') return <Badge tone="dark">Grau alto</Badge>;
  return <Badge tone="neutral">Grau baixo</Badge>;
}

export function BarraProgresso({ valor, rotulo, style }) {
  return (
    <div className="stack stack-1" style={style}>
      {rotulo && <div className="caption">{rotulo}</div>}
      <div
        role="progressbar"
        aria-valuenow={valor}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ height: 8, borderRadius: 'var(--radius-pill)', background: 'var(--surface-muted)', overflow: 'hidden' }}
      >
        <div style={{ width: `${valor}%`, height: '100%', background: 'var(--itau-laranja)' }} />
      </div>
    </div>
  );
}
