import React from 'react';
import { contaGuardada } from './google.js';

// Acesso à API do Itaú House, no formato de docs/api.md. Só as rotas da plataforma: as do plugin vão pelo MCP.
// Caminho relativo, sempre: quem repassa /api é o proxy do Vite, o nginx do build ou a Vercel.
// Enquanto a rota não existe (T-06, T-07), a tela cai nos dados fictícios de src/data/. Vale rota a rota.

// O back do plano grátis dorme e leva até 1 min para acordar. Passado isto, a tela usa os dados fictícios.
const TEMPO_MAXIMO = 15000;

// A API respondeu no formato do contrato: { erro, mensagem }. Vale como resposta; a tela mostra a mensagem.
export class ErroApi extends Error {
  constructor(status, erro, mensagem) {
    super(mensagem || 'A API recusou o pedido.');
    this.status = status;
    this.erro = erro;
  }
}

// Sem resposta do contrato: rota que ainda não existe, back fora do ar ou demorando. Só esta cai nos dados fictícios.
export class SemApi extends Error {}

// Rotas que o back já tem, lidas do openapi.json do FastAPI uma vez por carga da página.
// O back responde { erro, mensagem } até para rota que não existe (backend/app/erros.py), então o 404 não diz
// se falta a rota ou o ativo. A lista diz: rota fora dela ainda não foi feita e a tela usa os fictícios.
let rotasConhecidas = null;

function lerRotas() {
  if (!rotasConhecidas) {
    rotasConhecidas = fetch('/api/openapi.json', { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(TEMPO_MAXIMO) })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('respondeu ' + r.status))))
      .then((doc) =>
        Object.entries(doc.paths || {}).map(([caminho, operacoes]) => ({
          // /api/ativos/{id} -> ^/api/ativos/[^/]+$
          padrao: new RegExp('^' + caminho.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{[^/]+\}/g, '[^/]+') + '$'),
          metodos: Object.keys(operacoes).map((m) => m.toUpperCase()),
        })),
      )
      .catch((e) => {
        // Sem a lista, tenta de novo na próxima leitura: o back pode estar acordando.
        rotasConhecidas = null;
        throw new SemApi('Sem a lista de rotas da API: ' + e.message);
      });
  }
  return rotasConhecidas;
}

async function pedir(caminho, usuarioId, { metodo = 'GET', corpo } = {}) {
  const rotas = await lerRotas();
  const semConsulta = '/api' + caminho.split('?')[0];
  if (!rotas.some((r) => r.metodos.includes(metodo) && r.padrao.test(semConsulta))) {
    throw new SemApi(`A API ainda não tem ${metodo} ${semConsulta}`);
  }

  const cabecalhos = { Accept: 'application/json' };
  // Login simulado (RF-23): a persona escolhida na entrada.
  if (usuarioId) cabecalhos['X-Usuario-Id'] = usuarioId;
  // Quem entrou com Google manda o token junto. No MVP o back não exige (proposta 0034).
  const conta = contaGuardada();
  if (conta) cabecalhos.Authorization = 'Bearer ' + conta.token;
  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json';

  let resposta;
  try {
    resposta = await fetch('/api' + caminho, {
      method: metodo,
      headers: cabecalhos,
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      signal: AbortSignal.timeout(TEMPO_MAXIMO),
    });
  } catch (e) {
    throw new SemApi(`Sem resposta de ${caminho}: ${e.message}`);
  }

  // Sem proxy, o servidor estático devolve o index.html com 200. Por isso o JSON decide, não o status.
  const dados = await resposta.json().catch(() => null);
  if (dados && typeof dados.erro === 'string') throw new ErroApi(resposta.status, dados.erro, dados.mensagem);
  if (!resposta.ok || dados === null) throw new SemApi(`${caminho} respondeu ${resposta.status} fora do contrato`);
  return dados;
}

// Sessão
export const listarUsuarios = () => pedir('/usuarios').then((r) => r.usuarios);

// Catálogo (RF-25 a RF-30). ordem: alta | curtidos | novos.
export const listarAtivos = (usuarioId, ordem = 'alta') => pedir('/ativos?ordem=' + ordem, usuarioId).then((r) => r.ativos);
export const detalharAtivo = (usuarioId, id) => pedir('/ativos/' + encodeURIComponent(id), usuarioId);
export const curtirAtivo = (usuarioId, id) => pedir(`/ativos/${encodeURIComponent(id)}/curtida`, usuarioId, { metodo: 'POST' });
export const instalarAtivo = (usuarioId, id) => pedir(`/ativos/${encodeURIComponent(id)}/instalacoes`, usuarioId, { metodo: 'POST' });

// Coordenação, só Cord+ (RF-19, RF-21, RF-32). decisao: { decisao: 'aprovar' } ou { decisao: 'devolver', comentario }.
export const listarAprovacoes = (usuarioId) => pedir('/aprovacoes', usuarioId).then((r) => r.itens);
export const decidirAprovacao = (usuarioId, ativoId, decisao) =>
  pedir('/aprovacoes/' + encodeURIComponent(ativoId), usuarioId, { metodo: 'POST', corpo: decisao });

// Última resposta de cada leitura. Voltar a uma tela mostra o que já veio enquanto a API responde de novo.
const guardadas = new Map();
const avisadas = new Set();

// Pede de novo uma leitura em toda tela que a usa. Ex.: depois de aprovar, a fila e o contador do topo.
export function recarregar(chave) {
  window.dispatchEvent(new CustomEvent('ih:recarregar', { detail: chave }));
}

// Lê da API e, se ela não tiver a rota, usa os dados fictícios.
// `chave` identifica a leitura e precisa mudar junto com o que `carregar` usa (a persona, o id).
// Devolve { dados, origem: 'api' | 'ficticio', erro, carregando }.
export function useDaApi(chave, carregar, ficticio) {
  const [resultado, setResultado] = React.useState(() => guardadas.get(chave) || null);
  const [rodada, setRodada] = React.useState(0);

  // Quem volta do Claude Code para o navegador vê o que o plugin acabou de mudar (roteiro, cena 1, passo 5).
  React.useEffect(() => {
    const aoFocar = () => setRodada((n) => n + 1);
    const aoMostrar = () => {
      if (document.visibilityState === 'visible') aoFocar();
    };
    window.addEventListener('focus', aoFocar);
    document.addEventListener('visibilitychange', aoMostrar);
    return () => {
      window.removeEventListener('focus', aoFocar);
      document.removeEventListener('visibilitychange', aoMostrar);
    };
  }, []);

  React.useEffect(() => {
    const aoPedir = (e) => {
      if (e.detail === chave) setRodada((n) => n + 1);
    };
    window.addEventListener('ih:recarregar', aoPedir);
    return () => window.removeEventListener('ih:recarregar', aoPedir);
  }, [chave]);

  // Quem dispara a leitura é a chave (ou a volta à janela). As funções mudam a cada render e não disparam nada.
  const lerDaApi = React.useEffectEvent(carregar);
  const lerFicticio = React.useEffectEvent(ficticio);

  React.useEffect(() => {
    let viva = true;
    lerDaApi()
      .then((dados) => ({ chave, dados, origem: 'api', erro: null }))
      .catch((erro) => {
        if (!(erro instanceof SemApi)) return { chave, dados: null, origem: 'api', erro };
        if (!avisadas.has(chave)) {
          avisadas.add(chave);
          console.info(`[api] ${erro.message}. Usando os dados fictícios de src/data/.`);
        }
        return { chave, dados: lerFicticio(), origem: 'ficticio', erro: null };
      })
      .then((r) => {
        guardadas.set(chave, r);
        if (viva) setResultado(r);
      });
    return () => {
      viva = false;
    };
  }, [chave, rodada]);

  const atual = resultado && resultado.chave === chave ? resultado : guardadas.get(chave);
  return {
    dados: atual ? atual.dados : null,
    origem: atual ? atual.origem : null,
    erro: atual ? atual.erro : null,
    carregando: !atual,
  };
}
