// Converte o JSON do contrato (docs/api.md) no formato que as telas já usam, o dos dados fictícios de catalogo.js.
// Assim a tela é a mesma com a API ou sem ela. Campo que o contrato não traz fica vazio, nunca inventado.

import { tempoRelativo, rotuloVisibilidade } from './catalogo.js';

// Enum `tipo` do contrato -> rótulo da tela. Os rótulos existentes são os de catalogo.js.
const TIPOS = {
  skill: 'Skill',
  agente: 'Agente',
  mcp: 'MCP',
  framework: 'Framework',
  componente: 'Componente',
  esqueleto: 'Esqueleto de código',
  design_system: 'Design system',
  harness: 'Harness',
};

// Estante do filtro do início (ESTANTES de catalogo.js).
const ESTANTES = {
  skill: 'ia',
  agente: 'agente',
  mcp: 'agente',
  harness: 'agente',
  framework: 'codigo',
  componente: 'codigo',
  esqueleto: 'codigo',
  design_system: 'codigo',
};

// Enum `papel` do contrato -> rótulo da tela (PAPEIS de catalogo.js). Risco e coordenação não têm filtro no início.
const PAPEIS = {
  produto: 'Produto',
  design: 'Design',
  dev: 'Engenharia',
  dados: 'Dados',
  risco: 'Risco',
  coordenacao: 'Coordenação',
};

// Os retratos gerados por IA de public/assets/pessoas têm o primeiro nome como arquivo: u-marina -> marina.jpg.
// Quem não tem retrato cai nas iniciais (componente Foto).
function retrato(id) {
  return id ? `/assets/pessoas/${id.replace(/^u-/, '')}.jpg` : null;
}

// Pessoa do contrato -> pessoa da tela. `papel` vira o rótulo; o enum fica em `papelApi`.
export function pessoaDaApi(p) {
  const partes = p.nome.split(' ');
  return {
    ...p,
    papelApi: p.papel,
    papel: PAPEIS[p.papel] || p.papel || null,
    primeiro: partes[0],
    iniciais: p.iniciais || partes[0][0] + partes[partes.length - 1][0],
    foto: retrato(p.id),
  };
}

// AtivoResumo do contrato -> ativo da tela (card do início, lateral, perfil).
// Nomes da tela: titulo (nome), ferr (ferramentas), reusos (instalacoes), adapt (derivacoes).
export function ativoDaApi(a) {
  return {
    ...a,
    titulo: a.nome,
    tipoApi: a.tipo,
    tipo: TIPOS[a.tipo] || a.tipo,
    estante: ESTANTES[a.tipo] || null,
    autor: pessoaDaApi(a.autor),
    ferr: a.ferramentas || [],
    reusos: a.instalacoes,
    adapt: a.derivacoes,
    // A tela compara e calcula a data sem hora (docs/api.md, "O que muda").
    atualizadoEm: (a.atualizadoEm || a.publicadoEm || '').slice(0, 10) || null,
  };
}

function linhas(texto) {
  const n = String(texto || '').split('\n').length;
  return n === 1 ? '1 linha' : `${n} linhas`;
}

// AtivoDetalhe do contrato -> ativo da página (RF-27).
// dentro: os arquivos. deriv: as derivações de `usos`. trilha: o `historico` (RF-22).
// papeis fica null: o contrato não traz o reuso por papel, e a página mostra as squads no lugar.
export function ativoDetalheDaApi(a) {
  const derivacoes = (a.usos || []).filter((u) => u.tipo === 'derivacao');
  return {
    ...ativoDaApi(a),
    dentro: (a.arquivos || []).map((f) => ({ nome: f.caminho, detalhe: linhas(f.conteudo) })),
    deriv: derivacoes.map((u) => ({
      pessoa: pessoaDaApi(u.pessoa),
      detalhe: [u.pessoa.cargo, u.pessoa.squad].filter(Boolean).join(' · '),
      texto: 'Adaptou ' + tempoRelativo(u.em.slice(0, 10)),
    })),
    papeis: null,
    aprovou: a.aprovadoPor ? a.aprovadoPor.nome : null,
    trilha: a.historico || [],
  };
}

// Há quanto tempo o item espera na fila, pelo relógio de quem abre: "12 min", "3 h", "1 d".
function esperando(iso) {
  const minutos = Math.max(1, Math.round((Date.now() - Date.parse(iso)) / 60000));
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.round(minutos / 60);
  return horas < 24 ? `${horas} h` : `${Math.round(horas / 24)} d`;
}

// Rodadas do validador por código (RF-14, D-26): "Barrado na 1ª rodada. Passou na 2ª."
function resumoDasRodadas(validacoes) {
  if (!validacoes.length) return 'Sem rodada do validador registrada.';
  if (validacoes.length === 1 && validacoes[0].resultado === 'aprovado') {
    const n = (validacoes[0].itens || []).length;
    return n ? `Passou nas ${n} checagens fixas.` : 'Passou nas checagens fixas.';
  }
  return validacoes.map((v, i) => (v.resultado === 'barrado' ? `Barrado na ${i + 1}ª rodada.` : `Passou na ${i + 1}ª.`)).join(' ');
}

// Item da fila do contrato -> item da tela de aprovações (RF-32).
// O contrato não traz apontamentos (D-26): a lista mostra o que o validador barrou e o alcance pedido.
export function itemFilaDaApi(item) {
  const ativo = ativoDetalheDaApi(item.ativo);
  const validacoes = item.validacoes || [];
  const barrados = validacoes.flatMap((v, i) =>
    (v.itens || [])
      .filter((x) => x.resultado === 'falhou')
      .map((x) => {
        const onde = x.arquivo ? `, em ${x.arquivo}${x.linha ? `, linha ${x.linha}` : ''}` : '';
        return { tom: 'atencao', texto: `${i + 1}ª rodada: ${x.titulo}${onde}.` };
      }),
  );
  return {
    id: ativo.id,
    nome: ativo.titulo,
    tipo: ativo.tipo,
    estante: ativo.estante,
    autor: ativo.autor,
    visibilidade: ativo.visibilidade,
    esperandoHa: item.enviadoEm ? esperando(item.enviadoEm) : null,
    checagens: resumoDasRodadas(validacoes),
    apontamentos: [...barrados, { tom: 'info', texto: `Alcance pedido: ${rotuloVisibilidade(ativo.visibilidade).toLowerCase()}.` }],
    daApi: true,
  };
}
