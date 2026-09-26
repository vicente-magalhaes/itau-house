import React from 'react';
const T = { brand: ['var(--itau-laranja)', 'var(--itau-preto)'], neutral: ['var(--gray-100)', 'var(--itau-preto)'], dark: ['var(--itau-preto)', 'var(--itau-branco)'], success: ['var(--status-success-bg)', 'var(--verde-500)'], info: ['var(--status-info-bg)', 'var(--azul-500)'], warning: ['var(--status-warning-bg)', '#8A4B00'] };
export function Badge({ tone = 'brand', children, dot, style }) {
  const [bg, fg] = T[tone] || T.brand;
  if (dot) return <span aria-label={typeof children === 'string' ? children : undefined} style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: tone === 'neutral' ? 'var(--gray-400)' : bg === 'var(--gray-100)' ? fg : (tone === 'brand' || tone === 'dark' ? bg : fg), ...style }} />;
  return <span style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 8px', borderRadius: 'var(--radius-pill)', background: bg, color: fg, font: 'var(--fw-bold) 12px/1 var(--font-text)', letterSpacing: 'var(--ls-text)', whiteSpace: 'nowrap', ...style }}>{children}</span>;
}