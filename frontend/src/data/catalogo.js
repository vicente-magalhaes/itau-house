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

// Só entram os tipos que o hook reconhece na ferramenta de código (RF-03). Quem cria pode ter qualquer papel (D-18).
// Estantes agrupam os tipos no filtro do início. O ícone vem do tipo.
export const ESTANTES = {
  ia: { nome: 'Skills e prompts' },
  agente: { nome: 'Agentes e MCPs' },
  codigo: { nome: 'Código e frameworks' },
};

const ICONES_TIPO = {
  Skill: 'sparkles',
  Prompt: 'message-square-text',
  Agente: 'bot',
  MCP: 'cable',
  Framework: 'blocks',
  Componente: 'component',
  'Esqueleto de código': 'code-xml',
};

export function iconeTipo(tipo) {
  return ICONES_TIPO[tipo] || 'box';
}

export const VISIBILIDADES = [
  { value: 'banco', label: 'Banco inteiro', icone: 'globe', descricao: 'Qualquer pessoa do Itaú encontra e usa.' },
  { value: 'frente', label: 'Frente', icone: 'users', descricao: 'Só as squads da mesma frente.' },
  { value: 'squad', label: 'Squad', icone: 'lock', descricao: 'Só a squad que publicou.' },
];

// papeis = reaproveitamentos por papel, na ordem de PAPEIS. dentro e deriv = [nome, detalhe] e [pessoa, o que adaptou].
// acessos = [ícone, o que acessa]: declarado por quem publicou, mostrado antes de usar (RF-29).
const brutos = [
  { id: 'a1', titulo: 'Roteiro de discovery a partir do problema', tipo: 'Skill', estante: 'ia', autor: 'ana', resumo: 'Monta o roteiro de entrevista a partir do problema da squad, com perguntas abertas por etapa e dicas pra não induzir resposta.', formato: 'Skill para qualquer agente', ferr: ['Claude', 'Copilot', 'ChatGPT'], curtidas: 96, reusos: 58, adapt: 7, papeis: [24, 21, 4, 3, 6], atualizadoEm: '2026-09-23', versao: '2.1', aprovou: 'Letícia Moraes', tags: 'discovery pesquisa usuario entrevista roteiro',
    dentro: [['Instruções', 'Como transformar o problema em perguntas'], ['Banco de perguntas', '40 perguntas por etapa da jornada'], ['Formato de saída', 'Roteiro com campo pra anotar evidência']],
    acessos: [['file-text', 'Lê só o texto que você colar'], ['wifi-off', 'Sem acesso à rede'], ['database', 'Sem acesso a dados de cliente']],
    deriv: [['carla', 'Adaptou pra entrevistas com pessoas investidoras'], ['marina', 'Versão curta de 20 minutos pra Seguros'], ['joao', 'Base pra entrevistar áreas de negócio']] },
  { id: 'a2', titulo: 'Framework de teste de agente antes de publicar', tipo: 'Framework', estante: 'codigo', autor: 'leticia', resumo: 'Um jeito comum de testar um agente antes de mandar pra aprovação: casos de teste, critério de corte e registro de cada rodada.', formato: 'Casos de teste e guia', ferr: ['Claude', 'Copilot', 'Cursor'], curtidas: 88, reusos: 41, adapt: 5, papeis: [22, 5, 3, 4, 7], atualizadoEm: '2026-09-19', versao: '1.4', aprovou: 'Paula Rezende', tags: 'framework teste avaliacao agente qualidade',
    dentro: [['Casos de teste', '20 pedidos com a resposta esperada'], ['Critério de corte', 'O que precisa acertar pra seguir'], ['Registro', 'Resultado de cada rodada, com data']],
    acessos: [['folder', 'Escreve o registro na pasta do projeto'], ['wifi-off', 'Sem acesso à rede'], ['database', 'Sem acesso a dados de cliente']],
    deriv: [['marcos', 'Somou o custo de cada rodada de teste'], ['ana', 'Usou pra testar a skill de critérios']] },
  { id: 'a3', titulo: 'Componentes de onboarding no design system', tipo: 'Componente', estante: 'codigo', autor: 'rafaela', resumo: 'Abertura de conta em componentes prontos, com estados de erro, carregamento e acessibilidade anotada.', formato: '18 componentes React', ferr: ['Claude', 'Copilot', 'Figma'], curtidas: 74, reusos: 33, adapt: 4, papeis: [6, 20, 5, 0, 2], atualizadoEm: '2026-09-21', versao: '3.0', aprovou: 'Letícia Moraes', tags: 'componentes design system onboarding acessibilidade telas figma',
    dentro: [['Componentes', '18 telas em componentes do design system'], ['Estados', 'Erro, vazio, carregando e sucesso'], ['Acessibilidade', 'Ordem de leitura e contraste anotados']],
    acessos: [['folder', 'Escreve os componentes na pasta do projeto'], ['wifi-off', 'Sem acesso à rede']],
    deriv: [['pedro', 'Separou em componentes menores'], ['thiago', 'Ligou ao fluxo do app de Pix']] },
  { id: 'a4', titulo: 'Critérios de aceitação a partir da história', tipo: 'Skill', estante: 'ia', autor: 'ana', resumo: 'Lê a história e devolve critérios no padrão dado, quando, então, já com o caso incompleto.', formato: 'Skill para qualquer agente', ferr: ['Claude', 'Copilot', 'ChatGPT', 'Gemini'], curtidas: 71, reusos: 64, adapt: 6, papeis: [18, 2, 38, 3, 3], atualizadoEm: '2026-09-24', versao: '1.2', aprovou: 'Rafael Costa', tags: 'criterios aceitacao historia casos teste refinamento',
    dentro: [['Instruções', 'Como ler a história e montar os critérios'], ['Exemplos', '5 histórias anonimizadas'], ['Checklist', 'O que revisar antes de colar no card']],
    acessos: [['file-text', 'Lê só a história que você indicar'], ['wifi-off', 'Sem acesso à rede'], ['database', 'Sem acesso a dados de cliente']],
    deriv: [['thiago', 'Adaptou pra gerar casos de teste'], ['joao', 'Versão pra histórias de processo interno'], ['bruno', 'Ligou ao revisor de PR']] },
  { id: 'a5', titulo: 'Prompt de síntese de pesquisa com usuários', tipo: 'Prompt', estante: 'ia', autor: 'carla', resumo: 'Agrupa trechos de entrevista em temas, separa evidência de opinião e marca o que precisa de mais dado.', formato: 'Prompt para qualquer assistente', ferr: ['ChatGPT', 'Claude', 'Gemini', 'Copilot'], curtidas: 65, reusos: 47, adapt: 5, papeis: [19, 22, 1, 4, 1], atualizadoEm: '2026-09-22', versao: '1.1', aprovou: 'Marcos Leal', tags: 'sintese pesquisa usuario entrevista',
    dentro: [['Prompt principal', 'Síntese por temas'], ['Prompt de checagem', 'Aponta conclusões sem evidência'], ['Formato de saída', 'Tabela tema, evidência e força']],
    acessos: [['file-text', 'Lê só os trechos que você colar'], ['wifi-off', 'Sem acesso à rede'], ['database', 'Sem acesso a dados de cliente']],
    deriv: [['ana', 'Usa depois do roteiro de discovery'], ['aline', 'Adaptou pra respostas abertas de NPS']] },
  { id: 'a6', titulo: 'Prompt de priorização RICE com risco regulatório', tipo: 'Prompt', estante: 'ia', autor: 'marina', resumo: 'O RICE de sempre, com peso pra risco regulatório. O assistente pontua cada item e separa o que depende de compliance.', formato: 'Prompt para qualquer assistente', ferr: ['ChatGPT', 'Claude', 'Copilot', 'Gemini'], curtidas: 58, reusos: 36, adapt: 3, papeis: [21, 4, 5, 2, 4], atualizadoEm: '2026-09-12', versao: '1.0', aprovou: 'Paula Rezende', tags: 'prompt priorizacao rice roadmap risco regulatorio',
    dentro: [['Prompt principal', 'Pontua alcance, impacto, confiança e esforço'], ['Pergunta de corte', 'Separa o que depende de compliance'], ['Formato de saída', 'Tabela pronta pra colar na planilha']],
    acessos: [['file-text', 'Lê só a lista que você colar'], ['wifi-off', 'Sem acesso à rede']],
    deriv: [['leticia', 'Adotou no planejamento trimestral da frente'], ['marcos', 'Somou o custo estimado de IA']] },
  { id: 'a7', titulo: 'Revisor de PR com as regras da frente', tipo: 'Agente', estante: 'agente', autor: 'bruno', resumo: 'Revisa o pull request contra o guia de código da frente e cita o trecho do guia em cada comentário.', formato: 'Agente com conector MCP', ferr: ['Copilot', 'Claude', 'Cursor', 'Gemini'], curtidas: 57, reusos: 31, adapt: 2, papeis: [0, 1, 29, 1, 0], atualizadoEm: '2026-09-19', versao: '2.0', aprovou: 'Letícia Moraes', tags: 'revisor pr codigo revisao',
    dentro: [['Instruções', 'Como comparar o diff com o guia'], ['Guia da frente', 'Troque pelo guia da sua frente'], ['Conector MCP', 'Lê o pull request e publica os comentários']],
    acessos: [['git-pull-request', 'Lê o diff do pull request'], ['message-square', 'Escreve comentários no PR, nunca aprova'], ['wifi-off', 'Sem acesso à rede externa']],
    deriv: [['camila', 'Trocou o guia pelo da Plataforma'], ['rodrigo', 'Somou regras de arquitetura']] },
  { id: 'a8', titulo: 'Skill de relatório de teste de usabilidade', tipo: 'Skill', estante: 'ia', autor: 'luiza', resumo: 'Transforma as anotações do teste em relatório de uma página, com achados, severidade e a evidência de cada um.', formato: 'Skill para qualquer agente', ferr: ['Claude', 'Copilot', 'ChatGPT'], curtidas: 49, reusos: 22, adapt: 2, papeis: [7, 13, 1, 0, 1], atualizadoEm: '2026-09-20', versao: '1.3', aprovou: 'Rafael Costa', tags: 'usabilidade teste pesquisa relatorio',
    dentro: [['Instruções', 'Como agrupar os achados por tarefa'], ['Escala de severidade', 'De cosmético a impeditivo'], ['Formato de saída', 'Uma página com achados e evidência']],
    acessos: [['file-text', 'Lê só as anotações que você colar'], ['wifi-off', 'Sem acesso à rede']],
    deriv: [['carla', 'Versão pra testes com pessoas investidoras']] },
  { id: 'a9', titulo: 'Esqueleto de endpoint com trilha de auditoria', tipo: 'Esqueleto de código', estante: 'codigo', autor: 'camila', resumo: 'Rota, validação, log de auditoria e teste já ligados. O time só escreve a regra de negócio.', formato: 'Repositório Python', ferr: ['Cursor', 'Copilot', 'Claude', 'VS Code'], curtidas: 62, reusos: 47, adapt: 6, papeis: [0, 0, 45, 2, 0], atualizadoEm: '2026-09-05', versao: '3.1', aprovou: 'Rodrigo Pinto', tags: 'esqueleto endpoint api auditoria backend',
    dentro: [['Rota e schema', 'Entrada validada'], ['Auditoria', 'Log de quem fez o quê'], ['Testes', 'Caso feliz e caso incompleto']],
    acessos: [['folder', 'Escreve a rota e os testes na pasta do projeto'], ['wifi-off', 'Sem acesso à rede']],
    deriv: [['thiago', 'Versão pra endpoints de Pix'], ['juliana', 'Somou gerador de massa nos testes']] },
  { id: 'a10', titulo: 'Gerador de massa de teste sintética', tipo: 'Skill', estante: 'ia', autor: 'juliana', resumo: 'Cria CPF, conta e cartão sintéticos com dígito verificador válido. Nenhum dado real.', formato: 'Skill para qualquer agente', ferr: ['Claude', 'Copilot', 'ChatGPT'], curtidas: 54, reusos: 38, adapt: 4, papeis: [3, 1, 26, 8, 0], atualizadoEm: '2026-09-19', versao: '2.3', aprovou: 'Aline Souza', tags: 'massa teste sintetica dados',
    dentro: [['Instruções', 'Formatos e regras de dígito'], ['Exemplos', 'CPF, conta, cartão e chave Pix'], ['Testes', 'Confere o dígito de cada item gerado']],
    acessos: [['folder', 'Escreve arquivos de teste'], ['shield-check', 'Nunca lê base real: gera tudo do zero'], ['wifi-off', 'Sem acesso à rede']],
    deriv: [['thiago', 'Massa específica pra Pix']] },
  { id: 'a11', titulo: 'Skill de one-pager pro comitê de investimento', tipo: 'Skill', estante: 'ia', autor: 'marcos', resumo: 'A partir das suas notas, monta a página do comitê com problema, custo, retorno esperado e riscos, no formato que o comitê pediu.', formato: 'Skill para qualquer agente', ferr: ['Copilot', 'Claude', 'ChatGPT'], curtidas: 44, reusos: 29, adapt: 3, papeis: [12, 1, 2, 2, 12], atualizadoEm: '2026-09-22', versao: '1.0', aprovou: 'Paula Rezende', tags: 'one-pager comite investimento custo documento',
    dentro: [['Instruções', 'Como ler as notas e preencher cada bloco'], ['Exemplo preenchido', 'Caso fictício de Seguros'], ['Checklist do comitê', 'O que costuma ser perguntado']],
    acessos: [['file-text', 'Lê só as notas que você indicar'], ['wifi-off', 'Sem acesso à rede'], ['database', 'Sem acesso a dados de cliente']],
    deriv: [['leticia', 'Versão pra pedido de headcount'], ['marina', 'Usou na aposta de Seguros · Vida']] },
  { id: 'a12', titulo: 'MCP do dicionário de dados da squad', tipo: 'MCP', estante: 'agente', autor: 'aline', resumo: 'Deixa o agente consultar o dicionário de dados e responder o que cada campo significa, sem ler nenhuma linha da base.', formato: 'Conector MCP', ferr: ['Claude', 'Copilot', 'Cursor'], curtidas: 39, reusos: 18, adapt: 2, papeis: [8, 1, 3, 5, 1], atualizadoEm: '2026-09-12', versao: '1.2', aprovou: 'Aline Souza', tags: 'mcp dicionario dados metadados conector',
    dentro: [['Ferramentas', 'Buscar campo, listar tabela e ver o dono'], ['Configuração', 'Aponte pro dicionário da sua squad'], ['Exemplos de pergunta', '10 perguntas que ele responde bem']],
    acessos: [['globe', 'Acessa só o dicionário de dados, na rede interna'], ['key', 'Usa a credencial de quem está usando'], ['database', 'Lê metadados, nunca dado de cliente']],
    deriv: [['juliana', 'Somou as regras de qualidade de cada campo']] },
  { id: 'a13', titulo: 'Prompt de retrospectiva com síntese por IA', tipo: 'Prompt', estante: 'ia', autor: 'joao', resumo: 'Retro em 45 minutos: o time escreve, a IA agrupa em temas e o time decide. Com roteiro pra quem facilita.', formato: 'Prompt e roteiro', ferr: ['Copilot', 'Claude', 'ChatGPT'], curtidas: 47, reusos: 26, adapt: 3, papeis: [8, 5, 9, 2, 2], atualizadoEm: '2026-09-21', versao: '1.1', aprovou: 'Paula Rezende', tags: 'retrospectiva ritual agil time',
    dentro: [['Prompt de agrupamento', 'Temas e ações'], ['Roteiro de facilitação', 'Tempo de cada bloco'], ['Formato de saída', 'Ações com dono e prazo']],
    acessos: [['file-text', 'Lê só as notas que o time colar'], ['wifi-off', 'Sem acesso à rede']],
    deriv: [['bruno', 'Versão pra retro de incidente']] },
  { id: 'a14', titulo: 'Agente de acessibilidade para telas', tipo: 'Agente', estante: 'agente', autor: 'pedro', resumo: 'Revisa o frame no Figma e aponta contraste, ordem de leitura e alvo de toque abaixo do mínimo.', formato: 'Plugin do Figma e conector MCP', ferr: ['Figma', 'Claude', 'Copilot'], curtidas: 52, reusos: 24, adapt: 2, papeis: [2, 15, 6, 0, 1], atualizadoEm: '2026-09-19', versao: '0.9', aprovou: 'Letícia Moraes', tags: 'acessibilidade checklist figma telas contraste',
    dentro: [['Regras', 'Contraste, alvo de toque e leitura'], ['Relatório', 'Lista por frame com sugestão'], ['Conector MCP', 'Lê o frame aberto no Figma']],
    acessos: [['file-search', 'Lê só o frame aberto'], ['message-square', 'Deixa comentários no arquivo, nunca edita'], ['wifi-off', 'Sem acesso à rede externa']],
    deriv: [['rafaela', 'Rodou nos componentes de onboarding'], ['luiza', 'Somou regras de conteúdo']] },
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
    acessos: a.acessos.map(([icone, titulo]) => ({ icone, titulo })),
    deriv: a.deriv.map(([id, texto]) => ({ pessoa: pessoas[id], texto })),
  };
});

export function acharAtivo(id) {
  return ativos.find((a) => a.id === id);
}

// Pedidos: o que alguém procurou e não achou. criador = quem já assumiu fazer.
export const pedidos = [
  { id: 'p1', titulo: 'Agente que explica uma query SQL em português', tipo: 'Agente', estante: 'agente', autor: 'joao', querem: 15, criador: 'aline' },
  { id: 'p2', titulo: 'Skill que transforma ata de reunião em tarefas', tipo: 'Skill', estante: 'ia', autor: 'leticia', querem: 12, criador: 'thiago' },
  { id: 'p3', titulo: 'Framework pra estimar o custo de IA por squad', tipo: 'Framework', estante: 'codigo', autor: 'marcos', querem: 9 },
  { id: 'p4', titulo: 'Skill que resume o resultado de um teste A/B', tipo: 'Skill', estante: 'ia', autor: 'marina', querem: 7 },
  { id: 'p5', titulo: 'Agente que revisa a acessibilidade de e-mails', tipo: 'Agente', estante: 'agente', autor: 'luiza', querem: 5 },
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
  { value: 'curtidos', label: 'Mais curtidos' },
  { value: 'reaproveitados', label: 'Mais reaproveitados' },
  { value: 'adaptados', label: 'Mais adaptados' },
  { value: 'novos', label: 'Novos' },
];

export function ordenar(lista, ordem, curtidasDe, reusosDe) {
  const copia = lista.slice();
  if (ordem === 'novos') return copia.sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm));
  if (ordem === 'curtidos') return copia.sort((a, b) => curtidasDe(b) - curtidasDe(a));
  if (ordem === 'reaproveitados') return copia.sort((a, b) => reusosDe(b) - reusosDe(a));
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
