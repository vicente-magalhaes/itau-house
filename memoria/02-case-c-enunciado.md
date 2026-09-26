---
summary: "O que a organização pede no Case C, personas de exemplo"
read_when: "Desenho da solução e do fluxo"
review_by: 2026-10-01
---

# Case C: Jornada de agentes (enunciado e orientações da organização)

Fontes: regulamento 4.1.3, guia dos participantes (página do Case C), slides da abertura (apresentados por Rodrigo Terron, newhack).
Este arquivo registra o que a organização pede. A nossa resposta está em [04-solucao-itau-house.md](04-solucao-itau-house.md).

## Enunciado

"Como uma squad orientada por IA pode transformar ideias em valor para o cliente mais rapidamente, preservando qualidade, governança e decisões humanas relevantes?"

Slides: "Qualidade, governança e decisão humana fazem parte do trabalho."

## Definições da organização

- **Squad:** equipe com competências diferentes trabalhando num objetivo de produto.
- **Demanda:** passa por entendimento do problema, priorização, construção, teste e aprovação. Cada passagem pode gerar espera ou retrabalho.
- **Agente de IA:** componente que recebe um objetivo e executa tarefas dentro de limites definidos. Pode usar ferramentas. Pode errar.
- **Governança:** deixar claro quem pode fazer o quê, quem aprova e como verificar o que aconteceu.
- "Criar mais agentes não significa criar mais valor."

## O que esperam

- Um fluxo em que pessoas e IA trabalham juntas.
- Entrada definida, saída útil, ponto claro de revisão humana.
- Explicar quem usa a saída e como ela ajuda a squad a entregar algo melhor ao cliente final.
- Investigar **um** ponto de espera ou retrabalho. Não automatizar tudo.

## Perguntas que a organização sugere responder

- Qual tarefa consome tempo ou gera retrabalho? Como é feita hoje?
- O que a IA faz e qual decisão continua com uma pessoa?
- Como verificar uma resposta, rastrear a origem e corrigir um erro?
- O que acontece quando falta informação ou o agente ultrapassa o limite?

## Territórios sugeridos (não limitam a escolha)

- Organizar feedbacks para investigação.
- Transformar uma demanda em critérios de aceitação.
- Apoiar a preparação de testes.
- Verificar se uma proposta tem informação suficiente para revisão.

## O que demonstrar e como testar

- Mostrar: a entrada, o trabalho feito, a revisão humana e o resultado registrado.
- Testar um caso normal **e** um caso incompleto ou incorreto.
- Comparar tempo, qualidade ou retrabalho com a forma atual de fazer a mesma tarefa.
- Dizer o que foi medido e o que foi estimado.
- Um fluxo com um agente pode bastar.
- Proibido: conectar a sistemas reais do banco; aprovar mudança de produção automaticamente.
- A banca quer ver responsabilidades e limites, não só uma conversa com IA.

## Personas de exemplo (slides, fictícias)

"Quatro pessoas convivem com os agentes." Não são papéis obrigatórios. O benefício chega ao cliente final.

| Persona | Papel | O que quer |
|---|---|---|
| Daniela | Produto | Decidir com evidências prontas. Hoje gasta tempo em materiais de aprovação. |
| Aline | Design | Sintetizar pesquisas mais rápido sem perder a escuta do cliente. |
| Thiago | Engenharia | Delegar o repetitivo e manter o julgamento sobre arquitetura e risco. |
| Sérgio | Risco e conformidade | Participar desde o início e reconstruir cada decisão tomada por IA. |

Thiago é a persona mais próxima do nosso dev. Sérgio representa a governança que a nossa solução precisa atender.

## Exemplo de entrega dos slides

"Uma entrega para conectar a squad", exemplo: bloqueio e desbloqueio de cartão.

| Eixo | Pergunta |
|---|---|
| Decisão | Que evidência define a prioridade e quem aprova? |
| Construção | O que o agente produz e como a pessoa verifica? |
| Controle | Como registrar erros, limites e autorização para avançar? |

"Um fluxo prioritário funcionando. Outras etapas podem ser simuladas ou futuras."

## Mensagens-chave dos slides

- "Uma pessoa antes da ideia": quem ajudar, que problema faz parte do dia dela, o que mudaria.
- "Uma pessoa. Uma tarefa completa." Reconhecer (ouvir quem vive o problema), experimentar (construir o suficiente para testar uma hipótese), contar (para quem é e o que muda), compartilhar (aprendizado que continua).
- "Um teste que ajuda a decidir": alguém de fora do time tenta completar o fluxo. Onde travou, o que entendeu, se chegou ao resultado. O que o time mudou.
- Pergunta final: "Se isso funcionasse, o que mudaria no seu dia?"

## Frase de recorte (guia)

Completar e revisar a cada aprendizado:
"Queremos ajudar [pessoa] a [tarefa], quando [situação], porque hoje [dificuldade]. Saberemos que ajudamos se [mudança observável]."

Ao comparar caminhos, o guia pede: benefício para a pessoa, evidência disponível e viabilidade no evento. E perguntar se o problema se resolve com informação melhor, mudança na sequência de ações ou um controle mais simples, antes de criar funcionalidade nova.
