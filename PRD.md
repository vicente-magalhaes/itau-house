# PRD: Itaú House

## 1. Controle do documento

| Produto | Itaú House: o que uma pessoa do squad cria com IA vira do squad inteiro |
|---|---|
| **Equipe** | Alexandre Delbim, Bruno Vaskevicius, João Pedro Araujo, Vicente Magalhães (grupo 4) |
| **Status** | Em desenvolvimento |
| **Data** | 26/09/2026 |

MVP do Hackathon Itaú 2026, Case C. Não é produto oficial do Itaú. Todos os dados são fictícios.
Fluxos visuais: [docs/fluxos.html](docs/fluxos.html). Decisões: [memoria/decisions/](memoria/decisions/README.md). Pendências e riscos: [memoria/05-pendencias-e-riscos.md](memoria/05-pendencias-e-riscos.md).

**Glossário**

| Termo | Significado |
|---|---|
| **Squad** | Time multidisciplinar (produto, design, tecnologia, dados) com um objetivo de produto. |
| **Ativo** | Algo criado com IA que outra pessoa pode reaproveitar: skill, agente, framework, design system, harness, MCP ou esqueleto de código. |
| **Skill** | Instrução reutilizável que ensina um agente de IA a fazer uma tarefa. |
| **Agente de IA** | Assistente que recebe um objetivo e executa tarefas com ferramentas. Ex.: Claude Code, GitHub Copilot. |
| **MCP** | Model Context Protocol. Padrão aberto que conecta agentes de IA a ferramentas externas. Claude Code e Copilot suportam. |
| **Hook** | Gatilho que roda um script quando algo acontece no agente (ex.: a pessoa envia um pedido, um arquivo é criado). |
| **Plugin Itaú House** | Pacote instalado no agente da pessoa: hooks, instruções e a conexão com o MCP do Itaú House. |
| **Validador** | Checagem automática, por código e sem IA, que confere se um ativo pode seguir para o coordenador (D-26). |
| **Cord+ / Cord−** | Perfis de acesso. Cord+ é o coordenador (ou acima) do squad e aprova publicações. Cord− é qualquer outro membro. |
| **Alcance** | Quem pode ver um ativo: só o squad, a frente ou o banco inteiro. |
| **Derivação** | Ativo novo criado a partir de outro. Guarda o "derivado de" e dá crédito ao autor original. |
| **Modo do plugin** | Quanto o plugin interrompe: perguntar antes (padrão), proativo ou sob demanda. |
| **Feed** | Lista de ativos publicados na plataforma web, ordenada por popularidade. |
| **SSO** | Login único corporativo. No protótipo, simulado. |
| **LLM** | Modelo de linguagem usado pelos agentes do produto. |
| **RN / RF / RNF** | Regra de negócio / requisito funcional / requisito não funcional. RN e RF de mesmo número falam da mesma regra. |
| **P0 / P1** | Prioridade. P0 aparece na demo. P1 entra se sobrar tempo. |

## 2. Visão geral

Num squad orientado por IA, cada pessoa cria os próprios agentes, skills e atalhos. PM, designer e dev atacam a mesma dor, mas o que um cria fica na máquina dele. Quem precisa de algo parecido constrói de novo.

**2.1 Fluxo atual (as-is)**
- A pessoa do squad precisa de uma skill ou agente e cria do zero no seu agente de IA.
- Se desconfia que alguém já fez, pergunta a colegas ou não pergunta. **[HIPÓTESE]** Ainda não entrevistamos um dev (A-13).
- Quem já tem skills prontas compartilha de forma manual, quando compartilha (caso EDA, D-16).
- Times montam repositórios próprios, "do time para o time", sem processo institucional (F1).
- Pessoas que atuam em várias squads não sabem que agente cada um usa (F2).

**2.2 Dores**
- **Retrabalho:** a pessoa gasta tempo recriando o que outra já fez e testou.
- **Conhecimento preso na pessoa:** o que um cria não chega ao squad nem a outros papéis.
- **Sem descoberta no momento certo:** um repositório exige que a pessoa saiba que deve procurar.
- **Risco no compartilhamento informal:** ativo passado de mão em mão pode carregar segredo ou dado sensível. O Itaú já teve vazamento (F1).

**2.3 Objetivo**
Queremos ajudar membros de um squad orientado por IA a reaproveitar agentes e skills que outras pessoas já criaram, quando começam a criar algo novo, porque hoje o compartilhamento é manual e ninguém sabe o que o outro já fez. Saberemos que ajudamos se a parcela de criações novas que reaproveitam ou adaptam um ativo existente crescer, inclusive entre papéis diferentes.

## 3. Solução

O Itaú House é uma camada de reuso para squads orientados por agentes, que:
- reconhece quando alguém começa a criar um ativo no próprio agente de IA;
- busca no catálogo o que já existe e explica por que é parecido;
- deixa a pessoa decidir entre usar, adaptar ou ignorar;
- transforma o que foi criado do zero em ativo publicável, sem tarefa extra;
- barra o que fere os guard rails e explica como corrigir;
- só publica com aprovação do coordenador do squad;
- dá crédito ao autor a cada uso e derivação.

Funciona em qualquer agente que suporte MCP. A demo usa o Claude Code.

**3.1 Escopo incluído (MVP, P0)**
- Modo padrão "perguntar antes" (RF-02).
- Reconhecimento da intenção de criar um ativo (RF-03).
- Pergunta antes de buscar (RF-04).
- Busca restrita ao que a pessoa pode ver (RF-05).
- Justificativa da semelhança (RF-06).
- Decisão da pessoa: usar, adaptar ou ignorar (RF-07).
- Adaptação ao contexto (RF-08).
- Registro de "derivado de" (RF-09).
- Registro da decisão (RF-10).
- Publicação armada quando nada é encontrado (RF-11).
- Detecção de ativo novo (RF-13).
- Validação de entrada por agente (RF-14).
- Explicação do bloqueio (RF-15).
- Convite para publicar (RF-16).
- Post editável montado via MCP (RF-17).
- Escolha do alcance (RF-18).
- Aprovação do coordenador (RF-19).
- Registro de quem publicou e aprovou (RF-22).
- Login simulado (RF-23).
- Perfis Cord+ e Cord− (RF-24).
- Feed por popularidade (RF-25).
- Página do post (RF-27).
- Contagem de instalações e derivações (RF-30).
- Fila de aprovação (RF-32).

**3.2 Se sobrar tempo (P1)**
- Instalação e escolha de modo pelo próprio plugin (RF-01).
- Busca sob demanda com `/itau-house` (RF-12).
- Devolução ao autor com comentário (RF-21).
- Busca e filtros na plataforma (RF-26).
- Curtir (RF-28).
- Instalar pela plataforma com manual (RF-29).
- Autor edita o próprio post (RF-31).

**3.3 Fora de escopo**
- Delegação da aprovação (RF-20): fica para a v2.
- Comentários e feedback privado ao dono (RF-33): fica para a v2.
- Contato do autor pela plataforma: fica para a v2.
- Ranking personalizado ou algoritmo de recomendação: fica para a v2. O MVP ordena só por popularidade (D-15).
- Painel do gestor sobre quem usa o quê: fora. O gestor vê só a fila de aprovação (D-15).
- SSO real e hierarquia real do Itaú: simulados. Piloto exige integração com o diretório corporativo.
- Conexão com sistemas do Itaú: proibida pelo case. Nada vai para produção sem os gates que o Itaú já tem.
- Outras personas além do squad (Finanças, conhecimento executivo): próximos passos (D-05).

## 4. Atores e personas

Persona em três camadas (D-18): quem usa o fluxo, quem governa, e o squad como unidade de valor.

| Ator | Papel | Interage via |
|---|---|---|
| **Membro do squad** | Cria e reaproveita ativos. Pode ser PM, designer ou dev. Na demo, um dev. É autor quando publica. | Agente de IA (Claude Code, Copilot) e plataforma web |
| **Coordenador do squad (Cord+)** | Aprova ou devolve os ativos das pessoas do seu squad. | Plataforma web |
| **Plugin Itaú House** | Reconhece a intenção, pergunta, busca, sugere, adapta e convida a publicar. Nunca decide pela pessoa. | Hooks e instruções no agente da pessoa |
| **Validador** | Checagens fixas por código. Confere os requisitos de entrada e explica bloqueios. | Back-end |
| **Servidor MCP** | Expõe o catálogo como ferramentas para qualquer agente compatível. | MCP |
| **Plataforma web** | Feed, página do post e fila de aprovação. | Navegador |

**Cena da demo.** Um dev pede ao Claude Code: "cria uma skill que transforma a demanda em critérios de aceitação e casos de teste". O Itaú House encontra a skill "Demanda em critérios de aceitação", publicada por uma PM da squad Cartões. O dev adapta para gerar casos de teste. Depois, cria uma skill nova de massa de dados fictícios para testes de Pix. Não existe nada parecido. O validador barra por uma chave de API no código. O dev corrige. A coordenadora aprova. O ativo entra no feed.

## 5. Fluxo principal

Versão visual com raias em [docs/fluxos.html](docs/fluxos.html).

**5.1 Raia Membro do squad (descoberta)**
- Pede ao seu agente para criar algo novo.
- Decisão "quer buscar no Itaú House agora?" (modo perguntar antes): sim → 5.2; não → segue sem busca.
- Recebe a sugestão com justificativa. Decisão "usa, adapta ou ignora?": adapta → 5.2 adapta; usa ou ignora → 5.4 registra.

**5.2 Raia Plugin Itaú House**
- Reconhece a intenção de criar um ativo (RF-03).
- Decisão "qual o modo?": perguntar antes → pergunta à pessoa (RF-04); proativo → busca direto; sob demanda → não interrompe (RF-12).
- Chama o MCP para buscar (RF-05).
- Decisão "achou algo parecido?": sim → mostra o ativo e a justificativa (RF-06); não → avisa e arma a publicação (RF-11).
- Se a pessoa escolheu adaptar: clona e adapta, marcando "derivado de" (RF-08, RF-09).

**5.3 Raia Plugin, Validador e Membro do squad (publicação)**
- Ao fim da tarefa, detecta o ativo novo (RF-13).
- Validador confere os requisitos (RF-14). Decisão "cumpre?": não → explica o que barrou (RF-15) e a pessoa corrige, voltando à validação; sim → segue.
- Plugin convida a publicar (RF-16). Decisão da pessoa "quer publicar?": não → o ativo fica só na máquina dela; sim → MCP monta o post (RF-17).
- A pessoa revisa o post e escolhe o alcance (RF-18). O ativo vai para a fila do coordenador.

**5.4 Raia Coordenador e Plataforma**
- Coordenador vê a fila do seu squad (RF-32). Decisão "aprova?": sim → publica com o alcance escolhido (RF-19, RF-22); não → devolve com comentário (RF-21).
- Plataforma registra a decisão da descoberta, uso e derivação (RF-10, RF-30).
- Ativo publicado aparece no feed, ordenado por popularidade (RF-25).

**5.5 Casos incompletos ou incorretos**
- Ativo com segredo, dado pessoal ou sem README: o validador barra, aponta onde e sugere a correção. Nunca corrige sozinho.
- Pedido ambíguo (não dá para saber se é criação de ativo): o plugin não interrompe.
- Busca sem resultado: o plugin diz que não encontrou. Não inventa um ativo parecido.
- Semelhança fraca: o plugin só sugere acima de um limiar. Abaixo, trata como "não encontrou".
- LLM indisponível ou lento na demo: respostas gravadas para os cenários da demo (RNF-04), marcadas como tal.
- Ativo de alcance "squad" de outra squad: nunca aparece na busca nem no feed (RF-05).

## 6. Regras de negócio (RN)

| Código | Regra |
|---|---|
| **RN-01** | Instalar plugin e escolher o modo |
| **RN-02** | Iniciar no modo perguntar antes |
| **RN-03** | Reconhecer intenção de criar ativo |
| **RN-04** | Perguntar à pessoa antes de buscar |
| **RN-05** | Buscar só ativos visíveis à pessoa |
| **RN-06** | Justificar por que o ativo é parecido |
| **RN-07** | Pessoa decidir usar, adaptar ou ignorar |
| **RN-08** | Adaptar ativo ao contexto da pessoa |
| **RN-09** | Registrar origem "derivado de" |
| **RN-10** | Registrar a decisão da pessoa |
| **RN-11** | Armar publicação quando nada for encontrado |
| **RN-12** | Buscar sob demanda com /itau-house |
| **RN-13** | Detectar ativo novo criado |
| **RN-14** | Validar requisitos de entrada com agente |
| **RN-15** | Explicar bloqueio e como corrigir |
| **RN-16** | Convidar a pessoa a publicar |
| **RN-17** | Montar post editável via MCP |
| **RN-18** | Autor escolher o alcance do ativo |
| **RN-19** | Coordenador aprovar antes de publicar |
| **RN-20** | Coordenador delegar a aprovação **[FORA]** (time, 26/09: sem ganho na demo; fica para a v2) |
| **RN-21** | Coordenador devolver ao autor com comentário |
| **RN-22** | Registrar quem publicou e quem aprovou |
| **RN-23** | Entrar com login corporativo **[SIMULADO]** |
| **RN-24** | Diferenciar perfis Cord+ e Cord− |
| **RN-25** | Ordenar feed por popularidade |
| **RN-26** | Buscar e filtrar ativos na plataforma |
| **RN-27** | Exibir detalhes do post |
| **RN-28** | Curtir um ativo |
| **RN-29** | Instalar ativo seguindo o manual |
| **RN-30** | Contar instalações e derivações por ativo |
| **RN-31** | Autor editar o próprio post |
| **RN-32** | Exibir fila de aprovação ao coordenador |
| **RN-33** | Comentar e enviar feedback privado **[FORA]** (time, 26/09: fica para a v2) |

## 7. Requisitos funcionais (RF)

**Persona e tom do plugin.** Fala como o Itaú fala: "você", frases curtas, sem urgência, sem jargão sem explicação. Sugere e explica. Nunca decide pela pessoa. Exemplo: "Encontrei uma skill parecida no Itaú House, feita pela Ana, PM da squad Cartões. Quer ver?"

**7.1 Descoberta (plugin e MCP)**

| Código | Nome | Descrição | Critérios de aceitação |
|---|---|---|---|
| **RF-01** | Instalar plugin e escolher o modo | A pessoa instala o Itaú House no seu agente e escolhe o modo. | • Instalação por um comando ou arquivo de configuração documentado. • Modos: perguntar antes, proativo, sob demanda. • O modo pode ser trocado depois. • P1: na demo, o plugin já vem instalado. |
| **RF-02** | Iniciar no modo perguntar antes | Sem escolha explícita, o plugin opera em "perguntar antes" (D-17). | • Instalação nova sem configuração → modo perguntar antes. • O modo ativo fica visível na configuração. |
| **RF-03** | Reconhecer intenção de criar ativo | Um hook lê o pedido da pessoa e reconhece a intenção de criar skill, agente, framework, design system, harness ou MCP. | • Dado "cria uma skill que…", reconhece a intenção. • Dado um pedido comum ("corrige esse bug"), não reconhece e não interrompe. • Na dúvida, não interrompe (liga RF-04). • O tipo de ativo reconhecido fica registrado (liga RF-10). |
| **RF-04** | Perguntar antes de buscar | No modo perguntar antes, o agente pergunta se pode buscar no Itaú House antes de começar. | • A pergunta aparece uma vez por pedido. • Resposta "não" → segue a tarefa normalmente, sem nova pergunta no mesmo pedido. • Modo proativo → busca sem perguntar. Modo sob demanda → não pergunta nem busca. |
| **RF-05** | Buscar só ativos visíveis | O MCP busca no catálogo só entre ativos publicados que a pessoa pode ver. | • Visível = alcance "banco", ou alcance "frente" da mesma frente, ou alcance "squad" do mesmo squad. • Ativos em aprovação, barrados ou devolvidos nunca aparecem. • Dado um ativo de alcance "squad" de outra squad, a busca não o retorna. |
| **RF-06** | Justificar a semelhança | Cada sugestão vem com o motivo da semelhança e os dados do ativo. | • Mostra título, autor, papel do autor, squad, curtidas, instalações e o motivo em uma ou duas frases. • Só sugere acima de um limiar de semelhança. Abaixo, responde "não encontrei". • No máximo 3 sugestões por busca. • Nenhum ativo é inventado: toda sugestão existe no catálogo. |
| **RF-07** | Pessoa decide usar, adaptar ou ignorar | Depois da sugestão, a pessoa escolhe o que fazer. | • Três opções explícitas: usar como está, adaptar, ignorar. • O agente não segue sem a escolha. • "Ignorar" → segue a criação do zero e arma a publicação (liga RF-11). |
| **RF-08** | Adaptar ao contexto | O agente clona o ativo e o ajusta ao pedido da pessoa. | • O original não é alterado. • A adaptação mostra o que mudou em relação ao original. • A pessoa revisa antes de salvar. |
| **RF-09** | Registrar "derivado de" | Todo ativo adaptado guarda a referência ao original. | • O ativo novo tem `derivado_de` apontando para o original. • A página do original mostra o número de derivações (liga RF-30). |
| **RF-10** | Registrar a decisão | Toda sugestão e decisão vira um evento. | • Evento guarda: pessoa, pedido, ativos sugeridos, justificativa, decisão e data. • "Usar" soma uma instalação ao ativo. "Adaptar" soma uma derivação. • Consultável na página do ativo pelo autor e pelo coordenador. |
| **RF-11** | Armar publicação quando nada for encontrado | Se a busca não encontra nada ou a pessoa ignora, o plugin avisa e prepara a publicação para o fim da tarefa. | • Mensagem clara: "Não encontrei nada parecido. Quando terminar, posso ajudar a publicar." • Ao fim da tarefa, dispara RF-13. |
| **RF-12** | Buscar sob demanda | A pessoa chama `/itau-house <o que precisa>` a qualquer momento. | • Funciona em qualquer modo. • Mesmo resultado e mesmas regras da busca automática (RF-05, RF-06). • P1. |

**7.2 Publicação**

| Código | Nome | Descrição | Critérios de aceitação |
|---|---|---|---|
| **RF-13** | Detectar ativo novo | Um hook percebe quando um arquivo de ativo é criado (ex.: `SKILL.md`, definição de agente). | • Detecta skills e agentes nas pastas padrão do agente. • Ao fim da tarefa, se houve ativo novo, dispara a validação (RF-14). • Ativo derivado também passa pela validação. |
| **RF-14** | Validar requisitos de entrada | O validador confere o ativo antes de qualquer pessoa ver. | • Checagens fixas: segredos e chaves, dados pessoais (CPF, e-mail, telefone), README ou descrição, autor e squad. • Sem IA no MVP (D-26): o julgamento é do coordenador (RF-19). • Resultado: aprovado ou barrado, com a lista de motivos. • Cada validação vira evento (liga RNF-01). |
| **RF-15** | Explicar bloqueio | Quando barra, o validador diz o que, onde e como corrigir. | • Cada motivo tem arquivo, linha quando houver e sugestão de correção. • Ex.: "Tem uma chave de API na linha 12. Use uma variável de ambiente." • O validador nunca corrige sozinho. • Depois da correção, a pessoa pode validar de novo. |
| **RF-16** | Convidar a publicar | Ativo aprovado pelo validador gera um convite. | • O convite explica o que acontece: post montado, revisão da pessoa, aprovação do coordenador. • "Não" → nada é enviado. O ativo fica só na máquina da pessoa. |
| **RF-17** | Montar post editável via MCP | O MCP monta o rascunho do post a partir do ativo. | • Campos: título, descrição, tipo, README, conteúdo do ativo, autor, papel, squad, alcance sugerido, `derivado_de` quando houver, manual de instalação. • A pessoa pode editar qualquer campo antes de enviar. • Status do ativo: rascunho. |
| **RF-18** | Escolher alcance | O autor escolhe quem pode ver. | • Opções: squad, frente, banco. • Padrão sugerido: squad (o mais restrito). • Enviar → status "em aprovação", na fila do coordenador do squad do autor. |
| **RF-19** | Aprovar antes de publicar | Só o coordenador do squad do autor publica. | • Nenhum ativo fica visível a outros sem aprovação. • Aprovar → status "publicado" com o alcance escolhido. • Coordenador de outro squad não vê o item na fila. |
| **RF-20** | Delegar aprovação **[FORA]** | Coordenador passa a aprovação a outra pessoa. | Fica para a v2 (time, 26/09). |
| **RF-21** | Devolver com comentário | O coordenador recusa e explica. | • Comentário obrigatório. • Status "devolvido". O autor vê o comentário e pode reenviar. • P1. |
| **RF-22** | Registrar publicação e aprovação | O ativo guarda a trilha de quem fez o quê. | • Guarda autor, data de envio, quem aprovou ou devolveu, data e comentário. • Visível na página do post. |

**7.3 Plataforma web**

| Código | Nome | Descrição | Critérios de aceitação |
|---|---|---|---|
| **RF-23** | Login corporativo **[SIMULADO]** | A tela de entrada simula o SSO. | • Lista de usuários fictícios com nome, papel, squad e perfil. • A tela indica que o login é simulado. |
| **RF-24** | Perfis Cord+ e Cord− | O perfil define o que a pessoa vê. | • Cord− vê feed e posts. • Cord+ vê o mesmo e a fila de aprovação do seu squad. |
| **RF-25** | Feed por popularidade | O feed lista os ativos publicados visíveis à pessoa. | • Ordem: curtidas + instalações, maior primeiro. • Só ativos visíveis pela regra do RF-05. • Cada card mostra título, tipo, autor, papel, squad, curtidas, instalações. |
| **RF-26** | Buscar e filtrar | Busca por nome e filtros. | • Filtros: tipo de ativo, papel do autor, squad ou frente. • P1. |
| **RF-27** | Página do post | Detalhe completo do ativo. | • Mostra os campos do RF-17, contadores (RF-30), trilha (RF-22) e origem "derivado de" com link. |
| **RF-28** | Curtir | Uma curtida por pessoa por ativo. | • Clicar de novo remove a curtida. • Atualiza o contador e a ordem do feed. • P1. |
| **RF-29** | Instalar com manual | Botão de instalar mostra o passo a passo. | • Manual por tipo de ativo e por agente (Claude Code, Copilot). • Registrar a instalação soma no contador. • P1. |
| **RF-30** | Contar instalações e derivações | Cada ativo mostra quantas vezes foi usado e derivado. | • Contadores vêm dos eventos (RF-10) e da plataforma (RF-29). • Mostra também quantos usos vieram de outros papéis (reuso entre papéis). |
| **RF-31** | Autor edita o post | O autor complementa o próprio post. | • Pode editar descrição, projetos em que usou e métricas pessoais. • Mudar o conteúdo do ativo exige nova validação e aprovação. • P1. |
| **RF-32** | Fila de aprovação | Cord+ vê os ativos do seu squad aguardando aprovação. | • Cada item mostra o post, o resultado do validador e o alcance pedido. • Ações: aprovar (RF-19) e devolver (RF-21). |
| **RF-33** | Comentários e feedback privado **[FORA]** | Conversa sobre o ativo. | Fica para a v2 (time, 26/09). |

## 8. Requisitos não funcionais (RNF)

| Código | Nome | Descrição | Critérios de aceitação |
|---|---|---|---|
| **RNF-01** | Rastreabilidade | Toda ação de agente ou pessoa vira evento. | • Dado um ativo, é possível ver quem criou, o que o validador disse, quem aprovou, quem usou e quem derivou. |
| **RNF-02** | Revisão humana | A IA sugere; a pessoa decide. | • Nada é publicado sem o coordenador. • Nada é adaptado ou salvo sem a pessoa. • O validador não corrige nem publica sozinho. |
| **RNF-03** | Dados fictícios e segredos | Só dados de demonstração. | • Nenhum dado real, chave ou segredo no código, no banco, em tela ou no vídeo. • Chaves só em `.env`, fora do git. |
| **RNF-04** | Demo resiliente | A demo roda ao vivo mesmo com falha externa. | • Catálogo e usuários fictícios carregados por seed. • Se o LLM falhar ou demorar mais de 10 s, usa respostas gravadas dos cenários da demo, marcadas como gravadas. • Um comando sobe tudo (Docker). |
| **RNF-05** | Agnóstico de agente | O catálogo é exposto por MCP. | • O servidor MCP segue o padrão aberto e não depende de um agente específico. • A demo usa Claude Code. • Para piloto, depende de o Copilot corporativo do Itaú ter MCP liberado. |
| **RNF-06** | Identidade visual | A interface segue o design system do Itaú. | • Usa só tokens e componentes de `design-system/`. • Toda tela indica "protótipo de hackathon, não é produto oficial do Itaú". |
| **RNF-07** | Visibilidade | O alcance é respeitado em toda leitura. | • A regra do RF-05 vale para busca, feed, página do post e MCP. • Testada com um ativo de alcance "squad" de outra squad. |

## 9. Arquitetura e stack

| Camada | Tecnologia e função |
|---|---|
| **Plugin** | Plugin do Claude Code: hook de pedido (RF-03, RF-04), hook de arquivo criado (RF-13), comando `/itau-house` (RF-12), configuração do modo e do MCP. Instruções equivalentes servem ao Copilot. |
| **Servidor MCP** | Python. Ferramentas: `buscar_ativos`, `detalhar_ativo`, `registrar_decisao`, `validar_ativo`, `montar_post`, `enviar_para_aprovacao`. Chama a API. |
| **Back-end** | Python + FastAPI, rotas sob `/api`. Regras de visibilidade, validador, eventos, contadores. |
| **Camada de IA** | Gemini pela API REST, sem SDK, único provedor no MVP (0039): `gemini-flash-lite-latest` (variável `GEMINI_MODELO`), com `gemini-3.1-flash-lite` e `gemini-3.5-flash` de reserva quando dá 503 ou a cota acaba. Só a busca usa IA: ranqueia e justifica os candidatos, com saída estruturada por schema. Tudo cabe em 10 s; depois disso, as respostas gravadas (RNF-04). O validador não usa IA no MVP (D-26). |
| **Busca** | MVP sem embeddings (D-19): o back-end filtra por visibilidade (RF-05) e o LLM ranqueia e justifica os candidatos. Em escala: embeddings com pgvector no Supabase para pré-filtrar, LLM só nos finalistas. |
| **Banco** | Supabase (PostgreSQL). Fora do compose (ver `docker-compose.yml`). |
| **Front-end** | TypeScript + React + Vite, com `design-system/`. |
| **Ambiente** | Docker Compose (D-11). Build de produção com nginx para a demo. |

**Real e simulado**

| Componente | Estado | Observação |
|---|---|---|
| Plugin, hooks e MCP | Real | Rodando no Claude Code da máquina da demo. |
| Validador | Real | Checagens fixas por código (D-26). |
| Busca e justificativa | Real | Sobre catálogo fictício. |
| Catálogo, usuários, squads | **[SIMULADO]** | Dados fictícios de seed, com casos reais de retrabalho como inspiração. |
| Login (SSO) | **[SIMULADO]** | Escolha de usuário fictício. |
| Hierarquia de coordenadores | **[SIMULADO]** | Definida no seed. |
| Uso no Copilot | Não demonstrado | Mesmo MCP. Depende das políticas do Itaú. |
| Respostas gravadas do LLM | **[SIMULADO]** | Só como fallback da demo (RNF-04). |

**Custos (escalabilidade)**
- LLM: principal custo. Claude Opus 5 custa US$ 5 por milhão de tokens de entrada e US$ 25 por milhão de saída. Fator: número de pedidos com intenção de criar ativo e de validações. Controle: o hook só chama o LLM quando reconhece a intenção; esforço baixo nas rotas simples; em escala, embeddings pré-filtram antes do LLM.
- Banco: fator é o número de ativos e eventos. Pequeno.
- Hospedagem da API e do MCP: fator é o número de pessoas com o plugin.
- Operação: tempo dos coordenadores aprovando. Fator: volume de publicações por squad.

## 10. Modelo de dados

Decisões-chave: o ativo concentra estado, alcance e origem. Tudo que acontece vira evento, e os contadores saem dos eventos. Curtida é tabela própria porque tem regra de unicidade.

**Tabela squads:** cada squad e a frente a que pertence. Base da regra de visibilidade.

| SQUADS | Tipo | Chave | Notas |
|---|---|---|---|
| **id** | uuid | **PK** | |
| nome | text | — | UQ |
| frente | text | — | ex.: Cartões, Pix |

**Tabela usuarios:** pessoas fictícias do login simulado.

| USUARIOS | Tipo | Chave | Notas |
|---|---|---|---|
| **id** | uuid | **PK** | |
| nome | text | — | |
| papel | enum | — | produto / design / dev / risco |
| **squad_id** | uuid | **FK** → squads.id | |
| perfil | enum | — | cord_mais / cord_menos |

**Tabela ativos:** cada skill, agente ou outro ativo, do rascunho à publicação.

| ATIVOS | Tipo | Chave | Notas |
|---|---|---|---|
| **id** | uuid | **PK** | |
| titulo | text | — | |
| tipo | enum | — | skill / agente / framework / design_system / harness / mcp / esqueleto |
| descricao | text | — | |
| readme | text | — | |
| conteudo | text | — | o ativo em si |
| manual_instalacao | text | — | |
| **autor_id** | uuid | **FK** → usuarios.id | |
| **squad_id** | uuid | **FK** → squads.id | squad do autor no envio |
| alcance | enum | — | def 'squad': squad / frente / banco |
| status | enum | — | def 'rascunho': rascunho / barrado / em_aprovacao / devolvido / publicado |
| **derivado_de** | uuid | **FK** → ativos.id | null = original |
| **aprovado_por** | uuid | **FK** → usuarios.id | null até aprovar |
| comentario_coordenador | text | — | preenchido ao devolver |
| enviado_em | timestamptz | — | |
| publicado_em | timestamptz | — | |

**Tabela validacoes:** cada rodada do validador sobre um ativo.

| VALIDACOES | Tipo | Chave | Notas |
|---|---|---|---|
| **id** | uuid | **PK** | |
| **ativo_id** | uuid | **FK** → ativos.id | |
| resultado | enum | — | aprovado / barrado |
| motivos | jsonb | — | lista: tipo, arquivo, linha, sugestão |
| criado_em | timestamptz | — | |

**Tabela curtidas:** uma curtida por pessoa por ativo.

| CURTIDAS | Tipo | Chave | Notas |
|---|---|---|---|
| **usuario_id** | uuid | **PK**, **FK** → usuarios.id | |
| **ativo_id** | uuid | **PK**, **FK** → ativos.id | |
| criado_em | timestamptz | — | |

**Tabela eventos:** trilha de tudo que acontece. Fonte dos contadores e da rastreabilidade.

| EVENTOS | Tipo | Chave | Notas |
|---|---|---|---|
| **id** | uuid | **PK** | |
| tipo | enum | — | intencao / busca / sugestao / decisao / validacao / envio / aprovacao / devolucao / instalacao / derivacao |
| **ator_id** | uuid | **FK** → usuarios.id | |
| **ativo_id** | uuid | **FK** → ativos.id | null em busca sem resultado |
| dados | jsonb | — | pedido, sugestões, justificativa, decisão, modo |
| criado_em | timestamptz | — | |

Relacionamentos:
- Um squad tem muitos usuários (1:N).
- Um usuário é autor de muitos ativos (1:N).
- Um ativo pode ter muitas derivações (1:N, via `derivado_de`).
- Um ativo tem muitas validações, curtidas e eventos (1:N).

## 11. Métricas

| Indicador | Como medir | Medido ou estimado | Meta |
|---|---|---|---|
| Taxa de reaproveitamento | Pedidos com intenção de criar em que a pessoa usou ou adaptou um ativo ÷ pedidos com intenção | No protótipo, só sobre dados fictícios: **simulado**. Em piloto, medido. | Definir no piloto |
| Reuso entre papéis | Usos e derivações em que o papel de quem usou ≠ papel do autor ÷ total de usos | Idem | Definir no piloto |
| Precisão da sugestão | Sugestões usadas ou adaptadas ÷ sugestões mostradas | Idem | Definir no piloto |
| Ativos barrados na entrada | Barrados ÷ validados, por motivo | Idem | Mostra que a governança funciona |
| Tempo até publicar | Envio → aprovação | Idem | Definir no piloto |
| Horas de retrabalho evitadas | Reaproveitamentos × tempo médio para criar um ativo | **Estimado**. Tempo médio vem de entrevista, não de medição. | — |
| Teste com pessoa de fora | Completou o fluxo? Onde travou? O que mudamos? | Medido no evento (A-10) | Pelo menos um teste registrado |

## 12. Decisões em aberto e riscos

| Nº | Decisão ou risco | Impacta |
|---|---|---|
| **Latência** | Opus 5 na demo ao vivo pode demorar. Controle: esforço baixo nas rotas rápidas, respostas gravadas (RNF-04). Trocar de modelo é decisão do time. | Demo |
| **A-13** | Nenhum dev entrevistado. Evidência da dor ainda indireta. | Pitch, critério "Dados" |
| **A-10** | Teste com pessoa de fora ainda não feito. Obrigatório. | Pitch, ficha |
| **A-05** | Diferença para o catálogo de skills homologadas do Itaú e para portais de desenvolvedor (ex.: Backstage). Risco de desclassificação por inovação. | Pitch, critério de inovação |
| **R-04** | O agente sugere algo que não é parecido. Controle: limiar, justificativa visível, decisão humana, métrica de precisão. | Confiança |
| **R-05** | Catálogo vazio. Controle: publicação armada como efeito colateral (RF-11). | Adoção |
| **R-03** | Vazamento por ativo publicado. Controle: validador, alcance, aprovação humana. | Segurança |
| **Dependência** | Copilot corporativo com MCP liberado e integração com diretório do Itaú para SSO e hierarquia. | Piloto |
