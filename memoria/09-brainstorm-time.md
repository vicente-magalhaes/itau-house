---
summary: "Ideias do time ainda não decididas: persona afiada, mecanismos novos, tensões"
read_when: "Desenho da solução, slides"
review_by: 2026-09-28
---

# Brainstorm do time (Bruno, 26/09/2026)

Rascunho de ideias do Bruno, pensando nos seis blocos dos slides.
**Nada aqui é decisão.** Decisões ficam em [decisions/](decisions/README.md).

## Persona, mais afiada

- Dev que usa agentic coding para decidir, construir código e revisar.
- Depois de semanas desenvolvendo, descobre que outra pessoa já tinha feito algo parecido e passado pelos mesmos problemas.
- **Dev estacionado:** perde mais tempo montando automação, personalizando agentes e criando skills do que executando a tarefa.
- Na prática, a dor atinge qualquer pessoa do Itaú que usa IA no dia a dia. O dev é o recorte.

## Evidências citadas

| Item | Situação |
|---|---|
| Benchmark e entrevista com diretor ("bench do centão") | **Fonte não registrada em [03](../docs/03-evidencias-pesquisa.md).** Registrar quem, quando, alcance e limite antes de citar. |
| Discovery com os mentores | Já consta como F4. |
| Métricas acionáveis (velocidade e qualidade) | Conhecimento do time, não é evidência. Serve para o modelo de mensuração. |

## Proposta de valor (rascunho)

"Para devs que usam agentic coding e sofrem com retrabalho, FOMO, falta de inovação e uso despadronizado de agentes, por falta de regras específicas e de integração entre agentes, o Itaú House oferece uma rede de conhecimento, integração e interação atraente o bastante para as pessoas quererem participar."
A causa ("falta de regras específicas e integração") ainda precisa ser refinada.

## Ideias de mecanismo novas

Não constam em [04](04-solucao-itau-house.md). Candidatas, não escopo do MVP.
- **Avaliação:** upvote e downvote em cada skill ou agente.
- **Conta obrigatória para publicar.** Garante autoria.
- **Visão do gestor:** quantas e quais pessoas usam os ativos que cada funcionário publicou. Base para incentivo.
- **Status e reconhecimento:** contagem de uso e ranking viram meta a atingir e status a manter. "Skill do Ano".
- **Agentes avaliadores antes da publicação:** uma leva de agentes confere se o ativo respeita os guard rails. Um coordenador humano dá a aprovação final ("coordenador só aprova"). Resolvido em 0013 e 0026: no MVP, validador de código sem IA e aprovação do coordenador; agente de julgamento só depois do MVP.

Situação em 27/09: a avaliação virou só "Gostei" (0028); ranking pela 0015; visão do gestor pela 0028; avaliação antes de publicar pela 0026. Downvote, "Skill do Ano" e incentivo não constam da PRD nem das decisões.

## Risco e escala

- Principal risco: publicar ativo que foge dos guard rails. Controle: agentes avaliadores + aprovação humana (liga R-03).
- Para escalar: entender a estrutura interna e as restrições de compartilhamento entre gerências (A-04 fechada na 0013: quem publica escolhe o alcance).

## Próximos passos levantados

- Operar em escala sem perder governança.
- Cultura de uso: reconhecimento, casos de uso, como convidar todo mundo.
- Mapear os processos e colocá-los dentro dos guard rails.

## Tensões para o time resolver

1. **A dor é mesmo retrabalho?** Resolvido em D-16: sim. A nota do EDA quis dizer que a pessoa já tem as skills dela; o compartilhamento é que é manual.
2. **Exemplos para impacto na banca ≠ evidência.** Mostrar skills que "poderiam estar lá" funciona como storytelling. Precisa aparecer como simulação, não como uso real.
3. **Gamificação e visão do gestor.** Resolvido em D-15 e ajustado na 0028: ranking por curtidas e instalações; o gestor vê a fila de aprovação e a área de dados (#/coord/dados).
4. **Usabilidade:** o foco é criar ou publicar? Como gerar os gatilhos (hooks) para publicar sem esforço extra? Liga R-05. Resolvido na PRD: o hook detecta o ativo novo ao fim da tarefa e convida a publicar (RF-11, RF-13, RF-16).
