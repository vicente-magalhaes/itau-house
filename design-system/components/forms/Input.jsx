import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Input({ label, placeholder, value, defaultValue, onChange, helper, error, disabled, icon, type = 'text', id, style }) {
  const [f, setF] = React.useState(false);
  const iid = id || React.useId();
  const bd = error ? 'var(--status-error)' : f ? 'var(--itau-preto)' : 'var(--border-default)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <label htmlFor={iid} style={{ font: 'var(--fw-bold) 14px/1.2 var(--font-text)', color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)' }}>{label}</label>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 48, padding: '0 14px', borderRadius: 'var(--radius-md)', background: disabled ? 'var(--gray-50)' : 'var(--itau-branco)', boxShadow: 'inset 0 0 0 ' + (f || error ? 2 : 1) + 'px ' + bd, transition: 'box-shadow var(--dur-fast) var(--ease-standard)' }}>
        {icon && <Icon name={icon} size={20} color="var(--gray-500)" />}
        <input id={iid} type={type} placeholder={placeholder} value={value} defaultValue={defaultValue} onChange={onChange} disabled={disabled} onFocus={() => setF(true)} onBlur={() => setF(false)}
          style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent', font: 'var(--fw-regular) 16px/1 var(--font-text)', color: 'var(--text-primary)', letterSpacing: 'var(--ls-text)' }} />
        {error && <Icon name="circle-alert" size={20} color="var(--status-error)" />}
      </div>
      {(error || helper) && <div style={{ font: 'var(--fw-' + (error ? 'bold' : 'regular') + ') 12px/1.3 var(--font-text)', color: error ? 'var(--status-error)' : 'var(--text-secondary)' }}>{error || helper}</div>}
    </div>
  );
}