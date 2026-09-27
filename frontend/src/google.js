// Login com Google pelo Supabase Auth (T-41, proposta 0034). Sem dependência nova:
// o botão vai para /auth/v1/authorize e o Supabase volta com o token no fragmento da URL.
// Gambiarra de hackathon: o cliente OAuth é o da Poli Júnior Soluções.
// O login é real; a hierarquia é simulada. Quem entra por aqui opera como coordenação.

// A URL do Supabase é pública: aparece no navegador de qualquer jeito.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://claohiagkdrfzolnydnc.supabase.co';
const CHAVE = 'ih.google';

export function entrarComGoogle() {
  // Volta para a raiz do site. O roteador usa o fragmento (#/...), e o token chega nele.
  const volta = window.location.origin + window.location.pathname;
  const url = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(volta)}`;
  window.location.assign(url);
}

function lerJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      Array.from(atob(base64), (c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Roda antes do roteador: se a URL trouxe o token do Google, guarda a conta e limpa a URL.
// Devolve a conta quando acabou de entrar, ou null.
export function lerRetornoDoGoogle() {
  const fragmento = window.location.hash.replace(/^#/, '');
  if (!/(^|&)(access_token|error)=/.test(fragmento)) return null;
  const params = new URLSearchParams(fragmento);
  window.history.replaceState(null, '', window.location.pathname + window.location.search + '#/');
  if (params.get('error')) return null;

  const token = params.get('access_token');
  const dados = token && lerJwt(token);
  if (!dados) return null;
  const meta = dados.user_metadata || {};
  const conta = {
    email: dados.email,
    nome: meta.full_name || meta.name || dados.email,
    foto: meta.avatar_url || meta.picture || null,
    token,
    expiraEm: (dados.exp || 0) * 1000,
  };
  localStorage.setItem(CHAVE, JSON.stringify(conta));
  return conta;
}

export function contaGuardada() {
  try {
    const conta = JSON.parse(localStorage.getItem(CHAVE) || 'null');
    return conta && conta.expiraEm > Date.now() ? conta : null;
  } catch {
    return null;
  }
}

export function esquecerConta() {
  localStorage.removeItem(CHAVE);
}
