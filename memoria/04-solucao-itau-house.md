# Solução: Itaú House (tese atual do time)

Status: tese em construção, 26/09/2026. Nome provisório.
Decisões fechadas e pendentes ficam em [05-decisoes-e-pendencias.md](05-decisoes-e-pendencias.md).

## Em uma frase

Um fórum interno em que as squads do Itaú publicam e reaproveitam agentes, skills, frameworks, componentes e esqueletos de código, com governança sobre o que entra e quem vê.

## Problema que ataca

- Retrabalho: squads constroem o que outra squad já construiu.
- Agentes duplicados: pessoas recriam agentes que já existem, ou não conseguem criar o que outro já tem.
- Falta de visibilidade: ninguém sabe o que cada um está usando (F2).
- Perda de conhecimento entre times (F1).
Evidências em [03-evidencias-pesquisa.md](03-evidencias-pesquisa.md).

## Persona inicial: dev

- Escolhida por ser a mais afetada pelo retrabalho (F3).
- É onde o MVP dá mais aprendizado com menos esforço.
- Cena de uso: o dev está desenvolvendo, ou revisando código feito com agente, e não sabe que outra squad já fez algo parecido.
- Pendente: qual dev exatamente (front, back, tech lead?) e em que momento (antes de codar, no PR, na revisão?).

## Mecanismos descritos pelo time

1. **Aviso de duplicidade:** um agente avisa o dev que já existe algo parecido em outra squad e aponta o ativo.
2. **Publicação com governança:** a squad publica um ativo no Itaú House. O ativo precisa cumprir requisitos para entrar. A verificação é feita por um agente, por um humano curador, ou pelos dois.
3. **Visibilidade controlada:** nem tudo pode ser visto por todos. Nem todo agente que alguém criou pode ser acessado por outros.

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
- Perguntas que a solução precisa responder:
  - Quais requisitos um ativo precisa ter para entrar?
  - Quem aprova: agente, humano ou os dois?
  - Quem pode ver cada ativo? Por squad, por frente, banco inteiro?
  - Como impedir que um ativo carregue dado sensível ou segredo?
  - Como rastrear quem publicou, quem aprovou e quem reaproveitou?
- Limites do case: não conectar a sistemas reais do banco; nada vai para produção sem humano.

## Produtização aplicada a nós mesmos (narrativa)

- Estamos aplicando o ciclo de produto dentro do próprio Itaú.
- Começamos por uma dor específica de uma persona (dev). Validamos. Depois expandimos.
- MVP no sentido de Lean: mínimo esforço para o máximo de aprendizado.
- Liga com o enunciado: squad orientada por IA que entrega mais rápido sem perder governança.

## Expansão (próximos passos, não entram no MVP)

1. Dev (MVP).
2. Outras personas da squad: produto, design, risco. Como elas entram no Itaú House: **pendente**.
3. Finanças: visão cross-squad do uso de agentes (F2).
4. Conhecimento executivo: notebooks, PPTs e atas, como os de Pagamentos (F1).

Motivo da ordem: a dor do dev parece mais latente e tem o maior retorno de tempo para um MVP.

## Pontos que o time ainda precisa resolver

- Por que isso é diferente de um repositório no GitHub?
- Por que é diferente do catálogo de skills e agentes homologados que já existe no Itaú (F1)?
- Como o dev entra primeiro e depois produto, design e os demais?
Candidatas a resposta, ainda não decididas, em [05-decisoes-e-pendencias.md](05-decisoes-e-pendencias.md).

## Teses descartadas (não retomar sem decisão do time)

- **Esteira de validação ponta a ponta** (tese inicial do Vicente): agentes da ideação ao deploy, medindo aderência real contra métricas de vaidade. Descartada porque boa parte da medição já existe no Itaú (árvore de indicadores, dashboards, IA de sentimento) e não se confirmou dor nessa etapa.
- **Copiloto de governança** (classificar o grau da gestão de mudança), **discovery em horas** (automatizar o SVM) e **loop fechado** (confrontar resultado com hipótese): ideias levantadas após a conversa com F1. Não seguidas.
- **Chatbot para cliente final:** fora. O Itaú já tem o Íai.
