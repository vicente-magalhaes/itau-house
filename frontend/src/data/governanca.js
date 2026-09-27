// Dados do fluxo de governança. [SIMULADO] — roteiro fixo da demo, nada é calculado de verdade.
// Validador sem IA no MVP (D-26): só as checagens fixas do RF-14. Quem julga é o coordenador (RF-19).

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
  tipo: 'skill',
  resumo: 'Lê a história do Jira e devolve critérios de aceitação no padrão dado/então, já com o caso incompleto.',
  autor: { nome: 'Ana Ribeiro', iniciais: 'AR', papel: 'Dev sênior', squad: 'Cartões · Emissão' },
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
    tipo: 'skill',
    autor: { nome: 'Ana Ribeiro', iniciais: 'AR', squad: 'Cartões · Emissão' },
    esperandoHa: '12 min',
    visibilidade: 'banco',
    checagens: 'Barrado na 1ª rodada (token no prompt). Passou na 2ª.',
    apontamentos: [{ tom: 'info', texto: 'Alcance pedido: banco inteiro.' }],
  },
  {
    id: 'fila-002',
    nome: 'Agente de disparo de e-mail para a base de clientes',
    tipo: 'agente',
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
    tipo: 'esqueleto',
    autor: { nome: 'Vitor Salles', iniciais: 'VS', squad: 'Cartões · Faturamento' },
    esperandoHa: '1 d',
    visibilidade: 'frente',
    checagens: 'Passou nas 4 checagens fixas.',
    apontamentos: [{ tom: 'info', texto: 'Alcance pedido: frente.' }],
  },
];

// Ato 2 da demo: o aviso proativo no fluxo do dev (Thiago, squad de Pix).
export const cenarioSugestao = {
  dev: { nome: 'Thiago Nunes', iniciais: 'TN', squad: 'Pix · Recebimentos' },
  gatilho: 'Você pediu para criar uma skill que gere critérios de aceitação a partir das histórias do Jira.',
  transcricao: [
    { de: 'dev', texto: 'cria uma skill que lê a história do Jira e escreve os critérios de aceitação' },
    { de: 'hook', texto: 'Antes de começar: quer que eu procure no Itaú House algo que já resolva isso?' },
    { de: 'dev', texto: 'quero' },
    { de: 'agente', texto: 'Encontramos 1 ativo com boa aderência e 2 parecidos. Veja abaixo antes de decidir.' },
  ],
  achado: {
    ativoId: 'ativo-001',
    aderencia: 91,
    porques: [
      'Faz a mesma tarefa: história do Jira entra, critérios no padrão dado/então saem.',
      'Já foi reaproveitada por 3 squads, uma delas também de pagamentos.',
      'Atualizada há 4 dias e revalidada na versão 1.2.0.',
    ],
    limite: 'O padrão de card dela é o de Cartões. O seu time usa outro template: dá para adaptar na instalação.',
  },
  parecidos: [
    { ativoId: 'ativo-012', aderencia: 64, porque: 'Também gera teste a partir de texto de negócio, mas parte da regra, não da história.' },
    { ativoId: 'ativo-002', aderencia: 41, porque: 'Cobre qualidade, mas na revisão do PR, não no refinamento.' },
  ],
  decisoes: [
    { valor: 'reaproveitar', rotulo: 'Quero reaproveitar', descricao: 'Instala a skill como está, na versão 1.2.0.' },
    { valor: 'adaptar', rotulo: 'Quero adaptar', descricao: 'Clona no seu projeto para ajustar o template do card.' },
    { valor: 'criar', rotulo: 'Prefiro criar do zero', descricao: 'Seguimos sem reuso. A publicação fica agendada para o fim da tarefa.' },
  ],
};

export const PERFIS = [
  { value: 'dev', rotulo: 'Dev', descricao: 'Publica, busca e reaproveita ativos.', pessoa: { nome: 'Ana Ribeiro', iniciais: 'AR', papel: 'Dev sênior', squad: 'Cartões · Emissão' } },
  { value: 'coordenador', rotulo: 'Coordenação', descricao: 'Tudo o que o dev vê, mais a fila de aprovação da squad.', pessoa: { nome: 'Rafael Costa', iniciais: 'RC', papel: 'Coordenador', squad: 'Cartões · Faturamento' } },
];
