// Dados do fluxo de governança. [SIMULADO] — roteiro fixo da demo, nada é calculado de verdade.
// Origem dos critérios: ideia-itau-house.md, seção 3.3 (checklist do validador).

export const CRITERIOS = [
  { id: 'c1', nome: 'Credenciais, tokens ou senhas', checagem: 'Determinística (regex)' },
  { id: 'c2', nome: 'Dado de cliente ou pessoal nos exemplos', checagem: 'Determinística + LLM' },
  { id: 'c3', nome: 'Ferramentas e sistemas que o ativo acessa', checagem: 'Determinística (lê a definição)' },
  { id: 'c4', nome: 'README, dono e limites de uso', checagem: 'Determinística' },
  { id: 'c5', nome: 'Duplica algo que já existe no catálogo', checagem: 'Busca semântica + LLM' },
  { id: 'c6', nome: 'Instruções fora da política', checagem: 'LLM' },
];

// resultado: 'ok' | 'falhou' | 'atencao' | 'humano'
export const VEREDITOS = {
  aprovado: { rotulo: 'Aprovado na verificação', tone: 'success', icone: 'circle-check' },
  reprovado: { rotulo: 'Reprovado na verificação', tone: 'dark', icone: 'circle-alert' },
  humano: { rotulo: 'Encaminhado para revisão humana', tone: 'neutral', icone: 'user-round-search' },
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

// Primeira passada do validador: reprovado, com motivo e correção sugerida.
export const verificacaoReprovada = {
  veredito: 'reprovado',
  rodadaEm: 'hoje às 14:33',
  duracao: '8 s',
  itens: [
    {
      criterio: 'c1',
      resultado: 'falhou',
      titulo: 'Encontramos um token no exemplo do prompt',
      evidencia: 'SKILL.md, linha 42 — JIRA_TOKEN="•••• (token colado direto no prompt)"',
      comoCorrigir: 'Troque o valor por uma variável de ambiente e descreva no README como configurá-la. Depois é só pedir a verificação de novo.',
    },
    { criterio: 'c2', resultado: 'ok', titulo: 'Nenhum dado de cliente nos exemplos', evidencia: 'As histórias de exemplo usam nomes fictícios.' },
    { criterio: 'c3', resultado: 'ok', titulo: 'Acessa só leitura de arquivo, sem rede', evidencia: 'A definição da skill não declara ferramenta de rede.' },
    { criterio: 'c4', resultado: 'ok', titulo: 'README, dono e limites presentes', evidencia: 'Seções "O que faz", "Quando usar" e "Limites".' },
    {
      criterio: 'c5',
      resultado: 'atencao',
      titulo: 'Parecido com um ativo que já existe',
      evidencia: 'Skill de tradução de regra de negócio em teste (Seguros · Vida) — 62% de similaridade.',
      comoCorrigir: 'Vale explicar no README o que a sua faz de diferente. Se for a mesma coisa, contribuir na existente rende mais.',
    },
    { criterio: 'c6', resultado: 'ok', titulo: 'Nenhuma instrução fora da política', evidencia: 'Nenhuma tentativa de contornar guard rail ou exportar dado.' },
  ],
};

// Segunda passada, depois da correção.
export const verificacaoAprovada = {
  veredito: 'aprovado',
  rodadaEm: 'hoje às 14:41',
  duracao: '7 s',
  grau: 'baixo',
  itens: [
    { criterio: 'c1', resultado: 'ok', titulo: 'Nenhuma credencial no código ou no prompt', evidencia: 'O token virou a variável JIRA_TOKEN, documentada no README.' },
    { criterio: 'c2', resultado: 'ok', titulo: 'Nenhum dado de cliente nos exemplos', evidencia: 'As histórias de exemplo usam nomes fictícios.' },
    { criterio: 'c3', resultado: 'ok', titulo: 'Acessa só leitura de arquivo, sem rede', evidencia: 'A definição da skill não declara ferramenta de rede.' },
    { criterio: 'c4', resultado: 'ok', titulo: 'README, dono e limites presentes', evidencia: 'Seções "O que faz", "Quando usar" e "Limites".' },
    { criterio: 'c5', resultado: 'atencao', titulo: 'Parecido com um ativo que já existe', evidencia: 'Você declarou a diferença no README. Segue como aviso, não bloqueia.' },
    { criterio: 'c6', resultado: 'ok', titulo: 'Nenhuma instrução fora da política', evidencia: 'Nenhuma tentativa de contornar guard rail ou exportar dado.' },
  ],
};

// Fila do coordenador (perfil Cord+).
export const filaAprovacao = [
  {
    id: 'fila-001',
    nome: 'Critérios de aceitação a partir da história',
    tipo: 'skill',
    autor: { nome: 'Ana Ribeiro', iniciais: 'AR', squad: 'Cartões · Emissão' },
    enviadoEm: 'hoje às 14:41',
    esperandoHa: '12 min',
    visibilidade: 'banco',
    grau: 'baixo',
    gates: ['Agente validador', 'Coordenação'],
    veredito: 'aprovado',
    resumoVerificacao: '5 de 6 critérios sem apontamento. 1 aviso de similaridade, declarado pela autora.',
    apontamentos: [
      { tom: 'atencao', texto: 'Parecido com "Skill de tradução de regra de negócio em teste" (Seguros · Vida), 62% de similaridade. A autora explicou a diferença no README.' },
      { tom: 'info', texto: 'Sem versão anterior deste ativo no catálogo.' },
    ],
    resumo: 'Lê a história do Jira e devolve critérios de aceitação no padrão dado/então.',
  },
  {
    id: 'fila-002',
    nome: 'Agente de disparo de e-mail para a base de clientes',
    tipo: 'agente',
    autor: { nome: 'Igor Fontes', iniciais: 'IF', squad: 'Cartões · Retenção' },
    enviadoEm: 'ontem às 17:20',
    esperandoHa: '21 h',
    visibilidade: 'banco',
    grau: 'alto',
    gates: ['Agente validador', 'Coordenação', 'Risco e segurança'],
    veredito: 'humano',
    resumoVerificacao: 'O validador não concluiu sozinho. Grau alto: acessa base de contatos e envia mensagem para fora.',
    apontamentos: [
      { tom: 'alerta', texto: 'Acessa a base de contatos de clientes e dispara e-mail. Ação com efeito externo e sem volta.' },
      { tom: 'alerta', texto: 'Sem limite de volume declarado no README.' },
      { tom: 'info', texto: 'Grau alto exige o parecer de risco e segurança antes do seu. O pedido já foi encaminhado.' },
    ],
    resumo: 'Monta e dispara campanhas de retenção a partir de uma lista de clientes.',
  },
  {
    id: 'fila-003',
    nome: 'Esqueleto de job de carga noturna',
    tipo: 'esqueleto',
    autor: { nome: 'Vitor Salles', iniciais: 'VS', squad: 'Cartões · Faturamento' },
    enviadoEm: 'ontem às 11:05',
    esperandoHa: '1 d',
    visibilidade: 'frente',
    grau: 'baixo',
    gates: ['Agente validador', 'Coordenação'],
    veredito: 'aprovado',
    resumoVerificacao: '6 de 6 critérios sem apontamento.',
    apontamentos: [{ tom: 'info', texto: 'Mesma squad mantém outro ativo de job agendado.' }],
    resumo: 'Estrutura de job agendado com retentativa, log e alerta de falha.',
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
