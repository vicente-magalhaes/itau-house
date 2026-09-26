# Decisões, pendências e riscos

Registro vivo. Ao decidir algo, mover de "Em aberto" para "Decidido" com data.
Itens marcados **(sugestão Claude)** são propostas para o time avaliar, não decisões.

## Decidido

| # | Decisão | Data |
|---|---|---|
| D-01 | Case C, Jornada de agentes. Confirmado pela organização. Troca não é permitida. | antes do evento |
| D-02 | Solução: Itaú House, fórum de reuso de ativos (agentes, skills, frameworks, componentes, esqueletos de código) entre squads. | 26/09/2026 |
| D-03 | Persona inicial: dev. É a mais afetada por retrabalho e dá o MVP de maior aprendizado. | 26/09/2026 |
| D-04 | Argumento do recorte: começar pequeno por governança e compliance, depois expandir. | 26/09/2026 |
| D-05 | Expansão fica como próximos passos: produto, design e risco → Finanças → conhecimento executivo (notebooks, PPTs). | 26/09/2026 |
| D-06 | A PRD não é entregável, mas será escrita, objetiva e focada em requisitos e stack, como contexto para os agentes de desenvolvimento. Ver [06-prd-e-stack.md](06-prd-e-stack.md). | 26/09/2026 |
| D-07 | Só dados fictícios. Integrações simuladas ficam marcadas como simuladas em tela, vídeo e slides. | regra do evento |
| D-08 | Git: só `main` e branches de trabalho (`feat/`, `fix/`). Cada um faz merge direto da própria branch na `main`, sem `dev` e sem Pull Request, por agilidade. O Claude pode dar push (liberado em `.claude/settings.json`). | 26/09/2026 |
| D-10 | Formato da banca: 3 min de pitch, 2 min de vídeo demo, 2 min de perguntas. | 26/09/2026 |
| D-09 | Repositório privado durante o desenvolvimento. Antes da banca, limpar para ficar só o código e uma apresentação enxuta. | 26/09/2026 |
| D-11 | Ambiente em Docker Compose: modo dev com hot reload e build de produção (nginx), indicado para a demo. CI sobe os dois modos a cada push. Motivo (Vicente): mostrar maturidade técnica, porque pode haver gestor de tecnologia na banca. | 26/09/2026 |
| D-12 | MVP demonstra o ciclo descoberta → publicação (fluxos 02 e 03 de `docs/fluxos.html`), com front mínimo: página do post e fila de aprovação. O resto fica simulado ou como próximo passo. Fecha A-01. | 26/09/2026 |
| D-13 | Nada é publicado sem aprovação do coordenador (Cord+), que pode delegar. Antes dele, um agente validador confere segredos, dado sensível, README, dono e escopo. Se barrar, explica o motivo e como corrigir. Quem publica escolhe o alcance (squad, frente ou banco). Fecha A-03 e A-04. | 26/09/2026 |
| D-14 | O dev escolhe o modo do plugin: proativo, perguntar antes ou sob demanda (`/itau-house`). Motivo: busca automática pode soar invasiva para parte das pessoas. O aviso aparece no agente de código do dev, ao reconhecer a intenção de criar um ativo. Fecha A-02. Modo padrão: em aberto (A-16). | 26/09/2026 |
| D-15 | Ranking por popularidade: curtidas e instalações. Derivações ("derivado de") contam como reuso e dão crédito ao autor original. Sem "algoritmo do X" no MVP. Visão do gestor limitada à fila de aprovação. Fecha A-15. | 26/09/2026 |
| D-16 | A dor segue sendo retrabalho. O caso da análise exploratória de dados (EDA) mostra que o compartilhamento de skills hoje é manual: a pessoa só não sofre porque já tem as próprias skills. A demo usa casos reais de retrabalho recorrente, apresentados como simulação. Fecha A-14. | 26/09/2026 |

## Em aberto

| # | Pergunta | Notas |
|---|---|---|
| A-05 | Qual a diferença para um repositório no GitHub e para o catálogo de skills homologadas que já existe? | Ver candidatas abaixo. Crítico para o critério de inovação. |
| A-06 | Como produto, design e risco entram depois do dev? | Fica como próximo passo, mas a banca pode perguntar. |
| A-07 | Quais métricas prometemos e como medimos no evento? | Ver candidatas abaixo. Separar medido de estimado. |
| A-08 | Nome final do produto. | "Itaú House" é provisório. |
| A-09 | Stack. | Ver [06-prd-e-stack.md](06-prd-e-stack.md). Ambiente decidido (D-11). O esqueleto do Docker usa a stack prevista no README: FastAPI + uv no back, React + Vite no front. Trocar de stack exige ajustar os Dockerfiles. Banco, LLM e busca seguem em aberto. |
| A-10 | Quem de fora do time testa o fluxo, e quando? | Obrigatório registrar pelo menos um teste com conclusão. |
| A-11 | Divisão de papéis. | Nomes confirmados em 26/09 (grupo 4). Papéis ainda abertos. Ver [08-equipe.md](08-equipe.md). |
| A-13 | Conversar com um dev do Itaú no evento. | Em andamento: o time está buscando um dev. Lacuna principal de evidência. |
| A-16 | Qual o modo padrão do plugin? | **(sugestão Claude)** perguntar antes: respeita quem acha invasivo e ainda mostra o valor proativo na demo. |

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

## Métricas: candidatas (A-07) **(sugestão Claude)**

- % de novas demandas em que o agente encontrou ativo reaproveitável.
- Taxa de reuso dos ativos publicados.
- Horas de retrabalho evitadas. No evento será estimado, não medido.
- Tempo de aprovação de um ativo.
- % de ativos barrados na entrada, e por quê. Mostra que a governança funciona.
- Precisão do aviso: quantos avisos o dev considerou úteis.

## Decisões que devem continuar humanas

Candidatas, inferidas das conversas. F1 não respondeu diretamente.
- O dev decide se reaproveita ou não. O agente só sugere e mostra por que achou parecido.
- Um humano aprova a entrada de um ativo no catálogo.
- O dono do ativo define quem pode ver.
- Nada vai para produção sem os gates que o Itaú já tem.

## Riscos e perguntas prováveis da banca

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
