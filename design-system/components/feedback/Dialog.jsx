import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
export function Dialog({ open = true, title, children, actions, onClose, width = 480, inline, style }) {
  if (!open) return null;
  const panel = (
    <div role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined} style={{ width, maxWidth: '100%', background: 'var(--surface-card)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-3)', padding: 28, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', ...style }}>
      {onClose && <IconButton icon="x" label="Fechar" size={40} onClick={onClose} style={{ position: 'absolute', top: 16, right: 16 }} />}
      {title && <div style={{ font: 'var(--fw-bold) 24px/1.15 var(--font-display)', letterSpacing: 'var(--ls-display)', paddingRight: 40 }}>{title}</div>}
      {children && <div style={{ font: 'var(--fw-regular) 16px/1.45 var(--font-text)', color: 'var(--text-secondary)' }}>{children}</div>}
      {actions && <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
  if (inline) return panel;
  return <div onClick={e => e.target === e.currentTarget && onClose && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.48)', display: 'grid', placeItems: 'center', padding: 24, zIndex: 1000 }}>{panel}</div>;
}