-- Dados fictícios de demonstração. Nada aqui é dado real (regulamento 3.8).
-- Nomes de pessoas, squads e ativos são inventados.
--
-- GERADO por supabase/gerar_seed_sql.py a partir de backend/app/dados/seed.json. Não editar à mão.
-- Aplicar na nuvem junto com as migrações: supabase db push --include-seed
-- Idempotente: rodar de novo atualiza as linhas do seed, sem duplicar.

insert into squads (id, nome, frente) values
  ('s-pix-cobrancas', 'Pix · Cobranças', 'Pix'),
  ('s-pix-recebimentos', 'Pix · Recebimentos', 'Pix'),
  ('s-cartoes-fatura', 'Cartões · Fatura', 'Cartões'),
  ('s-cartoes-emissao', 'Cartões · Emissão', 'Cartões'),
  ('s-canais-app', 'Canais digitais · App', 'Canais digitais'),
  ('s-plataforma-core', 'Plataforma · Core', 'Plataforma'),
  ('s-seguros-vida', 'Seguros · Vida', 'Seguros'),
  ('s-dados-qualidade', 'Dados e analytics · Qualidade', 'Dados e analytics'),
  ('s-invest-renda-fixa', 'Investimentos · Renda fixa', 'Investimentos')
on conflict (id) do update set nome = excluded.nome, frente = excluded.frente;

insert into usuarios (id, nome, iniciais, papel, cargo, squad_id, perfil, foto_url) values
  ('u-rafael', 'Rafael Nunes', 'RN', 'dev', 'Dev pleno', 's-pix-cobrancas', 'cord_menos', null),
  ('u-juliana', 'Juliana Prado', 'JP', 'coordenacao', 'Coordenadora', 's-pix-cobrancas', 'cord_mais', null),
  ('u-thiago', 'Thiago Moreira', 'TM', 'dev', 'Dev sênior', 's-pix-recebimentos', 'cord_menos', null),
  ('u-marcos', 'Marcos Leal', 'ML', 'coordenacao', 'Coordenador', 's-pix-recebimentos', 'cord_mais', null),
  ('u-marina', 'Marina Alves', 'MA', 'produto', 'PM', 's-cartoes-fatura', 'cord_menos', null),
  ('u-otavio', 'Otávio Reis', 'OR', 'dev', 'QA', 's-cartoes-fatura', 'cord_menos', null),
  ('u-renato', 'Renato Lima', 'RL', 'coordenacao', 'Coordenador', 's-cartoes-fatura', 'cord_mais', null),
  ('u-ana', 'Ana Ribeiro', 'AR', 'dev', 'Dev front', 's-cartoes-emissao', 'cord_menos', null),
  ('u-sergio', 'Sérgio Antunes', 'SA', 'coordenacao', 'Coordenador', 's-cartoes-emissao', 'cord_mais', null),
  ('u-felipe', 'Felipe Tanaka', 'FT', 'dev', 'Tech lead', 's-canais-app', 'cord_menos', null),
  ('u-julia', 'Júlia Ramos', 'JR', 'produto', 'PM', 's-canais-app', 'cord_menos', null),
  ('u-leticia', 'Letícia Moraes', 'LM', 'coordenacao', 'Coordenadora', 's-canais-app', 'cord_mais', null),
  ('u-camila', 'Camila Duarte', 'CD', 'dev', 'Dev sênior', 's-plataforma-core', 'cord_menos', null),
  ('u-rodrigo', 'Rodrigo Pinto', 'RP', 'coordenacao', 'Arquiteto e coordenador', 's-plataforma-core', 'cord_mais', null),
  ('u-patricia', 'Patrícia Rezende', 'PR', 'design', 'Designer', 's-seguros-vida', 'cord_menos', null),
  ('u-helena', 'Helena Castro', 'HC', 'coordenacao', 'Coordenadora', 's-seguros-vida', 'cord_mais', null),
  ('u-aline', 'Aline Souza', 'AS', 'dados', 'Cientista de dados', 's-dados-qualidade', 'cord_menos', null),
  ('u-gustavo', 'Gustavo Ferraz', 'GF', 'coordenacao', 'Coordenador', 's-dados-qualidade', 'cord_mais', null),
  ('u-lucas', 'Lucas Almeida', 'LA', 'risco', 'Analista de risco', 's-invest-renda-fixa', 'cord_menos', null),
  ('u-denise', 'Denise Rocha', 'DR', 'coordenacao', 'Coordenadora', 's-invest-renda-fixa', 'cord_mais', null)
on conflict (id) do update set nome = excluded.nome, iniciais = excluded.iniciais, papel = excluded.papel, cargo = excluded.cargo, squad_id = excluded.squad_id, perfil = excluded.perfil, foto_url = excluded.foto_url;

insert into ativos (id, nome, tipo, resumo, readme, arquivos, manual_instalacao, autor_id, squad_id, visibilidade, status, derivado_de, aprovado_por, tags, ferramentas, versao, acessos, curtidas_base, instalacoes_base, derivacoes_base, squads_reuso_base, enviado_em, publicado_em, atualizado_em) values
  ('a-criterios-aceitacao', 'Demanda em critérios de aceitação', 'skill', 'Transforma a demanda em critérios de aceitação no formato Dado/Quando/Então, com o caso incompleto e as perguntas para o refinamento.', '## O que faz
Recebe uma demanda e devolve critérios de aceitação testáveis, no formato Dado/Quando/Então.
Sempre inclui o caso incompleto e uma lista de perguntas para o refinamento.

## Quando usar
No refinamento, antes de a história ir para desenvolvimento.

## Limites
Não gera casos de teste. Não conhece as regras do seu domínio: revise antes de colar no card.', '[{"caminho": "SKILL.md", "conteudo": "---\nname: demanda-em-criterios-de-aceitacao\ndescription: Transforma a descrição de uma demanda em critérios de aceitação no formato Dado/Quando/Então.\n---\n# Demanda em critérios de aceitação\n\nQuando a pessoa colar uma demanda (história, pedido de negócio ou ticket):\n\n1. Resuma em uma frase o objetivo da demanda.\n2. Liste as regras de negócio explícitas. Marque como \"a confirmar\" o que estiver implícito.\n3. Escreva de 3 a 7 critérios no formato:\n   - **Dado** <contexto>\n   - **Quando** <ação>\n   - **Então** <resultado observável>\n4. Inclua sempre um critério para o caso incompleto: o que acontece quando falta informação.\n5. Termine com \"Perguntas para o refinamento\": o que o texto não responde.\n\n## Não faça\n- Não invente regra de negócio.\n- Não escreva casos de teste nem código.\n"}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-marina', 's-cartoes-fatura', 'banco', 'publicado', null, 'u-renato', array['qualidade', 'refinamento', 'produto']::text[], array['Claude Code', 'Copilot']::text[], '1.2.0', '[{"icone": "file-text", "titulo": "Lê o texto que você colar", "detalhe": "Não busca nada sozinho."}, {"icone": "globe", "titulo": "Sem acesso à rede", "detalhe": "Não faz chamadas externas."}]'::jsonb, 23, 40, 0, array['Canais digitais · App', 'Seguros · Vida', 'Dados e analytics · Qualidade', 'Investimentos · Renda fixa']::text[], '2026-08-14T09:20:00-03:00', '2026-08-14T10:00:00-03:00', '2026-09-22T09:30:00-03:00'),
  ('a-criterios-fatura', 'Critérios de aceitação para histórias de fatura', 'skill', 'Escreve critérios de aceitação e casos de teste para histórias de fatura do cartão, com as regras de fechamento e vencimento da squad.', '## O que faz
Critérios de aceitação e casos de teste para histórias de fatura.

## Limites
Usa as regras internas de fechamento da squad. Por isso fica só na squad.', '[{"caminho": "SKILL.md", "conteudo": "---\nname: criterios-fatura\ndescription: Critérios de aceitação e casos de teste para histórias de fatura.\n---\n# Critérios para fatura\nUse as regras de fechamento e vencimento da squad Cartões · Fatura.\n"}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-otavio', 's-cartoes-fatura', 'squad', 'publicado', null, 'u-renato', array['qualidade', 'teste', 'fatura']::text[], array['Claude Code']::text[], '1.0.0', '[{"icone": "file-text", "titulo": "Lê o texto que você colar", "detalhe": "Não busca nada sozinho."}, {"icone": "globe", "titulo": "Sem acesso à rede", "detalhe": "Não faz chamadas externas."}]'::jsonb, 4, 6, 0, '{}'::text[], '2026-09-05T09:20:00-03:00', '2026-09-05T10:00:00-03:00', '2026-09-05T10:00:00-03:00'),
  ('a-revisor-pr', 'Revisor de PR com as regras da frente', 'agente', 'Revisa o pull request contra o guia de código da frente e cita o trecho do guia que sustenta cada comentário.', '## O que faz
Lê o diff e compara com o guia de código da frente. Cada comentário cita o item do guia.

## Limites
Não aprova nem bloqueia o PR. A decisão continua com quem revisa.', '[{"caminho": "agente.md", "conteudo": "---\nname: revisor-pr\ndescription: Revisa PR contra o guia de código da frente.\n---\n# Revisor de PR\nPara cada comentário, cite o item do guia que o sustenta.\n"}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-felipe', 's-canais-app', 'banco', 'publicado', null, 'u-leticia', array['revisão', 'padrão de código', 'pr']::text[], array['Agnóstico']::text[], '2.0.1', '[{"icone": "git-pull-request", "titulo": "Lê o diff do pull request", "detalhe": "Só leitura. Não aprova nem faz merge."}, {"icone": "message-square", "titulo": "Escreve comentários no PR", "detalhe": "Comentário simples, nunca aprovação."}]'::jsonb, 57, 31, 2, array['Plataforma · Core', 'Pix · Recebimentos', 'Seguros · Vida']::text[], '2026-06-02T09:20:00-03:00', '2026-06-02T10:00:00-03:00', '2026-09-19T10:00:00-03:00'),
  ('a-esqueleto-fastapi', 'Esqueleto de endpoint FastAPI com trilha de auditoria', 'esqueleto', 'Rota, validação, log de auditoria e teste já ligados. O time só escreve a regra de negócio.', '## O que faz
Gera a estrutura de um endpoint novo: rota, schema de entrada, log de auditoria e teste.

## Limites
Não decide o contrato da API. O time define entrada e saída.', '[{"caminho": "SKILL.md", "conteudo": "---\nname: esqueleto-fastapi\ndescription: Gera endpoint FastAPI com auditoria e teste.\n---\n# Esqueleto FastAPI\nCrie rota, schema, log de auditoria e teste.\n"}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-camila', 's-plataforma-core', 'banco', 'publicado', null, 'u-rodrigo', array['backend', 'fastapi', 'auditoria']::text[], array['Agnóstico']::text[], '3.1.0', '[{"icone": "folder", "titulo": "Escreve arquivos na pasta do projeto", "detalhe": ""}, {"icone": "globe", "titulo": "Sem acesso à rede", "detalhe": "Não faz chamadas externas."}]'::jsonb, 88, 47, 6, array['Pix · Recebimentos', 'Cartões · Emissão', 'Investimentos · Renda fixa', 'Seguros · Vida']::text[], '2026-04-10T09:20:00-03:00', '2026-04-10T10:00:00-03:00', '2026-09-24T10:00:00-03:00'),
  ('a-feature-flag', 'Framework de feature flag por squad', 'framework', 'Padrão de feature flag com dono, prazo de validade e lista de remoção das flags vencidas.', '## O que faz
Padroniza feature flags com dono e validade. Flag vencida entra na lista de remoção.', '[{"caminho": "README.md", "conteudo": "# Feature flag por squad\nToda flag tem dono e data de validade."}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-camila', 's-plataforma-core', 'banco', 'publicado', null, 'u-rodrigo', array['backend', 'release', 'governança']::text[], array['Agnóstico']::text[], '1.4.2', '[{"icone": "folder", "titulo": "Escreve arquivos na pasta do projeto", "detalhe": ""}]'::jsonb, 29, 26, 2, array['Canais digitais · App', 'Cartões · Emissão']::text[], '2026-03-19T09:20:00-03:00', '2026-03-19T10:00:00-03:00', '2026-08-30T10:00:00-03:00'),
  ('a-mcp-catalogo-apis', 'MCP do catálogo de APIs internas', 'mcp', 'Deixa o agente consultar o catálogo de APIs internas e responder qual serviço já expõe o dado antes de construir.', '## O que faz
Expõe o catálogo de APIs para o agente.

## Limites
Só metadados: nome, dono e contrato. Não chama a API nem lê dado de cliente. [SIMULADO]', '[{"caminho": "README.md", "conteudo": "# MCP do catálogo de APIs\nFerramenta: buscar_api(dado)."}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-rodrigo', 's-plataforma-core', 'banco', 'publicado', null, 'u-rodrigo', array['mcp', 'apis', 'descoberta']::text[], array['Claude Code', 'Copilot']::text[], '0.9.2', '[{"icone": "key", "titulo": "Usa a credencial do próprio usuário", "detalhe": "Nenhum segredo dentro do ativo."}, {"icone": "database", "titulo": "Lê metadados de serviços", "detalhe": "Nunca dado de cliente."}]'::jsonb, 35, 22, 0, array['Cartões · Emissão', 'Pix · Recebimentos']::text[], '2026-09-01T09:20:00-03:00', '2026-09-01T10:00:00-03:00', '2026-09-25T10:00:00-03:00'),
  ('a-resumo-incidente', 'Resumo de incidente para o pós-morte', 'skill', 'Junta linha do tempo, impacto e ações do incidente num rascunho de pós-morte para o time revisar.', '## O que faz
Monta o rascunho do pós-morte a partir da linha do tempo que você colar.

## Limites
Não atribui culpa nem define causa raiz sozinho.', '[{"caminho": "SKILL.md", "conteudo": "---\nname: resumo-incidente\ndescription: Rascunho de pós-morte a partir da linha do tempo do incidente.\n---\n# Resumo de incidente\nSeções: linha do tempo, impacto, ações, perguntas em aberto.\n"}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-thiago', 's-pix-recebimentos', 'frente', 'publicado', null, 'u-marcos', array['incidente', 'operação', 'documentação']::text[], array['Claude Code', 'Copilot']::text[], '1.0.0', '[{"icone": "file-text", "titulo": "Lê o texto que você colar", "detalhe": "Não busca nada sozinho."}, {"icone": "globe", "titulo": "Sem acesso à rede", "detalhe": "Não faz chamadas externas."}]'::jsonb, 18, 4, 1, '{}'::text[], '2026-09-13T09:20:00-03:00', '2026-09-13T10:00:00-03:00', '2026-09-13T10:00:00-03:00'),
  ('a-conciliacao-extrato', 'Agente de conciliação de extrato', 'agente', 'Compara o extrato do parceiro com o registro interno e lista as diferenças para a pessoa analisar.', '## O que faz
Compara dois extratos e lista as diferenças. Não corrige nada sozinho.

## Limites
Só na squad enquanto o formato do parceiro não estabiliza.', '[{"caminho": "agente.md", "conteudo": "---\nname: conciliacao-extrato\ndescription: Compara extratos e lista diferenças.\n---\n# Conciliação\nListe diferenças. Nunca corrija.\n"}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-thiago', 's-pix-recebimentos', 'squad', 'publicado', null, 'u-marcos', array['conciliação', 'operação']::text[], array['Claude Code']::text[], '0.4.0', '[{"icone": "file-text", "titulo": "Lê o texto que você colar", "detalhe": "Não busca nada sozinho."}, {"icone": "globe", "titulo": "Sem acesso à rede", "detalhe": "Não faz chamadas externas."}]'::jsonb, 3, 1, 0, '{}'::text[], '2026-09-23T09:20:00-03:00', '2026-09-23T10:00:00-03:00', '2026-09-23T10:00:00-03:00'),
  ('a-insights-pesquisa', 'Resgate de insights da plataforma de pesquisa', 'skill', 'Busca nos relatórios de pesquisa com cliente o que já se sabe sobre um tema e devolve os achados com a fonte de cada um.', '## O que faz
Dado um tema, lista o que as pesquisas anteriores já disseram, com o relatório e a data de cada achado.

## Limites
Só resume. Não tira conclusão nova sem a fonte.', '[{"caminho": "SKILL.md", "conteudo": "---\nname: insights-pesquisa\ndescription: Resgata achados de pesquisas anteriores com a fonte.\n---\n# Insights de pesquisa\nCada achado vem com relatório e data.\n"}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-patricia', 's-seguros-vida', 'banco', 'publicado', null, 'u-helena', array['pesquisa', 'design', 'discovery']::text[], array['Claude Code', 'Copilot']::text[], '1.0.0', '[{"icone": "file-text", "titulo": "Lê o texto que você colar", "detalhe": "Não busca nada sozinho."}, {"icone": "globe", "titulo": "Sem acesso à rede", "detalhe": "Não faz chamadas externas."}]'::jsonb, 31, 19, 1, array['Canais digitais · App', 'Cartões · Fatura']::text[], '2026-07-08T09:20:00-03:00', '2026-07-08T10:00:00-03:00', '2026-09-02T10:00:00-03:00'),
  ('a-roteiro-usabilidade', 'Roteiro de teste de usabilidade moderado', 'skill', 'Monta o roteiro do teste moderado a partir do protótipo e das hipóteses: tarefas, perguntas e o que observar.', '## O que faz
Transforma hipóteses e telas em roteiro de teste: tarefas, perguntas neutras e sinais a observar.', '[{"caminho": "SKILL.md", "conteudo": "---\nname: roteiro-usabilidade\ndescription: Roteiro de teste de usabilidade moderado.\n---\n# Roteiro de usabilidade\nPerguntas neutras. Uma tarefa por hipótese.\n"}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-patricia', 's-seguros-vida', 'banco', 'publicado', null, 'u-helena', array['design', 'usabilidade', 'pesquisa']::text[], array['Claude Code', 'Copilot']::text[], '1.0.0', '[{"icone": "file-text", "titulo": "Lê o texto que você colar", "detalhe": "Não busca nada sozinho."}, {"icone": "globe", "titulo": "Sem acesso à rede", "detalhe": "Não faz chamadas externas."}]'::jsonb, 16, 12, 0, '{}'::text[], '2026-08-21T09:20:00-03:00', '2026-08-21T10:00:00-03:00', '2026-08-21T10:00:00-03:00'),
  ('a-ata-notebook', 'Ata de reunião para o notebook do time', 'skill', 'Transforma a transcrição da reunião em ata com decisões, responsáveis e prazos, no formato que o notebook do time lê.', '## O que faz
Da transcrição para ata: decisões, quem faz, até quando e o que ficou em aberto.

## Limites
Não registra o que não foi dito. Revise os nomes antes de salvar.', '[{"caminho": "SKILL.md", "conteudo": "---\nname: ata-notebook\ndescription: Ata com decisões, responsáveis e prazos.\n---\n# Ata\nSeções: decisões, responsáveis, prazos, em aberto.\n"}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-julia', 's-canais-app', 'banco', 'publicado', null, 'u-leticia', array['produto', 'documentação', 'reunião']::text[], array['Claude Code', 'Copilot']::text[], '1.0.0', '[{"icone": "file-text", "titulo": "Lê o texto que você colar", "detalhe": "Não busca nada sozinho."}, {"icone": "globe", "titulo": "Sem acesso à rede", "detalhe": "Não faz chamadas externas."}]'::jsonb, 38, 29, 2, array['Seguros · Vida', 'Plataforma · Core', 'Pix · Recebimentos']::text[], '2026-05-30T09:20:00-03:00', '2026-05-30T10:00:00-03:00', '2026-09-10T10:00:00-03:00'),
  ('a-kb-alucinacao', 'Bateria de perguntas contra alucinação da base de conhecimento', 'agente', 'Gera perguntas e respostas esperadas a partir da base de conhecimento do produto e aponta onde a IA respondeu fora dela.', '## O que faz
Monta a bateria de perguntas a partir da base de conhecimento e compara as respostas da IA com a fonte.

## Limites
Marca suspeitas. Quem decide se é alucinação é a pessoa.', '[{"caminho": "agente.md", "conteudo": "---\nname: kb-alucinacao\ndescription: Perguntas e respostas esperadas para testar a base de conhecimento.\n---\n# Bateria contra alucinação\nToda resposta esperada cita o trecho da base.\n"}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-aline', 's-dados-qualidade', 'banco', 'publicado', null, 'u-gustavo', array['ia', 'qualidade', 'base de conhecimento']::text[], array['Claude Code', 'Copilot']::text[], '1.1.0', '[{"icone": "file-text", "titulo": "Lê o texto que você colar", "detalhe": "Não busca nada sozinho."}, {"icone": "globe", "titulo": "Sem acesso à rede", "detalhe": "Não faz chamadas externas."}]'::jsonb, 44, 21, 3, array['Canais digitais · App', 'Seguros · Vida']::text[], '2026-06-25T09:20:00-03:00', '2026-06-25T10:00:00-03:00', '2026-09-18T10:00:00-03:00'),
  ('a-grau-mudanca', 'Checklist de grau de mudança antes da subida', 'skill', 'Lê a descrição da mudança e sugere o grau e os gates que se aplicam (compliance, risco, fraude), com o porquê de cada um.', '## O que faz
Sugere o grau da mudança e os gates, explicando cada escolha.

## Limites
Sugestão. O grau oficial continua com a gestão de mudança.', '[{"caminho": "SKILL.md", "conteudo": "---\nname: grau-mudanca\ndescription: Sugere grau e gates da mudança.\n---\n# Grau de mudança\nPara cada gate, diga por que se aplica.\n"}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-lucas', 's-invest-renda-fixa', 'banco', 'publicado', null, 'u-denise', array['risco', 'governança', 'release']::text[], array['Claude Code', 'Copilot']::text[], '1.0.0', '[{"icone": "file-text", "titulo": "Lê o texto que você colar", "detalhe": "Não busca nada sozinho."}, {"icone": "globe", "titulo": "Sem acesso à rede", "detalhe": "Não faz chamadas externas."}]'::jsonb, 27, 33, 2, array['Pix · Recebimentos', 'Cartões · Emissão', 'Plataforma · Core']::text[], '2026-07-15T09:20:00-03:00', '2026-07-15T10:00:00-03:00', '2026-09-15T10:00:00-03:00'),
  ('a-botao-contratacao', 'Botão de contratação com rota e tracking', 'componente', 'Botão do design system já ligado à rota de contratação e ao evento de tracking padrão da frente.', '## O que faz
Entrega o botão com a rota de contratação e o evento de tracking da frente Cartões.', '[{"caminho": "README.md", "conteudo": "# Botão de contratação\nProps: produto, origem."}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-ana', 's-cartoes-emissao', 'frente', 'publicado', null, 'u-sergio', array['front', 'design system', 'tracking']::text[], array['Agnóstico']::text[], '1.0.4', '[{"icone": "folder", "titulo": "Escreve arquivos na pasta do projeto", "detalhe": ""}]'::jsonb, 12, 9, 1, '{}'::text[], '2026-07-21T09:20:00-03:00', '2026-07-21T10:00:00-03:00', '2026-09-11T10:00:00-03:00'),
  ('a-tela-consulta', 'Esqueleto de tela de consulta com filtros', 'esqueleto', 'Tela de lista com busca, filtros, paginação e estado vazio, já no design system.', '## O que faz
Gera a tela de lista completa: busca, filtros, paginação e estado vazio.', '[{"caminho": "README.md", "conteudo": "# Tela de consulta\nUse os componentes do design system."}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-felipe', 's-canais-app', 'banco', 'publicado', null, 'u-leticia', array['front', 'lista', 'design system']::text[], array['Agnóstico']::text[], '2.2.0', '[{"icone": "folder", "titulo": "Escreve arquivos na pasta do projeto", "detalhe": ""}]'::jsonb, 23, 19, 2, array['Investimentos · Renda fixa', 'Seguros · Vida']::text[], '2026-02-27T09:20:00-03:00', '2026-02-27T10:00:00-03:00', '2026-09-02T10:00:00-03:00'),
  ('a-migracao-testes', 'Agente de migração de teste legado', 'agente', 'Converte testes antigos para o padrão atual da frente e explica cada conversão que fez.', '## O que faz
Converte testes antigos para o padrão atual, com um resumo do que mudou em cada arquivo.', '[{"caminho": "agente.md", "conteudo": "---\nname: migracao-testes\ndescription: Migra testes legados para o padrão atual.\n---\n# Migração de testes\nNão toque em código de produção.\n"}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-otavio', 's-cartoes-fatura', 'frente', 'publicado', null, 'u-renato', array['teste', 'legado', 'migração']::text[], array['Claude Code']::text[], '1.1.0', '[{"icone": "folder", "titulo": "Escreve arquivos na pasta do projeto", "detalhe": ""}]'::jsonb, 7, 6, 0, '{}'::text[], '2026-07-04T09:20:00-03:00', '2026-07-04T10:00:00-03:00', '2026-09-08T10:00:00-03:00'),
  ('a-job-carga-fatura', 'Esqueleto de job de carga noturna da fatura', 'esqueleto', 'Job noturno com reprocessamento, alerta de falha e trilha de execução.', '## O que faz
Gera o job de carga com reprocessamento e alerta.', '[{"caminho": "README.md", "conteudo": "# Job de carga noturna\nReprocessa só o lote que falhou."}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-otavio', 's-cartoes-fatura', 'frente', 'em_aprovacao', null, null, array['backend', 'job', 'fatura']::text[], array['Agnóstico']::text[], '1.0.0', '[{"icone": "folder", "titulo": "Escreve arquivos na pasta do projeto", "detalhe": ""}]'::jsonb, 0, 0, 0, '{}'::text[], '2026-09-26T09:20:00-03:00', null, '2026-09-26T10:00:00-03:00'),
  ('a-revisor-pr-pix', 'Revisor de PR com as regras de Pix', 'agente', 'Versão do revisor de PR com o guia de código da frente Pix e as regras de idempotência das transações.', '## O que faz
Mesmo revisor de PR, com o guia da frente Pix e checagens de idempotência.

## Origem
Derivado do revisor da Canais digitais · App.', '[{"caminho": "agente.md", "conteudo": "---\nname: revisor-pr-pix\ndescription: Revisa PR contra o guia de código da frente Pix.\n---\n# Revisor de PR (Pix)\nConfira idempotência em toda rota que cria transação.\n"}]'::jsonb, 'Claude Code: copie a pasta para `.claude/skills/`. Copilot: cole o conteúdo do SKILL.md nas instruções do repositório.', 'u-thiago', 's-pix-recebimentos', 'frente', 'publicado', 'a-revisor-pr', 'u-marcos', array['revisão', 'pix', 'pr']::text[], array['Agnóstico']::text[], '1.0.0', '[{"icone": "git-pull-request", "titulo": "Lê o diff do pull request", "detalhe": "Só leitura."}]'::jsonb, 9, 5, 0, '{}'::text[], '2026-09-12T09:20:00-03:00', '2026-09-12T10:00:00-03:00', '2026-09-12T10:00:00-03:00')
on conflict (id) do update set nome = excluded.nome, tipo = excluded.tipo, resumo = excluded.resumo, readme = excluded.readme, arquivos = excluded.arquivos, manual_instalacao = excluded.manual_instalacao, autor_id = excluded.autor_id, squad_id = excluded.squad_id, visibilidade = excluded.visibilidade, status = excluded.status, derivado_de = excluded.derivado_de, aprovado_por = excluded.aprovado_por, tags = excluded.tags, ferramentas = excluded.ferramentas, versao = excluded.versao, acessos = excluded.acessos, curtidas_base = excluded.curtidas_base, instalacoes_base = excluded.instalacoes_base, derivacoes_base = excluded.derivacoes_base, squads_reuso_base = excluded.squads_reuso_base, enviado_em = excluded.enviado_em, publicado_em = excluded.publicado_em, atualizado_em = excluded.atualizado_em;

insert into eventos (id, tipo, ator_id, ativo_id, dados, criado_em) values
  ('f29aaf47-718b-5e9d-b59e-722f9219774e', 'envio', 'u-marina', 'a-criterios-aceitacao', '{"visibilidade": "banco"}'::jsonb, '2026-08-14T09:20:00-03:00'),
  ('2ff06afa-9444-5fa8-9e6a-a20b18328e6a', 'aprovacao', 'u-renato', 'a-criterios-aceitacao', '{}'::jsonb, '2026-08-14T10:00:00-03:00'),
  ('a6f25fe1-702f-5b8d-9df3-8fa07dd2121d', 'derivacao', 'u-aline', 'a-criterios-aceitacao', '{}'::jsonb, '2026-09-19T15:10:00-03:00'),
  ('9756270a-5f80-5dc9-860f-0bafb31c158f', 'instalacao', 'u-lucas', 'a-criterios-aceitacao', '{}'::jsonb, '2026-09-17T11:02:00-03:00'),
  ('e9d99424-6377-5542-8021-ade8829248bf', 'derivacao', 'u-patricia', 'a-criterios-aceitacao', '{}'::jsonb, '2026-09-09T16:45:00-03:00'),
  ('400379ae-95ff-5a2c-a9df-90143986d820', 'derivacao', 'u-felipe', 'a-criterios-aceitacao', '{}'::jsonb, '2026-08-28T10:30:00-03:00'),
  ('68141c02-183d-5456-9b16-f62161cf7d1d', 'envio', 'u-otavio', 'a-criterios-fatura', '{"visibilidade": "squad"}'::jsonb, '2026-09-05T09:20:00-03:00'),
  ('b8443610-1799-549f-9bc9-8b06feff4289', 'aprovacao', 'u-renato', 'a-criterios-fatura', '{}'::jsonb, '2026-09-05T10:00:00-03:00'),
  ('02f3e113-9f73-5f64-bf1a-bfd3f29884db', 'envio', 'u-felipe', 'a-revisor-pr', '{"visibilidade": "banco"}'::jsonb, '2026-06-02T09:20:00-03:00'),
  ('42f682a9-e1fc-58f4-84d3-aa25ba58a880', 'aprovacao', 'u-leticia', 'a-revisor-pr', '{}'::jsonb, '2026-06-02T10:00:00-03:00'),
  ('edd83e60-9b47-5fc3-a82b-4b0f7a25125f', 'envio', 'u-camila', 'a-esqueleto-fastapi', '{"visibilidade": "banco"}'::jsonb, '2026-04-10T09:20:00-03:00'),
  ('fb1e80b4-fa66-5299-9a74-90b3b231f980', 'aprovacao', 'u-rodrigo', 'a-esqueleto-fastapi', '{}'::jsonb, '2026-04-10T10:00:00-03:00'),
  ('93bf8bd7-a000-52f9-a669-30106a02f4ef', 'envio', 'u-camila', 'a-feature-flag', '{"visibilidade": "banco"}'::jsonb, '2026-03-19T09:20:00-03:00'),
  ('ec1a23ec-06d8-5df6-aaef-fed8bbb9a377', 'aprovacao', 'u-rodrigo', 'a-feature-flag', '{}'::jsonb, '2026-03-19T10:00:00-03:00'),
  ('2cb6fe50-394d-55c9-b475-b8e4f4d56bfe', 'envio', 'u-rodrigo', 'a-mcp-catalogo-apis', '{"visibilidade": "banco"}'::jsonb, '2026-09-01T09:20:00-03:00'),
  ('d05e9ea9-9a27-5339-808c-48d03f8ca7bf', 'aprovacao', 'u-rodrigo', 'a-mcp-catalogo-apis', '{}'::jsonb, '2026-09-01T10:00:00-03:00'),
  ('e9965dbe-a67c-50e1-9857-6fda3a731631', 'envio', 'u-thiago', 'a-resumo-incidente', '{"visibilidade": "frente"}'::jsonb, '2026-09-13T09:20:00-03:00'),
  ('eaaa1160-2a6b-5d21-a488-ce5837dff82a', 'aprovacao', 'u-marcos', 'a-resumo-incidente', '{}'::jsonb, '2026-09-13T10:00:00-03:00'),
  ('35130293-1a36-5b76-8848-6bf8496bc671', 'envio', 'u-thiago', 'a-conciliacao-extrato', '{"visibilidade": "squad"}'::jsonb, '2026-09-23T09:20:00-03:00'),
  ('19b6d5e9-6028-593f-b889-bcb8b364799f', 'aprovacao', 'u-marcos', 'a-conciliacao-extrato', '{}'::jsonb, '2026-09-23T10:00:00-03:00'),
  ('8af7024e-3718-5fb1-9973-b5d3eaef0aec', 'envio', 'u-patricia', 'a-insights-pesquisa', '{"visibilidade": "banco"}'::jsonb, '2026-07-08T09:20:00-03:00'),
  ('3464dc2b-5511-5d84-a192-02b97f16676a', 'aprovacao', 'u-helena', 'a-insights-pesquisa', '{}'::jsonb, '2026-07-08T10:00:00-03:00'),
  ('879815a7-b99f-55a3-ba84-a00de7c7fbb8', 'envio', 'u-patricia', 'a-roteiro-usabilidade', '{"visibilidade": "banco"}'::jsonb, '2026-08-21T09:20:00-03:00'),
  ('05ba57be-4105-5707-9bbd-15bd6967c527', 'aprovacao', 'u-helena', 'a-roteiro-usabilidade', '{}'::jsonb, '2026-08-21T10:00:00-03:00'),
  ('72cc6a8a-a6f8-5a84-9765-a57f59aa1dda', 'envio', 'u-julia', 'a-ata-notebook', '{"visibilidade": "banco"}'::jsonb, '2026-05-30T09:20:00-03:00'),
  ('859073c7-612d-5a71-b8ec-5e10afbe5399', 'aprovacao', 'u-leticia', 'a-ata-notebook', '{}'::jsonb, '2026-05-30T10:00:00-03:00'),
  ('df6fd390-5b0c-5cdd-82f6-f6a1869d674f', 'envio', 'u-aline', 'a-kb-alucinacao', '{"visibilidade": "banco"}'::jsonb, '2026-06-25T09:20:00-03:00'),
  ('e4f886c4-f685-5488-b39f-b61afabba8a6', 'aprovacao', 'u-gustavo', 'a-kb-alucinacao', '{}'::jsonb, '2026-06-25T10:00:00-03:00'),
  ('9abf227b-d7b3-584c-9f83-24c0e05cf850', 'envio', 'u-lucas', 'a-grau-mudanca', '{"visibilidade": "banco"}'::jsonb, '2026-07-15T09:20:00-03:00'),
  ('42d6a872-358f-5dc5-93b7-6795821c955f', 'aprovacao', 'u-denise', 'a-grau-mudanca', '{}'::jsonb, '2026-07-15T10:00:00-03:00'),
  ('644aa9b1-172c-5264-926b-2b57a4eccba4', 'envio', 'u-ana', 'a-botao-contratacao', '{"visibilidade": "frente"}'::jsonb, '2026-07-21T09:20:00-03:00'),
  ('cd43e25d-062a-513b-8450-e65c189e5b8f', 'aprovacao', 'u-sergio', 'a-botao-contratacao', '{}'::jsonb, '2026-07-21T10:00:00-03:00'),
  ('e829dc87-0b2a-55af-a3fb-d776df1c0669', 'envio', 'u-felipe', 'a-tela-consulta', '{"visibilidade": "banco"}'::jsonb, '2026-02-27T09:20:00-03:00'),
  ('d3513a7c-d4cc-5446-851c-ec8641245067', 'aprovacao', 'u-leticia', 'a-tela-consulta', '{}'::jsonb, '2026-02-27T10:00:00-03:00'),
  ('6ec673f1-375b-5bcc-8aff-dad7360d8859', 'envio', 'u-otavio', 'a-migracao-testes', '{"visibilidade": "frente"}'::jsonb, '2026-07-04T09:20:00-03:00'),
  ('f8bfee3b-cd73-5e15-9092-d0c57f668fb7', 'aprovacao', 'u-renato', 'a-migracao-testes', '{}'::jsonb, '2026-07-04T10:00:00-03:00'),
  ('ef59a64b-cce4-539f-9cd1-c08e91331c16', 'envio', 'u-otavio', 'a-job-carga-fatura', '{"visibilidade": "frente"}'::jsonb, '2026-09-26T09:20:00-03:00'),
  ('ae10b7c2-17c3-5c74-8d50-9ba3725a7181', 'envio', 'u-thiago', 'a-revisor-pr-pix', '{"visibilidade": "frente"}'::jsonb, '2026-09-12T09:20:00-03:00'),
  ('5e1bab59-1fc6-59ef-aaf6-469ed837047a', 'aprovacao', 'u-marcos', 'a-revisor-pr-pix', '{}'::jsonb, '2026-09-12T10:00:00-03:00')
on conflict (id) do update set tipo = excluded.tipo, ator_id = excluded.ator_id, ativo_id = excluded.ativo_id, dados = excluded.dados, criado_em = excluded.criado_em;

