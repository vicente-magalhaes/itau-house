---
summary: "Decidido, em aberto, riscos, perguntas da banca"
read_when: "Antes de assumir qualquer decisão"
review_by: 2026-09-27
---

# Decisões, pendências e riscos

Registro vivo. Ao decidir algo, mover de "Em aberto" para "Decidido" com data.
Itens marcados **(sugestão Claude)** são propostas para o time avaliar, não decisões.

## Decidido

| # | Decisão | Data |
|---|---|---|
| D-01 | Case C, Jornada de agentes. Confirmado pela organização. Troca não é permitida. | antes do evento |
| D-02 | Solução: Itaú House, fórum de reuso de ativos (agentes, skills, frameworks, componentes, esqueletos de código) entre squads. | 26/09/2026 |
| D-03 | Persona inicial: dev. É a mais afetada por retrabalho e dá o MVP de maior aprendizado. **Revisada em D-18.** | 26/09/2026 |
| D-04 | Argumento do recorte: começar pequeno por governança e compliance, depois expandir. | 26/09/2026 |
| D-05 | Expansão fica como próximos passos: produto, design e risco → Finanças → conhecimento executivo (notebooks, PPTs). | 26/09/2026 |
| D-06 | A PRD não é entregável, mas será escrita, objetiva e focada em requisitos e stack, como contexto para os agentes de desenvolvimento. Ver [06-prd-e-stack.md](../docs/06-prd-e-stack.md). | 26/09/2026 |
| D-07 | Só dados fictícios. Integrações simuladas ficam marcadas como simuladas em tela, vídeo e slides. | regra do evento |
| D-08 | Git: só `main` e branches de trabalho (`feat/`, `fix/`). Cada um faz merge direto da própria branch na `main`, sem `dev` e sem Pull Request, por agilidade. O Claude pode dar push (liberado em `.claude/settings.json`). | 26/09/2026 |
| D-10 | Formato da banca: 3 min de pitch, 2 min de vídeo demo, 2 min de perguntas. | 26/09/2026 |
| D-09 | Repositório privado durante o desenvolvimento. Antes da banca, limpar para ficar só o código e uma apresentação enxuta. | 26/09/2026 |
| D-11 | Ambiente em Docker Compose: modo dev com hot reload e build de produção (nginx), indicado para a demo. CI sobe os dois modos a cada push. Motivo (Vicente): mostrar maturidade técnica, porque pode haver gestor de tecnologia na banca. | 26/09/2026 |
| D-12 | MVP demonstra o ciclo descoberta → publicação (fluxos 02 e 03 de `docs/fluxos.html`), com front mínimo: página do post e fila de aprovação. O resto fica simulado ou como próximo passo. Fecha A-01. | 26/09/2026 |
| D-13 | Nada é publicado sem aprovação do coordenador (Cord+), que pode delegar. Antes dele, um agente validador confere segredos, dado sensível, README, dono e escopo. Se barrar, explica o motivo e como corrigir. Quem publica escolhe o alcance (squad, frente ou banco). Fecha A-03 e A-04. | 26/09/2026 |
| D-14 | O dev escolhe o modo do plugin: proativo, perguntar antes ou sob demanda (`/itau-house`). Motivo: busca automática pode soar invasiva para parte das pessoas. O aviso aparece no agente de código do dev, ao reconhecer a intenção de criar um ativo. Fecha A-02. Modo padrão: perguntar antes (D-17). | 26/09/2026 |
| D-15 | Ranking por popularidade: curtidas e instalações. Derivações ("derivado de") contam como reuso e dão crédito ao autor original. Sem "algoritmo do X" no MVP. Visão do gestor limitada à fila de aprovação. Fecha A-15. | 26/09/2026 |
| D-16 | A dor segue sendo retrabalho. O caso da análise exploratória de dados (EDA) mostra que o compartilhamento de skills hoje é manual: a pessoa só não sofre porque já tem as próprias skills. A demo usa casos reais de retrabalho recorrente, apresentados como simulação. Fecha A-14. | 26/09/2026 |
| D-17 | Modo padrão do plugin: perguntar antes. Respeita quem acha a busca automática invasiva e ainda mostra o valor proativo. Fecha A-16. | 26/09/2026 |
| D-18 | Persona em três camadas, para responder ao tema "squads orientados por agentes". **Quem usa o fluxo:** qualquer membro do squad que cria com IA (produto, design, dev); na demo, um dev. **Quem governa:** o coordenador do squad (Cord+). **Unidade de valor:** o squad, com métrica de reuso entre papéis. A demo mostra um dev reaproveitando uma skill criada por um PM de outra squad. A solução se acopla a qualquer agente que suporte MCP (Claude Code, Copilot e outros), então vale para todos os papéis. Dependência para piloto: o Copilot corporativo do Itaú precisa ter MCP liberado nas políticas internas. | 26/09/2026 |
| D-19 | Stack de IA e busca. **LLM:** Claude via API, modelo `claude-opus-5`, SDK oficial `anthropic` em Python, com esforço (`effort`) ajustado por rota: `low` para reconhecer intenção e ranquear semelhança, `medium` a `high` para validador e adaptação. Respostas estruturadas por schema. Fallback do servidor ligado para recusas. **Busca:** sem embeddings no MVP. Com 15 a 20 ativos, o back-end filtra por visibilidade e o LLM ranqueia e justifica. Em escala, entra pgvector no Supabase para pré-filtrar. **Banco:** Supabase (já previsto no compose). Se a latência atrapalhar a demo, o time decide trocar de modelo ou baixar o esforço; o fallback gravado (RNF-04) cobre falhas. Fecha A-09. | 26/09/2026 |
| D-20 | Harness do time: plugin `harness-hacka` (repositório público `vicente-magalhaes/harness-hacka`). Injeta o resumo da memória no início de cada sessão, registra o diário por sessão, faz housekeeping com subagente e só deixa uma decisão virar aceita quando uma pessoa digita `accept NNNN`. A memória segue em `memoria/` e as decisões seguem nesta tabela. Motivo (Vicente): guardar o que cada sessão aprendeu e limpar o que envelhece sem depender de disciplina manual; é também um exemplo de ativo que iria para o Itaú House. Pendente: confirmar com a organização se o harness conta como elemento pré-existente (ver 01, propriedade intelectual). | 26/09/2026 |
| D-21 | Papéis. **Bruno:** produto e camada de IA (roteiro da demo, catálogo fictício, busca, validador, plugin). **Vicente:** back-end, MCP, banco e deploy, com Devin. **Alexandre:** front-end. **JP:** apresentação e evidência (prazo, entrevista, slides, ficha, pitch, vídeo). Cada task tem dono e validador diferentes. Tasks e ordem em [KANBAN.md](../KANBAN.md). Fecha A-11. | 26/09/2026 |
| D-22 | Banco: Supabase na nuvem, um projeto só para dev e produção. Sem Supabase local. Motivo (Vicente): todos os dados são fictícios, inclusive em produção, e o MVP precisa estar online para os gestores acessarem. Controle: estrutura só por migração versionada e seed no repo, para recriar o banco do zero. | 26/09/2026 |
| D-23 | Vídeo demo (T-30) inteiro com o Bruno: roteiro, gravação, narração, edição e publicação. Motivo: experiência com o próprio canal no YouTube. JP valida. Ajusta D-21. | 26/09/2026 |
| D-24 | `memoria/` guarda só o que muda e envelhece: tese (04), decisões e pendências (05), brainstorm (09) e o diário das sessões. A referência estável, com fonte, vai para `docs/` com o mesmo nome: regulamento (01), enunciado (02), evidências (03), formato da PRD (06), identidade visual (07) e equipe (08). Motivo (Vicente): parte da memória era documento, não nota que o harness precisa revisar. Critério: o que envelhece fica em `memoria/`; o que não vence vai para `docs/`. Os documentos numerados de `docs/` continuam internos (D-09). | 26/09/2026 |
| D-25 | Métrica principal de impacto: **retorno de tempo**. Horas economizadas = reusos de um ativo × horas que levou para criá-lo, convertidas em reais pelo custo-hora. No evento, o valor é estimado sobre o catálogo fictício e premissas declaradas; só um piloto mede. Motivo: pergunta de dois mentores de produto (F5 em [docs/03](../docs/03-evidencias-pesquisa.md)); responde às dicas 5 e 6 do guia dos mentores. Conta, exemplo e limites em "Métrica de impacto", abaixo. Fecha A-07. | 26/09/2026 |
| D-26 | Governança em três tempos. **No MVP**, uma pessoa decide o que entra no hub: o coordenador do squad aprova ou devolve (D-13). Na narrativa, quem decide são gestores, o mesmo perfil de quem avalia a banca. Regra simples fica com código, sem IA: chave vazada, CPF, e-mail, README e autor são checagens fixas (RF-14). **Durante o MVP**, cada aprovação e devolução vira dado (RF-22, RNF-01). **Depois**, como próximo passo e fora do MVP, esse histórico serve para construir um agente de julgamento, que avalia sozinho se um ativo entra. Motivo: responde "quais decisões ficam humanas" (lacuna em docs/03) e a dica 7 do guia dos mentores. Não muda a D-13: no MVP, nada é publicado sem o coordenador. | 26/09/2026 |
| D-27 | O guia de dicas dos mentores ([docs/10](../docs/10-guia-dicas-mentores.md)) é a referência principal das perguntas de preparação da banca. Motivo (Vicente): veio direto dos mentores. As perguntas parecidas em outros arquivos continuam; se divergirem, vale o guia. | 26/09/2026 |
| D-28 | Front da demo em `frontend/`. O esboço de `web/` migrou para lá e `web/` saiu do repo. Telas em JSX, como os componentes do design system, sobre a base de `frontend/` (React 19, Vite 8, TypeScript com `allowJs`, Docker e nginx). Layout no estilo do Reddit: feed com "Gostei" e ordens Em alta (curtidas + instalações), Mais curtidos e Novos. Números detalhados (derivações, squads que usaram, histórico) saem do feed e do post e vão para uma área só do Cord+ (`#/coord/dados`); feed e post mostram curtidas e instalações. Motivo (Alexandre): o catálogo parecia uma loja, não um fórum, e os dados pesavam na tela de quem só quer achar e reusar. Ajusta D-15 (a visão do gestor passa a ter a área de dados, além da fila) e afeta RF-22 e RF-30, que pedem trilha e contadores na página do post: confirmar com o time. | 26/09/2026 |

## Em aberto

| # | Pergunta | Notas |
|---|---|---|
| A-05 | Qual a diferença para um repositório no GitHub e para o catálogo de skills homologadas que já existe? | Ver candidatas abaixo. Crítico para o critério de inovação. |
| A-06 | Como produto, design e risco entram depois do dev? | Em grande parte coberto por D-18: qualquer papel do squad usa o fluxo. Falta só a resposta curta para a banca (T-33). |
| A-08 | Nome final do produto. | "Itaú House" é provisório. |
| A-10 | Quem de fora do time testa o fluxo, e quando? | Obrigatório registrar pelo menos um teste com conclusão. |
| A-13 | Conversar com um dev do Itaú no evento. | Em andamento: o time está buscando um dev. Lacuna principal de evidência. |
| A-17 | Onde hospedar o MVP para os gestores acessarem? | Provável: Vercel e/ou Render (Vicente, 26/09). Precisa de link que abre sem login (ver 01). |

## Checklist de desenho do MVP (exigências do Case C)

O fluxo do MVP (D-12) precisa responder:
- Entrada definida: o que o dev ou a squad fornece?
- Trabalho do agente: o que ele faz e com quais limites?
- Revisão humana: quem decide e em que ponto?
- Resultado registrado: o que fica gravado e quem consulta depois?
- Caso normal e caso incompleto ou incorreto: o que acontece em cada um?
- Comparação: como a mesma tarefa é feita hoje, sem a solução?
- O que é real e o que é simulado?

## Diferenciação (A-05): candidatas **(sugestão Claude)**

Hipóteses para o time validar. Nenhuma foi testada.
- **Proativo:** o aviso chega no fluxo de trabalho do dev. Um repositório exige que ele saiba que deve procurar.
- **Vai além de código:** cobre agentes, skills, prompts e frameworks, não só repositórios.
- **Governança embutida:** critérios de entrada, curadoria, visibilidade e trilha de quem publicou, aprovou e reaproveitou.
- **Cross-squad e agnóstico de ferramenta:** reúne ativos feitos com Copilot, Claude ou GPT.
- Antes de afirmar que é inédito, verificar análogos: portais internos de desenvolvedor (ex.: Backstage, do Spotify), catálogos de agentes de plataformas corporativas e o catálogo de skills homologadas do próprio Itaú.

## Métrica de impacto (D-25)

Formato da dica 6 do [guia dos mentores](../docs/10-guia-dicas-mentores.md): uma métrica principal, fatores que ajudam a melhorá-la e limites que não podem piorar.

**Principal: horas economizadas, em reais.**
- Conta: para cada ativo, reusos × horas que levou para criá-lo. Em reais, × custo-hora.
- Exemplo ilustrativo, com premissas do time (sem fonte): um plugin criado em 2 h e reutilizado por 6 pessoas poupa 12 h. Um estagiário custa cerca de R$ 3.600 por mês com benefícios, com 6 h por dia e 20 dias úteis, o que dá R$ 30/h. Resultado: R$ 360, com um ativo numa squad.
- O custo-hora de estagiário é escolha conservadora. Com mais ativos e mais squads, a economia cresce. Isso é hipótese, não resultado.
- No evento, é estimado sobre o catálogo fictício. Medido, só num piloto.

**Fatores e limites (sugestão Claude).** Como no exemplo do guia (reduzir golpe sem bloquear transação legítima): aumentar o reuso sem deixar passar segredo e sem travar quem publica. Indicadores da PRD, seção 11:
- Fatores que ajudam: taxa de reaproveitamento, reuso entre papéis, precisão da sugestão.
- Limites que não podem piorar: tempo até publicar; segredo ou dado pessoal publicado, que precisa ficar em zero (este é novo, não está na PRD).

**Limites da conta (sugestão Claude):**
- É teto, não média. Supõe que cada pessoa que reusou teria criado o ativo do zero, no mesmo tempo, e que reusar não custa nada.
- Conta mais justa: reusos × (horas para criar − horas para adaptar) − horas do coordenador aprovando.
- De onde vem o tempo de criação: hoje é premissa (a PRD fala em entrevista). Num piloto, o autor declara ao publicar e quem reusa confirma quanto poupou. Fora do escopo do MVP.

## Decisões que devem continuar humanas

Posição do time em D-26. Ninguém do Itaú foi ouvido sobre isso (F1 não respondeu), então é proposta, não evidência.
- O dev decide se reaproveita ou não. O agente só sugere e mostra por que achou parecido.
- No MVP, uma pessoa aprova a entrada de um ativo no hub: o coordenador do squad (D-13).
- O dono do ativo define quem pode ver.
- Nada vai para produção sem os gates que o Itaú já tem.
- Regra simples é código, não IA: chave, CPF, e-mail, README e autor (RF-14). A IA fica com o que pede julgamento, como informação interna ou escopo (dica 7 do guia dos mentores).
- Cada aprovação e devolução vira dado; a devolução já exige comentário (RF-21). Depois do MVP, esse histórico serve para construir um agente de julgamento que decide a entrada sozinho. Pergunta provável da banca: R-09.

## Riscos e perguntas prováveis da banca

Referência principal para preparar as respostas: o [guia dos mentores](../docs/10-guia-dicas-mentores.md) (D-27).

| # | Risco ou pergunta | Resposta ou controle possível |
|---|---|---|
| R-01 | "Isso já existe." O Itaú tem skills homologadas (F1), e o regulamento exige solução inédita (1.3). | Diferenciação clara (A-05). Mostrar o que o catálogo atual não faz. |
| R-02 | "É só um GitHub ou uma wiki." | Demonstrar o aviso proativo no fluxo do dev. |
| R-03 | Vazamento: um ativo publicado carrega segredo ou dado sensível. | Verificação na entrada, visibilidade por nível, aprovação humana. |
| R-04 | O agente erra: aponta algo que não é parecido, ou não vê o que é. | O agente só sugere, com justificativa rastreável. O dev decide. Medir a precisão. |
| R-05 | Ninguém publica (catálogo vazio). F1: soluções que dependem de disciplina manual repetem o problema. | Publicar precisa ser efeito colateral do trabalho, não tarefa extra. |
| R-06 | Evidência fraca: poucas conversas, nenhum dev. | Apresentar como hipótese. Mostrar o plano de validação. |
| R-07 | A ferramenta oficial é o Copilot; Claude está em homologação. | Solução agnóstica de ferramenta. |
| R-08 | Escopo grande demais para ~10 h. | Uma persona, uma tarefa, um fluxo funcionando. O resto simulado ou como próximo passo. |
| R-09 | "No futuro, então, a IA aprova sozinha?" Tensiona com o tema do Case C, a decisão humana (D-26). | **(sugestão Claude)** A autonomia vem com número. O agente de julgamento roda ao lado do coordenador e só passa a aprovar sozinho quando concorda com ele numa taxa alta e medida. Mesmo assim, só nos casos de baixo risco (alcance squad, checagens fixas limpas). O resto continua com uma pessoa, que audita por amostragem. |
| R-10 | "De onde vêm as 2 horas e os R$ 3.600?" (D-25) | Premissas do time, ditas como premissas. O custo-hora de estagiário é conservador. Num piloto, o tempo vem do autor e de quem reusa (ver "Métrica de impacto"). |
