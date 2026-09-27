import React from 'react';
import { Icon } from '../ds.js';

// Filtro do início: botão com a forma dos outros botões e uma lista aberta com a mesma cara (fonte, borda e raio).
// O select nativo, e o Select do DS, abrem a lista do sistema, com outra fonte e outras cores.
// Teclado como num select: setas abrem e andam, Home e End vão às pontas, Enter escolhe, Esc fecha.
export function Filtro({ rotulo, valor, opcoes, onChange }) {
  const [aberto, setAberto] = React.useState(false);
  const [foco, setFoco] = React.useState(0);
  const raiz = React.useRef(null);
  const botao = React.useRef(null);
  const lista = React.useRef(null);
  const id = React.useId();
  const atual = opcoes.find((o) => o.value === valor) || opcoes[0];

  // Clique fora fecha a lista.
  React.useEffect(() => {
    if (!aberto) return undefined;
    const fora = (e) => {
      if (!raiz.current.contains(e.target)) setAberto(false);
    };
    document.addEventListener('mousedown', fora);
    return () => document.removeEventListener('mousedown', fora);
  }, [aberto]);

  // Ao abrir, o teclado passa para a lista.
  React.useEffect(() => {
    if (aberto) lista.current.focus();
  }, [aberto]);

  const abrir = () => {
    setFoco(Math.max(0, opcoes.indexOf(atual)));
    setAberto(true);
  };

  const escolher = (opcao) => {
    onChange(opcao.value);
    setAberto(false);
    botao.current.focus();
  };

  const teclaNoBotao = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      abrir();
    }
  };

  const teclaNaLista = (e) => {
    const ultimo = opcoes.length - 1;
    if (e.key === 'Tab') {
      setAberto(false);
      return;
    }
    if (e.key === 'ArrowDown') setFoco((i) => Math.min(ultimo, i + 1));
    else if (e.key === 'ArrowUp') setFoco((i) => Math.max(0, i - 1));
    else if (e.key === 'Home') setFoco(0);
    else if (e.key === 'End') setFoco(ultimo);
    else if (e.key === 'Enter' || e.key === ' ') escolher(opcoes[foco]);
    else if (e.key === 'Escape') {
      setAberto(false);
      botao.current.focus();
    } else return;
    e.preventDefault();
  };

  return (
    <div className="filtro" ref={raiz}>
      <button
        ref={botao}
        type="button"
        className="btn btn-sec filtro-botao"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-controls={aberto ? id : undefined}
        aria-label={`${rotulo}: ${atual.label}`}
        onClick={() => (aberto ? setAberto(false) : abrir())}
        onKeyDown={teclaNoBotao}
      >
        {atual.label}
        <Icon name={aberto ? 'chevron-up' : 'chevron-down'} size={16} color="var(--ih-ink2)" />
      </button>

      {aberto && (
        <ul ref={lista} id={id} role="listbox" tabIndex={-1} aria-label={rotulo} aria-activedescendant={`${id}-${foco}`} className="filtro-lista" onKeyDown={teclaNaLista}>
          {opcoes.map((o, i) => {
            const escolhida = o.value === valor;
            return (
              <li
                key={o.value}
                id={`${id}-${i}`}
                role="option"
                aria-selected={escolhida}
                className="filtro-opcao"
                data-foco={i === foco ? '' : undefined}
                onMouseEnter={() => setFoco(i)}
                onClick={() => escolher(o)}
              >
                {o.label}
                {escolhida && <Icon name="check" size={16} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
