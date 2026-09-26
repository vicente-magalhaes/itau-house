import React from 'react';
export function Card({ tone = 'default', padding = 24, interactive, onClick, image, imageHeight = 160, eyebrow, title, children, footer, style }) {
  const [h, setH] = React.useState(false);
  const tones = { default: ['var(--surface-card)', 'var(--text-primary)', 'inset 0 0 0 1px var(--border-subtle)'], subtle: ['var(--surface-subtle)', 'var(--text-primary)', 'none'], brand: ['var(--itau-laranja)', 'var(--itau-preto)', 'none'], inverse: ['var(--itau-preto)', 'var(--itau-branco)', 'none'] };
  const [bg, fg, bd] = tones[tone] || tones.default;
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: bg, color: fg, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: interactive && h ? bd + ', var(--shadow-2)' : bd, cursor: interactive ? 'pointer' : undefined, transform: interactive && h ? 'translateY(-2px)' : 'none', transition: 'box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)', display: 'flex', flexDirection: 'column', ...style }}>
      {image && <div style={{ height: imageHeight, background: 'url(' + image + ') center/cover' }} />}
      <div style={{ padding, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {eyebrow && <div style={{ font: 'var(--fw-bold) 11px/1 var(--font-text)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: tone === 'default' || tone === 'subtle' ? 'var(--itau-laranja)' : 'inherit' }}>{eyebrow}</div>}
        {title && <div style={{ font: 'var(--fw-bold) 22px/1.15 var(--font-display)', letterSpacing: 'var(--ls-display)' }}>{title}</div>}
        {children && <div style={{ font: 'var(--fw-regular) 15px/1.45 var(--font-text)', color: tone === 'default' || tone === 'subtle' ? 'var(--text-secondary)' : 'inherit' }}>{children}</div>}
        {footer && <div style={{ marginTop: 'auto', paddingTop: 12 }}>{footer}</div>}
      </div>
    </div>
  );
}