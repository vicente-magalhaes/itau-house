import React from 'react';
import { Icon } from './Icon.jsx';
export function IconButton({ icon, label, variant = 'ghost', size = 44, disabled, onClick, style }) {
  const [h, setH] = React.useState(false); const [p, setP] = React.useState(false);
  const map = { ghost: ['transparent', 'var(--surface-subtle)', 'var(--text-primary)'], filled: ['var(--itau-laranja)', 'var(--laranja-400)', 'var(--itau-preto)'], subtle: ['var(--surface-subtle)', 'var(--surface-muted)', 'var(--text-primary)'], inverse: ['var(--itau-preto)', 'var(--gray-800)', 'var(--itau-branco)'] };
  const [bg, hv, fg] = map[variant] || map.ghost;
  return (
    <button aria-label={label} title={label} disabled={disabled} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setP(false); }} onMouseDown={() => setP(true)} onMouseUp={() => setP(false)}
      style={{ width: size, height: size, display: 'inline-grid', placeItems: 'center', border: 0, borderRadius: 'var(--radius-pill)', background: disabled ? 'transparent' : h ? hv : bg, color: disabled ? 'var(--text-disabled)' : fg, cursor: disabled ? 'not-allowed' : 'pointer', transform: p && !disabled ? 'scale(.98)' : 'none', transition: 'background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)', padding: 0, ...style }}>
      <Icon name={icon} size={Math.round(size * 0.5)} />
    </button>
  );
}