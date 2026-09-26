import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Checkbox({ label, checked, defaultChecked, onChange, disabled, style }) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked ?? inner;
  const toggle = () => { if (disabled) return; setInner(!on); onChange && onChange(!on); };
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', font: 'var(--fw-regular) 16px/1.3 var(--font-text)', color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)', ...style }} onClick={e => { e.preventDefault(); toggle(); }}>
      <span role="checkbox" aria-checked={on} tabIndex={disabled ? -1 : 0} onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), toggle())}
        style={{ width: 22, height: 22, flex: 'none', borderRadius: 6, display: 'grid', placeItems: 'center', background: on ? (disabled ? 'var(--gray-200)' : 'var(--itau-laranja)') : 'var(--itau-branco)', boxShadow: on ? 'none' : 'inset 0 0 0 1.5px ' + (disabled ? 'var(--gray-200)' : 'var(--gray-500)'), color: 'var(--itau-preto)', transition: 'background var(--dur-fast) var(--ease-standard)' }}>
        {on && <Icon name="check" size={16} />}
      </span>
      {label}
    </label>
  );
}