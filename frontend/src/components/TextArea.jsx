import React from 'react';
import { Icon } from '../ds.js';

// Campo de texto longo: o design system só traz Input de uma linha.
// Espelha o Input do DS — mesma moldura inset, mesmo foco, mesmo erro em var(--status-error) com ícone.
// É o único textarea do protótipo: use este nas duas telas que pedem texto longo.
export function TextArea({ id, label, value, onChange, placeholder, helper, error, disabled, rows = 4, mono, style }) {
  const gerado = React.useId();
  const idCampo = id || gerado;
  const [foco, setFoco] = React.useState(false);
  // Sem onChange o campo é só leitura da demonstração: entra como não controlado.
  const controle = onChange ? { value, onChange } : { defaultValue: value };
  const borda = error ? 'var(--status-error)' : foco ? 'var(--border-focus)' : 'var(--border-default)';
  return (
    <div className="stack stack-2" style={style}>
      {label && (
        <label
          htmlFor={idCampo}
          style={{
            font: 'var(--fw-bold) var(--fs-body-sm)/1.2 var(--font-text)',
            color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
          }}
        >
          {label}
        </label>
      )}
      <textarea
        id={idCampo}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={mono ? 'mono' : undefined}
        onFocus={() => setFoco(true)}
        onBlur={() => setFoco(false)}
        {...controle}
        style={{
          width: '100%',
          resize: 'vertical',
          border: 0,
          outline: 0,
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          background: disabled ? 'var(--surface-subtle)' : 'var(--surface-card)',
          boxShadow: 'inset 0 0 0 ' + (foco || error ? 2 : 1) + 'px ' + borda,
          color: disabled ? 'var(--text-tertiary)' : 'var(--text-primary)',
          font: mono ? undefined : 'var(--fw-regular) var(--fs-body)/var(--lh-body) var(--font-text)',
          transition: 'box-shadow var(--dur-fast) var(--ease-standard)',
        }}
      />
      {error ? (
        <span
          className="row"
          style={{
            gap: 'var(--space-1)',
            alignItems: 'flex-start',
            font: 'var(--fw-bold) var(--fs-caption)/1.3 var(--font-text)',
            color: 'var(--status-error)',
          }}
        >
          <Icon name="circle-alert" size={16} color="var(--status-error)" style={{ marginTop: 1 }} />
          {error}
        </span>
      ) : (
        helper && <span className="caption">{helper}</span>
      )}
    </div>
  );
}
