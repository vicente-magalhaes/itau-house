import React from 'react';
import { Icon } from '../core/Icon.jsx';
const T = { neutral: ['var(--itau-preto)', 'var(--itau-branco)', 'info'], success: ['var(--itau-preto)', 'var(--itau-branco)', 'circle-check'], brand: ['var(--itau-laranja)', 'var(--itau-preto)', 'sparkles'], error: ['var(--azul-900)', 'var(--itau-branco)', 'circle-alert'] };
export function Toast({ tone = 'neutral', children, action, onAction, onClose, style }) {
  const [bg, fg, ic] = T[tone] || T.neutral;
  return (
    <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 52, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: bg, color: fg, boxShadow: 'var(--shadow-3)', font: 'var(--fw-regular) 15px/1.35 var(--font-text)', maxWidth: 480, ...style }}>
      <Icon name={ic} size={20} color={tone === 'success' ? 'var(--verde-100)' : tone === 'neutral' ? 'var(--itau-laranja)' : fg} />
      <div style={{ flex: 1 }}>{children}</div>
      {action && <button onClick={onAction} style={{ border: 0, background: 'transparent', color: 'inherit', font: 'var(--fw-bold) 15px/1 var(--font-text)', cursor: 'pointer', padding: 4, textDecoration: 'none' }}>{action}</button>}
      {onClose && <button aria-label="Fechar" onClick={onClose} style={{ border: 0, background: 'transparent', color: 'inherit', cursor: 'pointer', padding: 2, display: 'grid' }}><Icon name="x" size={18} /></button>}
    </div>
  );
}