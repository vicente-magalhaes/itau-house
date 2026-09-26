import React from 'react';
export function Radio({ label, checked, onChange, disabled, name, value, style }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', font: 'var(--fw-regular) 16px/1.3 var(--font-text)', color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)', ...style }} onClick={e => { e.preventDefault(); if (!disabled && onChange) onChange(value); }}>
      <span role="radio" aria-checked={!!checked} tabIndex={disabled ? -1 : 0} onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && !disabled && onChange && (e.preventDefault(), onChange(value))}
        style={{ width: 22, height: 22, flex: 'none', borderRadius: '50%', display: 'grid', placeItems: 'center', boxShadow: 'inset 0 0 0 ' + (checked ? 2 : 1.5) + 'px ' + (disabled ? 'var(--gray-200)' : checked ? 'var(--itau-laranja)' : 'var(--gray-500)'), background: 'var(--itau-branco)' }}>
        {checked && <span style={{ width: 12, height: 12, borderRadius: '50%', background: disabled ? 'var(--gray-200)' : 'var(--itau-laranja)' }} />}
      </span>
      {label}
    </label>
  );
}