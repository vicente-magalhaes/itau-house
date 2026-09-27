// Converte o JSON do contrato (docs/api.md) no formato que as telas já usam, o dos dados fictícios de catalogo.js.
// Assim a tela é a mesma com a API ou sem ela. Campo que o contrato não traz fica vazio, nunca inventado.

import { tempoRelativo } from './catalogo.js';

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
