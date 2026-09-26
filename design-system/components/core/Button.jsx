import React from 'react';
import { Icon } from './Icon.jsx';
const SIZES = { sm: { h: 36, px: 16, fs: 14 }, md: { h: 44, px: 20, fs: 16 }, lg: { h: 52, px: 28, fs: 18 } };
const VARIANTS = {
  primary: { bg: 'var(--itau-laranja)', hover: 'var(--laranja-400)', press: 'var(--brand-press)', fg: 'var(--itau-preto)', bd: 'transparent' },
  secondary: { bg: 'var(--itau-preto)', hover: 'var(--gray-800)', press: 'var(--gray-700)', fg: 'var(--itau-branco)', bd: 'transparent' },
  outline: { bg: 'transparent', hover: 'var(--gray-50)', press: 'var(--gray-100)', fg: 'var(--itau-preto)', bd: 'var(--itau-preto)' },
  ghost: { bg: 'transparent', hover: 'var(--gray-50)', press: 'var(--gray-100)', fg: 'var(--itau-preto)', bd: 'transparent' },
  inverse: { bg: 'var(--itau-branco)', hover: 'var(--gray-50)', press: 'var(--gray-100)', fg: 'var(--itau-preto)', bd: 'transparent' },
};
export function Button({ variant = 'primary', size = 'md', iconLeft, iconRight, fullWidth, disabled, children, onClick, type = 'button', style }) {
  const [h, setH] = React.useState(false); const [p, setP] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary; const s = SIZES[size] || SIZES.md;
  const bg = disabled ? (variant === 'ghost' || variant === 'outline' ? 'transparent' : 'var(--gray-100)') : p ? v.press : h ? v.hover : v.bg;
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setP(false); }} onMouseDown={() => setP(true)} onMouseUp={() => setP(false)}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: s.h, padding: '0 ' + s.px + 'px', width: fullWidth ? '100%' : undefined,
        border: '1.5px solid ' + (disabled && variant === 'outline' ? 'var(--gray-200)' : v.bd), borderRadius: 'var(--radius-md)', background: bg, color: disabled ? 'var(--text-disabled)' : v.fg,
        font: 'var(--fw-bold) ' + s.fs + 'px/1 var(--font-text)', letterSpacing: 'var(--ls-text)', cursor: disabled ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
        transform: p && !disabled ? 'scale(.98)' : 'none', transition: 'background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)', ...style }}>
      {iconLeft && <Icon name={iconLeft} size={s.fs + 4} />}{children}{iconRight && <Icon name={iconRight} size={s.fs + 4} />}
    </button>
  );
}