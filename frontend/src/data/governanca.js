// Dados do fluxo de governança. [SIMULADO] — roteiro fixo da demo, nada é calculado de verdade.
// Validador sem IA no MVP (D-26): só as checagens fixas do RF-14. Quem julga é o coordenador (RF-19).

import { pessoas } from './catalogo.js';

export const CRITERIOS = [
  { id: 'c1', nome: 'Segredos e chaves', checagem: 'Por código' },
  { id: 'c2', nome: 'Dados pessoais (CPF, e-mail, telefone)', checagem: 'Por código' },
  { id: 'c3', nome: 'README ou descrição', checagem: 'Por código' },
  { id: 'c4', nome: 'Autor e squad', checagem: 'Por código' },
];

// Resultado do validador: aprovado ou barrado, com a lista de motivos (RF-14, RF-15).
export const VEREDITOS = {
  aprovado: { rotulo: 'Passou nas checagens', tone: 'success', icone: 'circle-check' },
  reprovado: { rotulo: 'Barrado', tone: 'dark', icone: 'circle-alert' },
};

// Ato 1 da demo: a skill da Ana é reprovada, ela corrige e passa.
export const rascunhoAna = {
  id: 'rascunho-ana',
  nome: 'Critérios de aceitação a partir da história',
  tipo: 'Skill',
  estante: 'ia',
  formato: 'Skill para qualquer agente',
  resumo: 'Lê a história do Jira e devolve critérios de aceitação no padrão dado/então, já com o caso incompleto.',
  autor: pessoas.ana,
  frente: 'Cartões',
  squad: 'Cartões · Emissão',
  visibilidade: 'banco',
  tags: ['qualidade', 'refinamento', 'jira'],
  ferramentas: ['Claude Code', 'Copilot'],
  detectadoEm: 'Sessão do Claude Code, hoje às 14:32',
  caminho: '.claude/skills/criterios-aceitacao/SKILL.md',
  readme: [
    '## O que faz',
    'Recebe a descrição de uma história e devolve critérios de aceitação testáveis, no padrão dado/então.',
    'Sempre inclui um critério para o caso incompleto: o que o sistema faz quando falta informação.',
    '',
    '## Quando usar',
    'No refinamento, antes de abrir a tarefa para desenvolvimento.',
    '',
    '## Limites',
    'Não substitui o refinamento com a pessoa de produto. Revise antes de colar no card.',
  ].join('\n'),
};

// Primeira passada do validador: barrado, com o que, onde e como corrigir (RF-15).
export const verificacaoReprovada = {
  veredito: 'reprovado',
  rodadaEm: 'hoje às 14:33',
  itens: [
    {
      criterio: 'c1',
      resultado: 'falhou',
      titulo: 'Tem um token no exemplo do prompt',
      evidencia: 'SKILL.md, linha 42 — JIRA_TOKEN="•••• (token colado direto no prompt)"',
      comoCorrigir: 'Leia o valor de uma variável de ambiente e descreva no README como configurá-la. Depois, valide de novo.',
    },
    { criterio: 'c2', resultado: 'ok', titulo: 'Nenhum CPF, e-mail ou telefone nos exemplos' },
    { criterio: 'c3', resultado: 'ok', titulo: 'README com o que faz, quando usar e limites' },
    { criterio: 'c4', resultado: 'ok', titulo: 'Autor e squad preenchidos' },
  ],
};

// Segunda passada, depois da correção.
export const verificacaoAprovada = {
  veredito: 'aprovado',
  rodadaEm: 'hoje às 14:41',
  itens: [
    { criterio: 'c1', resultado: 'ok', titulo: 'Nenhuma chave ou token no código ou no prompt' },
    { criterio: 'c2', resultado: 'ok', titulo: 'Nenhum CPF, e-mail ou telefone nos exemplos' },
    { criterio: 'c3', resultado: 'ok', titulo: 'README com o que faz, quando usar e limites' },
    { criterio: 'c4', resultado: 'ok', titulo: 'Autor e squad preenchidos' },
  ],
};

// Fila do coordenador (perfil Cord+). Todo item já passou nas checagens fixas; a decisão é do coordenador (D-13, D-26).
export const filaAprovacao = [
  {
    id: 'fila-001',
    nome: 'Critérios de aceitação a partir da história',
    tipo: 'Skill',
    estante: 'ia',
    autor: { nome: 'Ana Ribeiro', iniciais: 'AR', squad: 'Cartões · Emissão' },
    esperandoHa: '12 min',
    visibilidade: 'banco',
    checagens: 'Barrado na 1ª rodada (token no prompt). Passou na 2ª.',
    apontamentos: [{ tom: 'info', texto: 'Alcance pedido: banco inteiro.' }],
  },
  {
    id: 'fila-002',
    nome: 'Agente de disparo de e-mail para a base de clientes',
    tipo: 'Agente',
    estante: 'agente',
    autor: { nome: 'Igor Fontes', iniciais: 'IF', squad: 'Cartões · Retenção' },
    esperandoHa: '21 h',
    visibilidade: 'banco',
    checagens: 'Passou nas 4 checagens fixas.',
    apontamentos: [
      { tom: 'atencao', texto: 'Declara acesso à base de contatos e envio de e-mail para fora do banco.' },
      { tom: 'atencao', texto: 'O README não declara limite de volume.' },
      { tom: 'info', texto: 'Alcance pedido: banco inteiro.' },
    ],
  },
  {
    id: 'fila-003',
    nome: 'Esqueleto de job de carga noturna',
    tipo: 'Esqueleto de código',
    estante: 'codigo',
    autor: { nome: 'Vitor Salles', iniciais: 'VS', squad: 'Cartões · Faturamento' },
    esperandoHa: '1 d',
    visibilidade: 'frente',
    checagens: 'Passou nas 4 checagens fixas.',
    apontamentos: [{ tom: 'info', texto: 'Alcance pedido: frente.' }],
  },
];

// Login simulado (RF-23, RF-24). Quem cria é qualquer membro do squad (D-18).
// usuarioId é quem a API enxerga (X-Usuario-Id). A pessoa da tela é a mesma do seed do back (T-04):
// o elenco do roteiro da demo, com o Rafael (dev) e a Juliana (coordenadora) da squad Pix · Cobranças.
const RAFAEL = { id: 'u-rafael', nome: 'Rafael Nunes', primeiro: 'Rafael', iniciais: 'RN', papel: 'Engenharia', cargo: 'Dev pleno', squad: 'Pix · Cobranças', foto: '/assets/pessoas/rafael.jpg' };
const JULIANA = { id: 'u-juliana', nome: 'Juliana Prado', primeiro: 'Juliana', iniciais: 'JP', papel: 'Coordenação', cargo: 'Coordenadora', squad: 'Pix · Cobranças', foto: '/assets/pessoas/juliana.jpg' };
export const PERFIS = [
  { value: 'dev', rotulo: 'Membro do squad', descricao: 'Publica, busca e reaproveita ativos.', pessoa: RAFAEL, usuarioId: 'u-rafael' },
  { value: 'coordenador', rotulo: 'Coordenação', descricao: 'Tudo o que o squad vê, mais a fila de aprovação.', pessoa: JULIANA, usuarioId: 'u-juliana' },
];
