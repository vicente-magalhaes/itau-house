import React from 'react';
import { Icon } from './Icon.jsx';
export function IconButton({ icon, label, variant = 'ghost', size = 44, disabled, onClick, style }) {
  const [h, setH] = React.useState(false);
  const map = { ghost: ['transparent', 'var(--gray-50)', 'var(--itau-preto)'], filled: ['var(--itau-laranja)', 'var(--laranja-400)', 'var(--itau-preto)'], subtle: ['var(--gray-50)', 'var(--gray-100)', 'var(--itau-preto)'], inverse: ['var(--itau-preto)', 'var(--gray-800)', 'var(--itau-branco)'] };
  const [bg, hv, fg] = map[variant] || map.ghost;
  return (
    <button aria-label={label} title={label} disabled={disabled} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: size, height: size, display: 'inline-grid', placeItems: 'center', border: 0, borderRadius: 'var(--radius-pill)', background: disabled ? 'transparent' : h ? hv : bg, color: disabled ? 'var(--text-disabled)' : fg, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background var(--dur-fast) var(--ease-standard)', padding: 0, ...style }}>
      <Icon name={icon} size={Math.round(size * 0.5)} />
    </button>
  );
}