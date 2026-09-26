import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Select({ label, options = [], value, defaultValue, onChange, placeholder, disabled, helper, style }) {
  const [f, setF] = React.useState(false);
  const id = React.useId();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <label htmlFor={id} style={{ font: 'var(--fw-bold) 14px/1.2 var(--font-text)' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        <select id={id} value={value} defaultValue={defaultValue ?? (placeholder ? '' : undefined)} onChange={onChange} disabled={disabled} onFocus={() => setF(true)} onBlur={() => setF(false)}
          style={{ width: '100%', height: 48, padding: '0 44px 0 14px', appearance: 'none', WebkitAppearance: 'none', border: 0, outline: 0, borderRadius: 'var(--radius-md)', background: disabled ? 'var(--gray-50)' : 'var(--itau-branco)', boxShadow: 'inset 0 0 0 ' + (f ? 2 : 1) + 'px ' + (f ? 'var(--itau-preto)' : 'var(--border-default)'), font: 'var(--fw-regular) 16px/1 var(--font-text)', color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)', cursor: disabled ? 'not-allowed' : 'pointer' }}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(o => { const v = typeof o === 'string' ? o : o.value; const l = typeof o === 'string' ? o : o.label; return <option key={v} value={v}>{l}</option>; })}
        </select>
        <Icon name="chevron-down" size={20} color="var(--itau-laranja)" style={{ position: 'absolute', right: 14, top: 14, pointerEvents: 'none' }} />
      </div>
      {helper && <div style={{ font: 'var(--fw-regular) 12px/1.3 var(--font-text)', color: 'var(--text-secondary)' }}>{helper}</div>}
    </div>
  );
}