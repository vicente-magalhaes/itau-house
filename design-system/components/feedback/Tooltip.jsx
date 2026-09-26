import React from 'react';
export function Tooltip({ content, children, placement = 'top', open, style }) {
  const [h, setH] = React.useState(false);
  const show = open ?? h;
  const pos = placement === 'bottom' ? { top: '100%', marginTop: 8 } : { bottom: '100%', marginBottom: 8 };
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onFocus={() => setH(true)} onBlur={() => setH(false)}>
      {children}
      {show && <span role="tooltip" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', ...pos, background: 'var(--itau-preto)', color: 'var(--itau-branco)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', font: 'var(--fw-regular) 13px/1.35 var(--font-text)', width: 'max-content', maxWidth: 240, zIndex: 10, pointerEvents: 'none', ...style }}>{content}</span>}
    </span>
  );
}