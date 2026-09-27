import React from 'react';

// Roteador mínimo por hash. Evita dependência nova num esboço.
// Rotas: #/ , #/entrar , #/ativo/:id , #/publicar , #/aprovacoes , #/sugestao

function lerHash() {
  const bruto = window.location.hash.replace(/^#/, '') || '/';
  return bruto.startsWith('/') ? bruto : '/' + bruto;
}

export function useRota() {
  const [rota, setRota] = React.useState(lerHash);
  React.useEffect(() => {
    const ao = () => {
      setRota(lerHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', ao);
    return () => window.removeEventListener('hashchange', ao);
  }, []);
  return rota;
}

export function irPara(caminho) {
  window.location.hash = caminho;
}

// Casa '/ativo/:id' com '/ativo/ativo-001' e devolve { id: 'ativo-001' }.
export function casar(padrao, rota) {
  const p = padrao.split('/').filter(Boolean);
  const r = rota.split('/').filter(Boolean);
  if (p.length !== r.length) return null;
  const params = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(r[i]);
    else if (p[i] !== r[i]) return null;
  }
  return params;
}

// Âncora que respeita a voz e o foco do teclado, sem sublinhado de link de texto.
export function Link({ para, children, style, ...resto }) {
  return (
    <a
      href={'#' + para}
      className="link-reset"
      style={{ borderBottom: 0, color: 'inherit', fontWeight: 'inherit', ...style }}
      {...resto}
    >
      {children}
    </a>
  );
}
