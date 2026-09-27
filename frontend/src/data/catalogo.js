// Catálogo fictício do Itaú House. [SIMULADO] — nenhum dado real do Itaú.
// Pessoas, squads, números de reuso e conteúdo são inventados para a demo.
// Fotos: retratos do randomuser.me, banco de imagens para protótipos. Sem internet, a Foto cai nas iniciais.

const retrato = (g, n) => `https://randomuser.me/api/portraits/${g}/${n}.jpg`;

export const PAPEIS = ['Produto', 'Design', 'Engenharia', 'Dados', 'Negócio'];

export const pessoas = {
  ana: { nome: 'Ana Ribeiro', papel: 'Produto', cargo: 'PM', squad: 'Cartões · Emissão', foto: retrato('women', 44) },
  marina: { nome: 'Marina Alves', papel: 'Produto', cargo: 'PM', squad: 'Seguros · Vida', foto: retrato('women', 26) },
  leticia: { nome: 'Letícia Moraes', papel: 'Produto', cargo: 'Coordenadora de produto', squad: 'Canais digitais · App', foto: retrato('women', 12) },
  rafaela: { nome: 'Rafaela Nunes', papel: 'Design', cargo: 'Product designer', squad: 'Canais digitais · Web', foto: retrato('women', 65) },
  carla: { nome: 'Carla Menezes', papel: 'Design', cargo: 'UX researcher', squad: 'Investimentos · Renda fixa', foto: retrato('women', 90) },
  luiza: { nome: 'Luiza Campos', papel: 'Design', cargo: 'Designer de pesquisa', squad: 'Cartões · Faturamento', foto: retrato('women', 57) },
  pedro: { nome: 'Pedro Yamada', papel: 'Design', cargo: 'Designer de sistemas', squad: 'Canais digitais · Web', foto: retrato('men', 22) },
  bruno: { nome: 'Bruno Tanaka', papel: 'Engenharia', cargo: 'Tech lead', squad: 'Canais digitais · App', foto: retrato('men', 32) },
  camila: { nome: 'Camila Duarte', papel: 'Engenharia', cargo: 'Dev sênior', squad: 'Plataforma · Core', foto: retrato('women', 68) },
  thiago: { nome: 'Thiago Nunes', papel: 'Engenharia', cargo: 'Dev sênior', squad: 'Pix · Recebimentos', foto: retrato('men', 75) },
  rodrigo: { nome: 'Rodrigo Pinto', papel: 'Engenharia', cargo: 'Arquiteto', squad: 'Plataforma · Integrações', foto: retrato('men', 85) },
  juliana: { nome: 'Juliana Prado', papel: 'Dados', cargo: 'Engenheira de dados', squad: 'Dados · Qualidade', foto: retrato('women', 33) },
  aline: { nome: 'Aline Souza', papel: 'Dados', cargo: 'Cientista de dados', squad: 'Dados · Modelos', foto: retrato('women', 79) },
  marcos: { nome: 'Marcos Leal', papel: 'Negócio', cargo: 'Analista de finanças', squad: 'Finanças · Planejamento', foto: retrato('men', 46) },
  joao: { nome: 'João Batista', papel: 'Negócio', cargo: 'Agilista', squad: 'Seguros · Vida', foto: retrato('men', 61) },
  // Perfil Coordenação do login simulado. Não publica ativos: só aprova.
  rafael: { nome: 'Rafael Costa', papel: 'Coordenação', cargo: 'Coordenador', squad: 'Cartões · Faturamento', foto: retrato('men', 52) },
};

Object.entries(pessoas).forEach(([id, p]) => {
  const partes = p.nome.split(' ');
  p.id = id;
  p.primeiro = partes[0];
  p.iniciais = partes[0][0] + partes[partes.length - 1][0];
});

// Estantes: todas com capa preta e ícone laranja. Só o ícone muda.
export const ESTANTES = {
  ia: { nome: 'Pra IA', icone: 'sparkles' },
  metodo: { nome: 'Métodos', icone: 'compass' },
  material: { nome: 'Materiais', icone: 'presentation' },
  codigo: { nome: 'Código', icone: 'code-xml' },
};

export function iconeEstante(estante) {
  return ESTANTES[estante] ? ESTANTES[estante].icone : 'box';
}

export const VISIBILIDADES = [
  { value: 'banco', label: 'Banco inteiro', icone: 'globe', descricao: 'Qualquer pessoa do Itaú encontra e usa.' },
  { value: 'frente', label: 'Frente', icone: 'users', descricao: 'Só as squads da mesma frente.' },
  { value: 'squad', label: 'Squad', icone: 'lock', descricao: 'Só a squad que publicou.' },
];

// papeis = reaproveitamentos por papel, na ordem de PAPEIS. dentro e deriv = [nome, detalhe] e [pessoa, o que adaptou].
const brutos = [
  { id: 'a1', titulo: 'Roteiro de entrevista de discovery', tipo: 'Roteiro', estante: 'metodo', autor: 'ana', resumo: 'Perguntas abertas por etapa da jornada, com dicas pra não induzir resposta e um campo pra anotar evidência.', formato: 'Doc de 6 páginas', ferr: ['Notion', 'Confluence', 'Google Docs'], curtidas: 96, reusos: 58, adapt: 7, papeis: [24, 21, 4, 3, 6], atualizadoEm: '2026-09-23', versao: '2.1', aprovou: 'Letícia Moraes', tags: 'discovery pesquisa usuario entrevista',
    dentro: [['Roteiro base', 'Abertura, contexto, jornada e encerramento'], ['Banco de perguntas', '40 perguntas por etapa'], ['Folha de evidências', 'Tabela pra anotar citação e sinal']],
    deriv: [['carla', 'Adaptou pra entrevistas com pessoas investidoras'], ['marina', 'Versão curta de 20 minutos pra Seguros'], ['joao', 'Base pra entrevistar áreas de negócio']] },
  { id: 'a2', titulo: 'Modelo de slides: review trimestral de produto', tipo: 'Modelo de slides', estante: 'material', autor: 'leticia', resumo: 'Abre com o resultado, segue com aprendizados e fecha com as apostas do próximo trimestre. Gráficos já no padrão da marca.', formato: '14 slides', ferr: ['Google Slides', 'PowerPoint', 'Keynote'], curtidas: 88, reusos: 41, adapt: 5, papeis: [22, 5, 3, 4, 7], atualizadoEm: '2026-09-19', versao: '1.4', aprovou: 'Paula Rezende', tags: 'slides apresentacao review trimestral resultado',
    dentro: [['Capa e agenda', '2 slides'], ['Resultados', '4 layouts de métrica e gráfico'], ['Aprendizados', '3 layouts com citação e evidência'], ['Próximas apostas', 'Roadmap em 3 horizontes']],
    deriv: [['marcos', 'Versão pro comitê de Finanças'], ['ana', 'Adaptou pra review mensal da squad']] },
  { id: 'a3', titulo: 'Kit de telas de onboarding no design system', tipo: 'Kit de design', estante: 'material', autor: 'rafaela', resumo: 'Fluxo completo de abertura de conta em 18 telas, com estados de erro, carregamento e acessibilidade anotada.', formato: '18 telas', ferr: ['Figma'], curtidas: 74, reusos: 33, adapt: 4, papeis: [6, 20, 5, 0, 2], atualizadoEm: '2026-09-21', versao: '3.0', aprovou: 'Letícia Moraes', tags: 'telas design system figma onboarding acessibilidade',
    dentro: [['Fluxo principal', '18 telas com protótipo navegável'], ['Estados', 'Erro, vazio, carregando e sucesso'], ['Acessibilidade', 'Ordem de leitura e contraste anotados']],
    deriv: [['pedro', 'Transformou em componentes reutilizáveis'], ['thiago', 'Referência pra implementar no app']] },
  { id: 'a4', titulo: 'Critérios de aceitação a partir da história', tipo: 'Skill', estante: 'ia', autor: 'ana', resumo: 'Lê a história e devolve critérios no padrão dado, quando, então, já com o caso incompleto.', formato: 'Skill para qualquer agente', ferr: ['Claude', 'Copilot', 'ChatGPT', 'Gemini'], curtidas: 71, reusos: 64, adapt: 6, papeis: [18, 2, 38, 3, 3], atualizadoEm: '2026-09-24', versao: '1.2', aprovou: 'Rafael Costa', tags: 'criterios aceitacao historia casos teste refinamento',
    dentro: [['Instruções', 'Como ler a história e montar os critérios'], ['Exemplos', '5 histórias anonimizadas'], ['Checklist', 'O que revisar antes de colar no card']],
    deriv: [['thiago', 'Adaptou pra gerar casos de teste'], ['joao', 'Versão pra histórias de processo interno'], ['bruno', 'Ligou ao revisor de PR']] },
  { id: 'a5', titulo: 'Prompt de síntese de pesquisa com usuários', tipo: 'Prompt', estante: 'ia', autor: 'carla', resumo: 'Agrupa trechos de entrevista em temas, separa evidência de opinião e marca o que precisa de mais dado.', formato: 'Prompt para qualquer assistente', ferr: ['ChatGPT', 'Claude', 'Gemini', 'Copilot'], curtidas: 65, reusos: 47, adapt: 5, papeis: [19, 22, 1, 4, 1], atualizadoEm: '2026-09-22', versao: '1.1', aprovou: 'Marcos Leal', tags: 'sintese pesquisa usuario entrevista',
    dentro: [['Prompt principal', 'Síntese por temas'], ['Prompt de checagem', 'Aponta conclusões sem evidência'], ['Formato de saída', 'Tabela tema, evidência e força']],
    deriv: [['ana', 'Usa depois do roteiro de discovery'], ['aline', 'Adaptou pra respostas abertas de NPS']] },
  { id: 'a6', titulo: 'Priorização RICE com risco regulatório', tipo: 'Framework', estante: 'metodo', autor: 'marina', resumo: 'O RICE de sempre, com peso pra risco regulatório e uma pergunta de corte pra itens que dependem de compliance.', formato: 'Planilha e guia', ferr: ['Google Sheets', 'Excel', 'Miro'], curtidas: 58, reusos: 36, adapt: 3, papeis: [21, 4, 5, 2, 4], atualizadoEm: '2026-09-12', versao: '1.0', aprovou: 'Paula Rezende', tags: 'framework priorizacao rice roadmap',
    dentro: [['Guia de uso', 'Quando usar e como pontuar'], ['Planilha', 'Cálculo automático e ranking'], ['Quadro no Miro', 'Versão pra sessão ao vivo']],
    deriv: [['leticia', 'Adotou no planejamento trimestral da frente'], ['marcos', 'Somou o custo estimado de IA']] },
  { id: 'a7', titulo: 'Revisor de PR com as regras da frente', tipo: 'Agente', estante: 'ia', autor: 'bruno', resumo: 'Revisa o pull request contra o guia de código da frente e cita o trecho do guia em cada comentário.', formato: 'Agente com conector MCP', ferr: ['Copilot', 'Claude', 'Cursor', 'Gemini'], curtidas: 57, reusos: 31, adapt: 2, papeis: [0, 1, 29, 1, 0], atualizadoEm: '2026-09-19', versao: '2.0', aprovou: 'Letícia Moraes', tags: 'revisor pr codigo revisao',
    dentro: [['Instruções', 'Como comparar o diff com o guia'], ['Guia da frente', 'Troque pelo guia da sua frente'], ['Permissões', 'Só lê o diff e comenta']],
    deriv: [['camila', 'Trocou o guia pelo da Plataforma'], ['rodrigo', 'Somou regras de arquitetura']] },
  { id: 'a8', titulo: 'Playbook de teste de usabilidade remoto', tipo: 'Playbook', estante: 'metodo', autor: 'luiza', resumo: 'Do recrutamento ao relatório: roteiro de tarefas, termo de consentimento e relatório em uma página.', formato: 'Playbook em 5 etapas', ferr: ['Notion', 'Figma', 'Teams'], curtidas: 49, reusos: 22, adapt: 2, papeis: [7, 13, 1, 0, 1], atualizadoEm: '2026-09-20', versao: '1.3', aprovou: 'Rafael Costa', tags: 'usabilidade teste pesquisa playbook',
    dentro: [['Recrutamento', 'Critérios e mensagem-convite'], ['Roteiro de tarefas', 'Modelo com 5 tarefas'], ['Relatório', 'Uma página com achados e severidade']],
    deriv: [['carla', 'Versão pra testes com pessoas investidoras']] },
  { id: 'a9', titulo: 'Esqueleto de endpoint com trilha de auditoria', tipo: 'Esqueleto de código', estante: 'codigo', autor: 'camila', resumo: 'Rota, validação, log de auditoria e teste já ligados. O time só escreve a regra de negócio.', formato: 'Repositório Python', ferr: ['Cursor', 'Copilot', 'Claude', 'VS Code'], curtidas: 62, reusos: 47, adapt: 6, papeis: [0, 0, 45, 2, 0], atualizadoEm: '2026-09-05', versao: '3.1', aprovou: 'Rodrigo Pinto', tags: 'esqueleto endpoint api auditoria backend',
    dentro: [['Rota e schema', 'Entrada validada'], ['Auditoria', 'Log de quem fez o quê'], ['Testes', 'Caso feliz e caso incompleto']],
    deriv: [['thiago', 'Versão pra endpoints de Pix'], ['juliana', 'Somou gerador de massa nos testes']] },
  { id: 'a10', titulo: 'Gerador de massa de teste sintética', tipo: 'Skill', estante: 'ia', autor: 'juliana', resumo: 'Cria CPF, conta e cartão sintéticos com dígito verificador válido. Nenhum dado real.', formato: 'Skill para qualquer agente', ferr: ['Claude', 'Copilot', 'ChatGPT'], curtidas: 54, reusos: 38, adapt: 4, papeis: [3, 1, 26, 8, 0], atualizadoEm: '2026-09-19', versao: '2.3', aprovou: 'Aline Souza', tags: 'massa teste sintetica dados',
    dentro: [['Instruções', 'Formatos e regras de dígito'], ['Exemplos', 'CPF, conta, cartão e chave Pix'], ['Garantias', 'Nunca lê base real']],
    deriv: [['thiago', 'Massa específica pra Pix']] },
  { id: 'a11', titulo: 'One-pager pra comitê de investimento', tipo: 'Template de documento', estante: 'material', autor: 'marcos', resumo: 'Uma página com problema, custo, retorno esperado e riscos. O formato que o comitê pediu pra padronizar.', formato: 'Documento de 1 página', ferr: ['Word', 'Google Docs', 'Notion'], curtidas: 44, reusos: 29, adapt: 3, papeis: [12, 1, 2, 2, 12], atualizadoEm: '2026-09-22', versao: '1.0', aprovou: 'Paula Rezende', tags: 'one-pager comite investimento custo documento',
    dentro: [['Modelo', 'Problema, custo, retorno e riscos'], ['Exemplo preenchido', 'Caso fictício de Seguros'], ['Checklist do comitê', 'O que costuma ser perguntado']],
    deriv: [['leticia', 'Versão pra pedido de headcount'], ['marina', 'Usou na aposta de Seguros · Vida']] },
  { id: 'a12', titulo: 'Painel de saúde da squad', tipo: 'Dashboard', estante: 'material', autor: 'aline', resumo: 'Lead time, reuso de ativos e satisfação do time num painel só, pronto pra ligar nas fontes da squad.', formato: 'Painel com 6 visões', ferr: ['Power BI', 'Looker Studio'], curtidas: 39, reusos: 18, adapt: 2, papeis: [8, 1, 3, 5, 1], atualizadoEm: '2026-09-12', versao: '1.2', aprovou: 'Aline Souza', tags: 'painel dashboard squad metricas',
    dentro: [['Visões', 'Entrega, qualidade, reuso e time'], ['Conectores', 'Jira, Git e pesquisa de clima'], ['Guia de leitura', 'O que cada número significa']],
    deriv: [['leticia', 'Versão consolidada da frente']] },
  { id: 'a13', titulo: 'Retrospectiva com síntese por IA', tipo: 'Ritual', estante: 'metodo', autor: 'joao', resumo: 'Retro em 45 minutos: o time escreve, a IA agrupa e o time decide. Com roteiro pra quem facilita.', formato: 'Roteiro e quadro', ferr: ['Miro', 'FigJam', 'Teams'], curtidas: 47, reusos: 26, adapt: 3, papeis: [8, 5, 9, 2, 2], atualizadoEm: '2026-09-21', versao: '1.1', aprovou: 'Paula Rezende', tags: 'retrospectiva ritual agil time',
    dentro: [['Roteiro de facilitação', 'Tempo de cada bloco'], ['Quadro', 'Modelo pronto no Miro e no FigJam'], ['Prompt de agrupamento', 'Temas e ações']],
    deriv: [['bruno', 'Versão pra retro de incidente']] },
  { id: 'a14', titulo: 'Agente de acessibilidade para telas', tipo: 'Agente', estante: 'ia', autor: 'pedro', resumo: 'Revisa o frame no Figma e aponta contraste, ordem de leitura e alvo de toque abaixo do mínimo.', formato: 'Plugin do Figma e conector MCP', ferr: ['Figma', 'Claude', 'Copilot'], curtidas: 52, reusos: 24, adapt: 2, papeis: [2, 15, 6, 0, 1], atualizadoEm: '2026-09-19', versao: '0.9', aprovou: 'Letícia Moraes', tags: 'acessibilidade checklist figma telas contraste',
    dentro: [['Regras', 'Contraste, alvo de toque e leitura'], ['Relatório', 'Lista por frame com sugestão'], ['Permissões', 'Só lê o arquivo aberto']],
    deriv: [['rafaela', 'Rodou no kit de onboarding'], ['luiza', 'Somou regras de conteúdo']] },
];

// "Cartões · Emissão" -> "Cartões".
export function frenteDaSquad(squad) {
  return String(squad).split('·')[0].trim();
}

// Todo ativo da demo tem alcance "Banco inteiro". A squad e a frente vêm de quem publicou.
export const ativos = brutos.map((a) => {
  const autor = pessoas[a.autor];
  return {
    ...a,
    autor,
    squad: autor.squad,
    frente: frenteDaSquad(autor.squad),
    visibilidade: 'banco',
    dentro: a.dentro.map(([nome, detalhe]) => ({ nome, detalhe })),
    deriv: a.deriv.map(([id, texto]) => ({ pessoa: pessoas[id], texto })),
  };
});

export function acharAtivo(id) {
  return ativos.find((a) => a.id === id);
}

// Pedidos: o que alguém procurou e não achou. criador = quem já assumiu fazer.
export const pedidos = [
  { id: 'p1', titulo: 'Agente que explica uma query SQL em português', estante: 'ia', autor: 'joao', querem: 15, criador: 'aline' },
  { id: 'p2', titulo: 'Skill que transforma ata de reunião em tarefas', estante: 'ia', autor: 'leticia', querem: 12, criador: 'thiago' },
  { id: 'p3', titulo: 'Framework pra estimar o custo de IA por squad', estante: 'metodo', autor: 'marcos', querem: 9 },
  { id: 'p4', titulo: 'Modelo de slides pra apresentar resultado de teste A/B', estante: 'material', autor: 'marina', querem: 7 },
  { id: 'p5', titulo: 'Checklist de acessibilidade pra conteúdo de e-mail', estante: 'metodo', autor: 'luiza', querem: 5 },
].map((p) => ({ ...p, autor: pessoas[p.autor], criador: p.criador ? pessoas[p.criador] : null }));

export function rotuloVisibilidade(v) {
  const x = VISIBILIDADES.find((i) => i.value === v);
  return x ? x.label : v;
}

export function iconeVisibilidade(v) {
  const x = VISIBILIDADES.find((i) => i.value === v);
  return x ? x.icone : 'eye';
}

// Alcance (RF-05): ativo de squad só aparece para a própria squad; de frente, só para a mesma frente.
export function visivelPara(ativo, pessoa) {
  if (ativo.visibilidade === 'squad') return ativo.squad === pessoa.squad;
  if (ativo.visibilidade === 'frente') return ativo.frente === frenteDaSquad(pessoa.squad);
  return true;
}

export function formatarDataCurta(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${a}`;
}

// "Hoje" é fixo, não vem do relógio: a demo não envelhece até a banca.
export const HOJE = '2026-09-26';

export function tempoRelativo(iso) {
  const dias = Math.max(0, Math.round((Date.parse(HOJE) - Date.parse(iso)) / 86400000));
  if (dias === 0) return 'hoje';
  if (dias < 7) return `há ${dias} d`;
  if (dias < 30) return `há ${Math.round(dias / 7)} sem`;
  const meses = Math.round(dias / 30);
  return meses < 12 ? `há ${meses} m` : `há ${Math.round(meses / 12)} a`;
}

// Ordens do início. "Em alta" é a popularidade do RF-25: curtidas + reaproveitamentos.
export const ORDENS = [
  { value: 'alta', label: 'Em alta' },
  { value: 'novos', label: 'Novos' },
  { value: 'adaptados', label: 'Mais adaptados' },
];

export function ordenar(lista, ordem, curtidasDe, reusosDe) {
  const copia = lista.slice();
  if (ordem === 'novos') return copia.sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
  if (ordem === 'adaptados') return copia.sort((a, b) => b.adapt - a.adapt);
  return copia.sort((a, b) => curtidasDe(b) + reusosDe(b) - (curtidasDe(a) + reusosDe(a)));
}

// Busca sem acento: palavras com 4 letras ou mais, sem o plural. Ganha quem casa mais palavras.
// Sem nenhuma palavra que conte, devolve null e quem chama ordena como quiser.
function normalizar(texto) {
  return String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function buscar(lista, termo) {
  const palavras = normalizar(termo)
    .split(/[^a-z0-9]+/)
    .filter((p) => p.length >= 4)
    .map((p) => p.replace(/s$/, ''));
  if (!palavras.length) return null;
  return lista
    .map((a) => {
      const texto = normalizar([a.titulo, a.resumo, a.tipo, a.tags, a.autor.nome, a.autor.papel, a.ferr.join(' ')].join(' '));
      return { a, pontos: palavras.filter((p) => texto.includes(p)).length };
    })
    .filter((x) => x.pontos > 0)
    .sort((x, y) => y.pontos - x.pontos)
    .map((x) => x.a);
}

// Passos do "Usar em": mudam com o tipo de ferramenta.
const ASSISTENTES = ['Claude', 'Copilot', 'ChatGPT', 'Gemini', 'Cursor', 'VS Code'];

export function passosDeUso(ferramenta, ativo) {
  if (ASSISTENTES.includes(ferramenta)) {
    return [
      `Conecte o Itaú House ao ${ferramenta}. É uma vez só, pelo conector MCP ou pela extensão.`,
      `Peça do seu jeito: "usa o ${ativo.titulo.toLowerCase()} do Itaú House".`,
      'O uso conta no perfil de quem criou. Se você adaptar, sua versão entra na árvore.',
    ];
  }
  if (ferramenta === 'Figma' || ferramenta === 'FigJam') {
    return [`Abra o plugin Itaú House no ${ferramenta}.`, `Busque por "${ativo.titulo}".`, 'Arraste pro seu arquivo. A origem fica registrada na página.'];
  }
  return [`Clique em Usar e escolha ${ferramenta}.`, 'A gente cria uma cópia na sua pasta, já com seu nome e sua squad.', 'Edite à vontade. A origem fica registrada no rodapé.'];
}
