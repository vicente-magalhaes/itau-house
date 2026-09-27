// Catálogo fictício do Itaú House. [SIMULADO] — nenhum dado real do Itaú.
// Pessoas, squads, números de reuso e conteúdo de README são inventados para a demo.

export const TIPOS = [
  { value: 'skill', label: 'Skill', plural: 'Skills', icone: 'scroll-text' },
  { value: 'agente', label: 'Agente', plural: 'Agentes', icone: 'bot' },
  { value: 'mcp', label: 'MCP', plural: 'MCPs', icone: 'cable' },
  { value: 'framework', label: 'Framework', plural: 'Frameworks', icone: 'blocks' },
  { value: 'componente', label: 'Componente', plural: 'Componentes', icone: 'component' },
  { value: 'esqueleto', label: 'Esqueleto de código', plural: 'Esqueletos', icone: 'code-xml' },
];

export const FRENTES = ['Cartões', 'Pix', 'Investimentos', 'Seguros', 'Crédito imobiliário', 'Canais digitais', 'Dados e analytics', 'Plataforma'];

export const FERRAMENTAS = ['Claude Code', 'Copilot', 'Agnóstico'];

export const VISIBILIDADES = [
  { value: 'banco', label: 'Banco inteiro', icone: 'globe', descricao: 'Qualquer pessoa do Itaú encontra e instala.' },
  { value: 'frente', label: 'Frente', icone: 'users', descricao: 'Só as squads da mesma frente.' },
  { value: 'squad', label: 'Squad', icone: 'lock', descricao: 'Só a squad que publicou.' },
];

// acessos = a lista de permissões que aparece antes de instalar.
export const ativos = [
  {
    id: 'ativo-001',
    nome: 'Critérios de aceitação a partir da história',
    tipo: 'skill',
    resumo: 'Lê a história do Jira e devolve critérios de aceitação no padrão dado/então, já com o caso incompleto.',
    frente: 'Cartões',
    squad: 'Cartões · Emissão',
    autor: { nome: 'Ana Ribeiro', iniciais: 'AR', papel: 'Dev sênior', squad: 'Cartões · Emissão' },
    visibilidade: 'banco',
    versao: '1.2.0',
    atualizadoEm: '2026-09-22',
    publicadoEm: '2026-08-14',
    reusos: 14,
    curtidas: 42,
    derivacoes: 3,
    squadsQueReusaram: ['Pix · Recebimentos', 'Investimentos · Renda fixa', 'Seguros · Vida'],
    tags: ['qualidade', 'refinamento', 'jira'],
    ferramentas: ['Claude Code', 'Copilot'],
    status: 'publicado',
    acessos: [
      { icone: 'file-text', titulo: 'Lê arquivos do repositório aberto', detalhe: 'Só leitura. Não escreve.' },
      { icone: 'globe', titulo: 'Sem acesso à rede', detalhe: 'Não faz chamadas externas.' },
      { icone: 'database', titulo: 'Sem acesso a dados de cliente', detalhe: 'Nenhum sistema transacional.' },
    ],
    readme: [
      '## O que faz',
      'Recebe a descrição de uma história e devolve critérios de aceitação testáveis, no padrão dado/então.',
      'Sempre inclui um critério para o caso incompleto: o que o sistema faz quando falta informação.',
      '',
      '## Quando usar',
      'No refinamento, antes de abrir a tarefa para desenvolvimento.',
      '',
      '## Limites',
      'Não substitui o refinamento com a pessoa de produto. Não conhece as regras de negócio do seu domínio: revise antes de colar no card.',
    ].join('\n'),
    comentarios: [
      { autor: 'Thiago Nunes', iniciais: 'TN', squad: 'Pix · Recebimentos', data: '2026-09-18', texto: 'Precisei adaptar o template de card da nossa squad.' },
      { autor: 'Marina Alves', iniciais: 'MA', squad: 'Seguros · Vida', data: '2026-09-10', texto: 'Sugestão: deixar o padrão do card parametrizável. Aqui precisei editar a skill.' },
    ],
    historico: [
      { data: '2026-08-13', evento: 'Detectada pelo hook na sessão de Ana Ribeiro', quem: 'Itaú House' },
      { data: '2026-08-13', evento: 'Barrada nas checagens: token no exemplo do prompt', quem: 'Validador' },
      { data: '2026-08-14', evento: 'Corrigida e aprovada nas checagens', quem: 'Validador' },
      { data: '2026-08-14', evento: 'Publicação aprovada', quem: 'Rafael Costa (coordenação Cartões)' },
      { data: '2026-09-22', evento: 'Versão 1.2.0 revalidada', quem: 'Validador' },
    ],
  },
  {
    id: 'ativo-002',
    nome: 'Revisor de PR com as regras da frente',
    tipo: 'agente',
    resumo: 'Revisa o pull request contra o guia de código da frente e aponta o trecho do guia que sustenta cada comentário.',
    frente: 'Canais digitais',
    squad: 'Canais digitais · App',
    autor: { nome: 'Bruno Tanaka', iniciais: 'BT', papel: 'Tech lead', squad: 'Canais digitais · App' },
    visibilidade: 'banco',
    versao: '2.0.1',
    atualizadoEm: '2026-09-19',
    publicadoEm: '2026-06-02',
    reusos: 31,
    curtidas: 57,
    derivacoes: 2,
    squadsQueReusaram: ['Cartões · Emissão', 'Pix · Recebimentos', 'Plataforma · Core', 'Seguros · Vida'],
    tags: ['revisão', 'padrão de código', 'pr'],
    ferramentas: ['Agnóstico'],
    status: 'publicado',
    acessos: [
      { icone: 'git-pull-request', titulo: 'Lê o diff do pull request', detalhe: 'Só leitura. Não aprova nem faz merge.' },
      { icone: 'message-square', titulo: 'Escreve comentários no PR', detalhe: 'Comentário simples, nunca aprovação.' },
      { icone: 'globe', titulo: 'Sem acesso à rede externa', detalhe: '' },
    ],
    readme: [
      '## O que faz',
      'Lê o diff e compara com o guia de código da frente. Cada comentário cita o item do guia que o sustenta.',
      '',
      '## Limites',
      'Não aprova nem bloqueia o PR. A decisão continua com a pessoa revisora.',
    ].join('\n'),
    comentarios: [
      { autor: 'Camila Duarte', iniciais: 'CD', squad: 'Plataforma · Core', data: '2026-09-05', texto: 'Trocamos o guia da frente pelo nosso e seguiu funcionando. Bom desenho.' },
    ],
    historico: [
      { data: '2026-06-02', evento: 'Publicação aprovada', quem: 'Letícia Moraes (coordenação Canais)' },
      { data: '2026-09-19', evento: 'Versão 2.0.1 revalidada', quem: 'Validador' },
    ],
  },
  {
    id: 'ativo-003',
    nome: 'Esqueleto de endpoint FastAPI com trilha de auditoria',
    tipo: 'esqueleto',
    resumo: 'Rota, validação, log de auditoria e teste já ligados. O time só escreve a regra de negócio.',
    frente: 'Plataforma',
    squad: 'Plataforma · Core',
    autor: { nome: 'Camila Duarte', iniciais: 'CD', papel: 'Dev sênior', squad: 'Plataforma · Core' },
    visibilidade: 'banco',
    versao: '3.1.0',
    atualizadoEm: '2026-09-24',
    publicadoEm: '2026-04-10',
    reusos: 47,
    curtidas: 88,
    derivacoes: 6,
    squadsQueReusaram: ['Pix · Recebimentos', 'Cartões · Emissão', 'Investimentos · Renda fixa', 'Seguros · Vida', 'Crédito imobiliário · Originação'],
    tags: ['backend', 'fastapi', 'auditoria'],
    ferramentas: ['Agnóstico'],
    status: 'publicado',
    acessos: [
      { icone: 'folder', titulo: 'Escreve arquivos na pasta do projeto', detalhe: 'Cria a estrutura da rota e os testes.' },
      { icone: 'globe', titulo: 'Sem acesso à rede', detalhe: '' },
    ],
    readme: '## O que faz\nGera a estrutura de um endpoint novo: rota, schema de entrada, log de auditoria e teste.\n\n## Limites\nNão decide contrato de API. O time define entrada e saída.',
    comentarios: [],
    historico: [
      { data: '2026-04-10', evento: 'Publicação aprovada', quem: 'Rodrigo Pinto (coordenação Plataforma)' },
    ],
  },
  {
    id: 'ativo-004',
    nome: 'Botão de contratação com rota e tracking',
    tipo: 'componente',
    resumo: 'Botão do design system já ligado à rota de contratação e ao evento de tracking padrão.',
    frente: 'Canais digitais',
    squad: 'Canais digitais · Web',
    autor: { nome: 'Pedro Yamada', iniciais: 'PY', papel: 'Dev front', squad: 'Canais digitais · Web' },
    visibilidade: 'frente',
    versao: '1.0.4',
    atualizadoEm: '2026-09-11',
    publicadoEm: '2026-07-21',
    reusos: 9,
    curtidas: 12,
    derivacoes: 1,
    squadsQueReusaram: ['Cartões · Emissão', 'Seguros · Vida'],
    tags: ['front', 'design system', 'tracking'],
    ferramentas: ['Agnóstico'],
    status: 'publicado',
    acessos: [
      { icone: 'folder', titulo: 'Escreve arquivos na pasta do projeto', detalhe: '' },
      { icone: 'activity', titulo: 'Dispara evento de tracking', detalhe: 'Evento anônimo de navegação.' },
    ],
    readme: '## O que faz\nEntrega o botão já com a rota de contratação e o evento de tracking padrão da frente.',
    comentarios: [],
    historico: [{ data: '2026-07-21', evento: 'Publicação aprovada', quem: 'Letícia Moraes (coordenação Canais)' }],
  },
  {
    id: 'ativo-005',
    nome: 'Conector MCP do catálogo de APIs internas',
    tipo: 'mcp',
    resumo: 'Deixa o agente consultar o catálogo de APIs internas e responder qual serviço já expõe o dado.',
    frente: 'Plataforma',
    squad: 'Plataforma · Integrações',
    autor: { nome: 'Rodrigo Pinto', iniciais: 'RP', papel: 'Arquiteto', squad: 'Plataforma · Integrações' },
    visibilidade: 'banco',
    versao: '0.9.2',
    atualizadoEm: '2026-09-25',
    publicadoEm: '2026-09-01',
    reusos: 22,
    curtidas: 35,
    derivacoes: 0,
    squadsQueReusaram: ['Cartões · Emissão', 'Pix · Recebimentos', 'Dados e analytics · Engenharia'],
    tags: ['mcp', 'apis', 'descoberta'],
    ferramentas: ['Claude Code', 'Copilot'],
    status: 'publicado',
    acessos: [
      { icone: 'globe', titulo: 'Acessa a rede interna', detalhe: 'Só o catálogo de APIs. Nenhum endpoint transacional.' },
      { icone: 'key', titulo: 'Usa a credencial do próprio usuário', detalhe: 'Nenhum segredo embarcado no ativo.' },
      { icone: 'database', titulo: 'Lê metadados de serviços', detalhe: 'Nome, dono e contrato. Nunca dado de cliente.' },
    ],
    readme: '## O que faz\nExpõe o catálogo de APIs internas para o agente. Serve para responder se o dado já existe antes de construir.\n\n## Limites\nSó metadados. Não chama a API nem lê dado de cliente.',
    comentarios: [],
    historico: [
      { data: '2026-09-01', evento: 'Publicação aprovada', quem: 'Rodrigo Pinto (coordenação Plataforma)' },
    ],
  },
  {
    id: 'ativo-006',
    nome: 'Gerador de massa de teste sem dado real',
    tipo: 'skill',
    resumo: 'Cria massa de teste com CPF, conta e cartão sintéticos, com dígito verificador válido e nenhum dado real.',
    frente: 'Dados e analytics',
    squad: 'Dados e analytics · Qualidade',
    autor: { nome: 'Juliana Prado', iniciais: 'JP', papel: 'Engenheira de dados', squad: 'Dados e analytics · Qualidade' },
    visibilidade: 'banco',
    versao: '2.3.0',
    atualizadoEm: '2026-09-16',
    publicadoEm: '2026-05-08',
    reusos: 38,
    curtidas: 64,
    derivacoes: 4,
    squadsQueReusaram: ['Cartões · Emissão', 'Pix · Recebimentos', 'Conta · Cadastro', 'Seguros · Vida'],
    tags: ['teste', 'dados sintéticos', 'compliance'],
    ferramentas: ['Agnóstico'],
    status: 'publicado',
    acessos: [
      { icone: 'folder', titulo: 'Escreve arquivos de teste', detalhe: '' },
      { icone: 'shield-check', titulo: 'Nunca lê base real', detalhe: 'Gera tudo sinteticamente.' },
    ],
    readme: '## O que faz\nGera massa de teste sintética com formato válido, sem tocar em base real.',
    comentarios: [],
    historico: [{ data: '2026-05-08', evento: 'Publicação aprovada', quem: 'Aline Souza (coordenação Dados)' }],
  },
  {
    id: 'ativo-007',
    nome: 'Framework de feature flag por squad',
    tipo: 'framework',
    resumo: 'Padrão de feature flag com dono, prazo de validade e remoção automática da flag vencida.',
    frente: 'Plataforma',
    squad: 'Plataforma · Core',
    autor: { nome: 'Camila Duarte', iniciais: 'CD', papel: 'Dev sênior', squad: 'Plataforma · Core' },
    visibilidade: 'banco',
    versao: '1.4.2',
    atualizadoEm: '2026-08-30',
    publicadoEm: '2026-03-19',
    reusos: 26,
    curtidas: 29,
    derivacoes: 2,
    squadsQueReusaram: ['Canais digitais · App', 'Cartões · Emissão', 'Investimentos · Renda fixa'],
    tags: ['backend', 'release', 'governança'],
    ferramentas: ['Agnóstico'],
    status: 'publicado',
    acessos: [{ icone: 'folder', titulo: 'Escreve arquivos de configuração', detalhe: '' }],
    readme: '## O que faz\nPadroniza feature flags com dono e validade. Flag vencida entra na lista de remoção.',
    comentarios: [],
    historico: [{ data: '2026-03-19', evento: 'Publicação aprovada', quem: 'Rodrigo Pinto (coordenação Plataforma)' }],
  },
  {
    id: 'ativo-008',
    nome: 'Agente de migração de teste legado',
    tipo: 'agente',
    resumo: 'Converte testes antigos para o padrão atual da frente e explica cada conversão que fez.',
    frente: 'Cartões',
    squad: 'Cartões · Faturamento',
    autor: { nome: 'Rafael Costa', iniciais: 'RC', papel: 'Coordenador', squad: 'Cartões · Faturamento' },
    visibilidade: 'frente',
    versao: '1.1.0',
    atualizadoEm: '2026-09-08',
    publicadoEm: '2026-07-04',
    reusos: 6,
    curtidas: 7,
    derivacoes: 0,
    squadsQueReusaram: ['Cartões · Emissão'],
    tags: ['teste', 'legado', 'migração'],
    ferramentas: ['Claude Code'],
    status: 'publicado',
    acessos: [
      { icone: 'folder', titulo: 'Lê e escreve arquivos de teste', detalhe: 'Não toca em código de produção.' },
    ],
    readme: '## O que faz\nConverte testes no padrão antigo para o atual, com um resumo do que mudou em cada arquivo.',
    comentarios: [],
    historico: [{ data: '2026-07-04', evento: 'Publicação aprovada', quem: 'Rafael Costa (coordenação Cartões)' }],
  },
  {
    id: 'ativo-009',
    nome: 'Skill de resumo de incidente para o pós-morte',
    tipo: 'skill',
    resumo: 'Junta linha do tempo, impacto e ações do incidente num rascunho de pós-morte para o time revisar.',
    frente: 'Pix',
    squad: 'Pix · Operação',
    autor: { nome: 'Thiago Nunes', iniciais: 'TN', papel: 'Dev sênior', squad: 'Pix · Recebimentos' },
    visibilidade: 'banco',
    versao: '1.0.0',
    atualizadoEm: '2026-09-13',
    publicadoEm: '2026-09-13',
    reusos: 4,
    curtidas: 18,
    derivacoes: 1,
    squadsQueReusaram: ['Canais digitais · App'],
    tags: ['incidente', 'operação', 'documentação'],
    ferramentas: ['Agnóstico'],
    status: 'publicado',
    acessos: [{ icone: 'file-text', titulo: 'Lê o registro de incidente que você colar', detalhe: 'Nada é buscado automaticamente.' }],
    readme: '## O que faz\nMonta o rascunho do pós-morte a partir da linha do tempo do incidente.',
    comentarios: [],
    historico: [{ data: '2026-09-13', evento: 'Publicação aprovada', quem: 'Marcos Leal (coordenação Pix)' }],
  },
  {
    id: 'ativo-010',
    nome: 'Esqueleto de tela de consulta com filtros',
    tipo: 'esqueleto',
    resumo: 'Tela de lista com busca, filtros, paginação e estado vazio, já no design system.',
    frente: 'Canais digitais',
    squad: 'Canais digitais · Web',
    autor: { nome: 'Pedro Yamada', iniciais: 'PY', papel: 'Dev front', squad: 'Canais digitais · Web' },
    visibilidade: 'banco',
    versao: '2.2.0',
    atualizadoEm: '2026-09-02',
    publicadoEm: '2026-02-27',
    reusos: 19,
    curtidas: 23,
    derivacoes: 2,
    squadsQueReusaram: ['Investimentos · Renda fixa', 'Seguros · Vida', 'Cartões · Faturamento'],
    tags: ['front', 'lista', 'design system'],
    ferramentas: ['Agnóstico'],
    status: 'publicado',
    acessos: [{ icone: 'folder', titulo: 'Escreve arquivos na pasta do projeto', detalhe: '' }],
    readme: '## O que faz\nGera a tela de lista completa: busca, filtros, paginação e estado vazio.',
    comentarios: [],
    historico: [{ data: '2026-02-27', evento: 'Publicação aprovada', quem: 'Letícia Moraes (coordenação Canais)' }],
  },
  {
    id: 'ativo-011',
    nome: 'Agente de conciliação de extrato',
    tipo: 'agente',
    resumo: 'Compara o extrato do parceiro com o nosso registro e lista as diferenças para a pessoa analisar.',
    frente: 'Pix',
    squad: 'Pix · Recebimentos',
    autor: { nome: 'Thiago Nunes', iniciais: 'TN', papel: 'Dev sênior', squad: 'Pix · Recebimentos' },
    visibilidade: 'squad',
    versao: '0.4.0',
    atualizadoEm: '2026-09-23',
    publicadoEm: '2026-09-23',
    reusos: 1,
    curtidas: 3,
    derivacoes: 0,
    squadsQueReusaram: [],
    tags: ['conciliação', 'operação'],
    ferramentas: ['Claude Code'],
    status: 'publicado',
    acessos: [
      { icone: 'database', titulo: 'Lê o arquivo de extrato que você indicar', detalhe: 'Arquivo local. Nenhum sistema transacional.' },
      { icone: 'globe', titulo: 'Sem acesso à rede', detalhe: '' },
    ],
    readme: '## O que faz\nCompara dois extratos e lista as diferenças. Nenhuma correção é aplicada sozinha.\n\n## Limites\nVisível só para a squad enquanto o formato do parceiro não estiver estável.',
    comentarios: [],
    historico: [
      { data: '2026-09-23', evento: 'Publicação aprovada', quem: 'Marcos Leal (coordenação Pix)' },
    ],
  },
  {
    id: 'ativo-012',
    nome: 'Skill de tradução de regra de negócio em teste',
    tipo: 'skill',
    resumo: 'Transforma a regra escrita pela área de negócio num teste automatizado e aponta o que ficou ambíguo.',
    frente: 'Seguros',
    squad: 'Seguros · Vida',
    autor: { nome: 'Marina Alves', iniciais: 'MA', papel: 'Dev pleno', squad: 'Seguros · Vida' },
    visibilidade: 'banco',
    versao: '1.3.1',
    atualizadoEm: '2026-09-20',
    publicadoEm: '2026-06-18',
    reusos: 11,
    curtidas: 20,
    derivacoes: 1,
    squadsQueReusaram: ['Cartões · Faturamento', 'Crédito imobiliário · Originação'],
    tags: ['teste', 'regra de negócio', 'qualidade'],
    ferramentas: ['Copilot', 'Claude Code'],
    status: 'publicado',
    acessos: [{ icone: 'folder', titulo: 'Escreve arquivos de teste', detalhe: '' }],
    readme: '## O que faz\nLê a regra escrita pela área de negócio e devolve o teste, além da lista do que ficou ambíguo.',
    comentarios: [],
    historico: [{ data: '2026-06-18', evento: 'Publicação aprovada', quem: 'Paula Rezende (coordenação Seguros)' }],
  },
];

export function acharAtivo(id) {
  return ativos.find((a) => a.id === id);
}

export function rotuloTipo(tipo) {
  const t = TIPOS.find((x) => x.value === tipo);
  return t ? t.label : tipo;
}

export function iconeTipo(tipo) {
  const t = TIPOS.find((x) => x.value === tipo);
  return t ? t.icone : 'box';
}

export function rotuloVisibilidade(v) {
  const x = VISIBILIDADES.find((i) => i.value === v);
  return x ? x.label : v;
}

export function iconeVisibilidade(v) {
  const x = VISIBILIDADES.find((i) => i.value === v);
  return x ? x.icone : 'eye';
}

// Data no formato do guia de marca: 22 de setembro de 2026.
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

export function formatarData(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

export function formatarDataCurta(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${a}`;
}

export function pluralTipo(tipo) {
  const t = TIPOS.find((x) => x.value === tipo);
  return t ? t.plural : tipo;
}

// "Cartões · Emissão" -> "Cartões".
export function frenteDaSquad(squad) {
  return String(squad).split('·')[0].trim();
}

// Alcance (RF-05): ativo de squad só aparece para a própria squad; de frente, só para a mesma frente.
export function visivelPara(ativo, pessoa) {
  if (ativo.visibilidade === 'squad') return ativo.squad === pessoa.squad;
  if (ativo.visibilidade === 'frente') return ativo.frente === frenteDaSquad(pessoa.squad);
  return true;
}

// "Hoje" vem do próprio catálogo, não do relógio: a demo não envelhece até a banca.
export const HOJE = ativos.reduce((maior, a) => (a.atualizadoEm > maior ? a.atualizadoEm : maior), ativos[0].atualizadoEm);

export function tempoRelativo(iso) {
  const dias = Math.max(0, Math.round((Date.parse(HOJE) - Date.parse(iso)) / 86400000));
  if (dias === 0) return 'hoje';
  if (dias < 30) return `há ${dias} d`;
  const meses = Math.round(dias / 30);
  return meses < 12 ? `há ${meses} m` : `há ${Math.round(meses / 12)} a`;
}

// Ordens do feed. "Em alta" é a popularidade do RF-25: curtidas + instalações.
export const ORDENS = [
  { value: 'alta', label: 'Em alta', icone: 'flame' },
  { value: 'curtidos', label: 'Mais curtidos', icone: 'arrow-big-up' },
  { value: 'novos', label: 'Novos', icone: 'clock' },
];

export function ordenar(lista, ordem, curtidasDe, instalacoesDe) {
  const copia = lista.slice();
  if (ordem === 'curtidos') return copia.sort((a, b) => curtidasDe(b) - curtidasDe(a) || instalacoesDe(b) - instalacoesDe(a));
  if (ordem === 'novos') return copia.sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm));
  return copia.sort((a, b) => curtidasDe(b) + instalacoesDe(b) - (curtidasDe(a) + instalacoesDe(a)));
}
