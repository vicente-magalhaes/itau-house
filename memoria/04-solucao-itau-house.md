---
summary: "Tese atual, persona, mecanismos, governança, expansão, teses descartadas"
read_when: "Tudo sobre o produto"
review_by: 2026-09-28
---

# Solução: Itaú House (tese atual do time)

Status: tese atual, 27/09/2026. Nome provisório (A-08).
Decisões ficam em [decisions/](decisions/README.md). Pendências e riscos, em [05-pendencias-e-riscos.md](05-pendencias-e-riscos.md).

## Em uma frase

Um fórum interno em que as squads do Itaú publicam e reaproveitam agentes, skills, frameworks, componentes e esqueletos de código, com governança sobre o que entra e quem vê.

## Problema que ataca

- Retrabalho: squads constroem o que outra squad já construiu.
- Agentes duplicados: pessoas recriam agentes que já existem, ou não conseguem criar o que outro já tem.
- Falta de visibilidade: ninguém sabe o que cada um está usando (F2).
- Perda de conhecimento entre times (F1).
Evidências em [03-evidencias-pesquisa.md](../docs/03-evidencias-pesquisa.md).

## Persona: membro do squad, com governança do coordenador (D-18)

Revisão de 26/09/2026. Quem usa o fluxo é qualquer membro do squad que cria com IA (produto, design, dev). Quem governa é o coordenador. A unidade de valor é o squad: uma skill que o PM criou pode servir ao dev, e vice-versa. Na demo, o usuário é um dev. O texto abaixo é o raciocínio original, focado em dev.


- Escolhida por ser a mais afetada pelo retrabalho (F3).
- É onde o MVP dá mais aprendizado com menos esforço.
- Cena de uso: o dev está desenvolvendo, ou revisando código feito com agente, e não sabe que outra squad já fez algo parecido.
- Resolvido pela 0018 e pela PRD: qualquer membro do squad que cria com IA; na demo, o Rafael, dev. O momento é quando a pessoa pede ao agente para criar um ativo (RF-03, RF-04) e, ao fim da tarefa, o convite a publicar (RF-13, RF-16).

## Mecanismos descritos pelo time

1. **Aviso de duplicidade:** um agente avisa o dev que já existe algo parecido em outra squad e aponta o ativo.
2. **Publicação com governança:** antes de qualquer pessoa ver, um validador de código, sem IA, confere chave, CPF, e-mail, telefone, README e autor (RF-14, 0026). Quem aprova é o coordenador do squad (0013).
3. **Visibilidade controlada:** quem publica escolhe o alcance: squad, frente ou banco (0013). A busca só mostra o que a pessoa pode ver (RF-05).

O MVP demonstra o ciclo descoberta → publicação (D-12). Fluxos detalhados em [docs/fluxos.html](../docs/fluxos.html).

## Tipos de ativo que podem ser compartilhados

- Agentes.
- Skills.
- Frameworks.
- Componentes de design system.
- Esqueletos de código reaproveitáveis. Exemplo do time: um botão com a rota por trás, que outro time reaproveita.

## Governança e guard rails

- Começar pequeno por causa de governança e compliance. Esse é o argumento do recorte.
- Guard rails foram citados por F1 e F2. O Itaú é conservador e já teve vazamento.
- Respostas do MVP: requisitos de entrada são checagens fixas por código (RF-14, 0026); quem aprova é o coordenador (0013), e o agente de julgamento só vem depois do MVP (0026); quem vê depende do alcance escolhido por quem publica (0013, RF-05); segredo e dado pessoal o validador barra e aponta onde (RF-14); o rastro fica na trilha (RF-22) e nos eventos de uso e derivação (RF-10, RF-30).
- Limites do case: não conectar a sistemas reais do banco; nada vai para produção sem humano.
- Evolução (D-26): no MVP, o coordenador decide e as checagens fixas são código, sem IA. Cada decisão vira dado. Depois do MVP, um agente de julgamento construído sobre esse histórico passa a avaliar a entrada.

## Produtização aplicada a nós mesmos (narrativa)

- Estamos aplicando o ciclo de produto dentro do próprio Itaú.
- Começamos por uma dor específica de uma persona (dev). Validamos. Depois expandimos.
- MVP no sentido de Lean: mínimo esforço para o máximo de aprendizado.
- Liga com o enunciado: squad orientada por IA que entrega mais rápido sem perder governança.
- O harness-hacka, usado pelo time para construir o Itaú House, é o primeiro ativo real do catálogo e passou pelo validador dele (0036).

## Expansão (próximos passos, não entram no MVP)

1. Dev (MVP).
2. Outras personas da squad: produto, design, risco. Pela 0018, quem cria com IA no squad já usa o mesmo fluxo; a demo mostra um dev. Falta a resposta curta para a banca (A-06, T-33).
3. Finanças: visão cross-squad do uso de agentes (F2).
4. Conhecimento executivo: notebooks, PPTs e atas, como os de Pagamentos (F1).

Motivo da ordem: a dor do dev parece mais latente e tem o maior retorno de tempo para um MVP.

## Pontos que o time ainda precisa resolver

- Por que isso é diferente de um repositório no GitHub?
- Por que é diferente do catálogo de skills e agentes homologados que já existe no Itaú (F1)?
- Como o dev entra primeiro e depois produto, design e os demais?
Candidatas a resposta, ainda não decididas, em [05-pendencias-e-riscos.md](05-pendencias-e-riscos.md).

## Teses descartadas (não retomar sem decisão do time)

- **Esteira de validação ponta a ponta** (tese inicial do Vicente): agentes da ideação ao deploy, medindo aderência real contra métricas de vaidade. Descartada porque boa parte da medição já existe no Itaú (árvore de indicadores, dashboards, IA de sentimento) e não se confirmou dor nessa etapa.
- **Copiloto de governança** (classificar o grau da gestão de mudança), **discovery em horas** (automatizar o SVM) e **loop fechado** (confrontar resultado com hipótese): ideias levantadas após a conversa com F1. Não seguidas.
- **Chatbot para cliente final:** fora. O Itaú já tem o Íai.
