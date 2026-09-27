import React from 'react';
export function Tabs({ items = [], value, defaultValue, onChange, idPrefix, style }) {
  const [inner, setInner] = React.useState(defaultValue ?? (items[0] && (items[0].value ?? items[0])));
  const cur = value ?? inner;
  return (
    <div role="tablist" style={{ display: 'flex', gap: 24, boxShadow: 'inset 0 -1px 0 var(--border-subtle)', ...style }}>
      {items.map(it => { const v = it.value ?? it; const l = it.label ?? it; const on = v === cur;
        return <button key={v} role="tab" aria-selected={on} id={idPrefix ? idPrefix + '-tab-' + v : undefined} aria-controls={idPrefix ? idPrefix + '-painel-' + v : undefined} onClick={() => { setInner(v); onChange && onChange(v); }}
          style={{ height: 44, padding: 0, border: 0, background: 'transparent', cursor: 'pointer', font: 'var(--fw-bold) 15px/1 var(--font-text)', letterSpacing: 'var(--ls-text)', color: on ? 'var(--text-primary)' : 'var(--text-tertiary)', boxShadow: on ? 'inset 0 -3px 0 var(--itau-laranja)' : 'none', transition: 'color var(--dur-fast) var(--ease-standard)' }}>{l}</button>; })}
    </div>
  );
}