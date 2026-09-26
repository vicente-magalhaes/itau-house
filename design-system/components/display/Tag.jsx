import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Tag({ children, selected, onClick, onRemove, icon, style }) {
  const [h, setH] = React.useState(false);
  return (
    <span onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} role={onClick ? 'button' : undefined} aria-pressed={onClick ? !!selected : undefined}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', borderRadius: 'var(--radius-pill)', background: selected ? 'var(--itau-preto)' : h && onClick ? 'var(--gray-50)' : 'var(--itau-branco)', color: selected ? 'var(--itau-branco)' : 'var(--itau-preto)', boxShadow: selected ? 'none' : 'inset 0 0 0 1px var(--border-default)', font: 'var(--fw-bold) 14px/1 var(--font-text)', cursor: onClick ? 'pointer' : 'default', transition: 'background var(--dur-fast) var(--ease-standard)', whiteSpace: 'nowrap', ...style }}>
      {icon && <Icon name={icon} size={16} />}{children}
      {onRemove && <span role="button" aria-label="Remover" onClick={e => { e.stopPropagation(); onRemove(); }} style={{ display: 'inline-grid', marginRight: -4, cursor: 'pointer' }}><Icon name="x" size={16} /></span>}
    </span>
  );
}