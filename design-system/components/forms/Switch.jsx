import React from 'react';
export function Switch({ label, checked, defaultChecked, onChange, disabled, style }) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked ?? inner;
  const toggle = () => { if (disabled) return; setInner(!on); onChange && onChange(!on); };
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 12, cursor: disabled ? 'not-allowed' : 'pointer', font: 'var(--fw-regular) 16px/1.3 var(--font-text)', color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)', ...style }} onClick={e => { e.preventDefault(); toggle(); }}>
      <span role="switch" aria-checked={on} tabIndex={disabled ? -1 : 0} onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), toggle())}
        style={{ width: 48, height: 28, flex: 'none', borderRadius: 999, position: 'relative', background: disabled ? 'var(--gray-100)' : on ? 'var(--itau-laranja)' : 'var(--gray-300)', transition: 'background var(--dur-base) var(--ease-standard)' }}>
        <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 22, height: 22, borderRadius: '50%', background: 'var(--itau-branco)', boxShadow: 'var(--shadow-1)', transition: 'left var(--dur-base) var(--ease-standard)' }} />
      </span>
      {label}
    </label>
  );
}