import React from 'react';

// Celular: até 720px o app troca para o layout de uma coluna, com abas embaixo (mobile.css).
// O mesmo corte do CSS, para as telas que mudam de estrutura e não só de estilo.
const CONSULTA = '(max-width: 720px)';

function assinar(avisar) {
  const m = window.matchMedia(CONSULTA);
  m.addEventListener('change', avisar);
  return () => m.removeEventListener('change', avisar);
}

export function useEstreito() {
  return React.useSyncExternalStore(assinar, () => window.matchMedia(CONSULTA).matches);
}
