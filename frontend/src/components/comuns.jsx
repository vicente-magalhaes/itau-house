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

// Foto redonda da pessoa. Sem internet, ou se a imagem falhar, mostra as iniciais.
export function Foto({ pessoa, tamanho = 40, anel, className = '', style }) {
  const [falhou, setFalhou] = React.useState(false);
  const classes = ['foto', anel ? 'foto-anel' : '', className].filter(Boolean).join(' ');
  if (falhou || !pessoa.foto) {
    return <Avatar iniciais={pessoa.iniciais} tamanho={tamanho} tone="neutro" style={{ ...(anel ? { boxShadow: '0 0 0 2px var(--brand)' } : null), ...style }} />;
  }
  return <img src={pessoa.foto} alt="" width={tamanho} height={tamanho} className={classes} style={{ width: tamanho, height: tamanho, ...style }} onError={() => setFalhou(true)} />;
}

// Botão secundário do redesign: 36px e borda fina, como o primário do DS em tamanho sm.
export function BotaoSec({ icone, children, onClick, type = 'button', className = '', ...resto }) {
  return (
    <button type={type} className={('btn btn-sec ' + className).trim()} onClick={onClick} {...resto}>
      {icone && <Icon name={icone} size={18} />}
      {children}
    </button>
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

// Toast fixo no canto, usado pelas telas de publicar e da fila.
export function Aviso({ children }) {
  return <div style={{ position: 'fixed', right: 'var(--space-5)', bottom: 'var(--space-5)', zIndex: 1100 }}>{children}</div>;
}

// Recado curto no pé da tela, disparado por avisar() da sessão.
export function Recado({ children }) {
  return (
    <div role="status" className="recado">
      <Icon name="check" size={18} color="var(--brand)" />
      {children}
    </div>
  );
}
