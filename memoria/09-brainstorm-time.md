# Brainstorm do time (Bruno, 26/09/2026)

Rascunho de ideias do Bruno, pensando nos seis blocos dos slides.
**Nada aqui é decisão.** Decisões ficam em [05-decisoes-e-pendencias.md](05-decisoes-e-pendencias.md).

## Persona, mais afiada

- Dev que usa agentic coding para decidir, construir código e revisar.
- Depois de semanas desenvolvendo, descobre que outra pessoa já tinha feito algo parecido e passado pelos mesmos problemas.
- **Dev estacionado:** perde mais tempo montando automação, personalizando agentes e criando skills do que executando a tarefa.
- Na prática, a dor atinge qualquer pessoa do Itaú que usa IA no dia a dia. O dev é o recorte.

## Evidências citadas

| Item | Situação |
|---|---|
| Benchmark e entrevista com diretor ("bench do centão") | **Fonte não registrada em [03](03-evidencias-pesquisa.md).** Registrar quem, quando, alcance e limite antes de citar. |
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
- **Agentes avaliadores antes da publicação:** uma leva de agentes confere se o ativo respeita os guard rails. Um coordenador humano dá a aprovação final ("coordenador só aprova"). Liga A-03.

## Risco e escala

- Principal risco: publicar ativo que foge dos guard rails. Controle: agentes avaliadores + aprovação humana (liga R-03).
- Para escalar: entender a estrutura interna e as restrições de compartilhamento entre gerências (liga A-04).

## Próximos passos levantados

- Operar em escala sem perder governança.
- Cultura de uso: reconhecimento, casos de uso, como convidar todo mundo.
- Mapear os processos e colocá-los dentro dos guard rails.

## Tensões para o time resolver

1. **A dor é mesmo retrabalho?** Na nota sobre análise exploratória de dados (EDA): "hoje ele não enfrenta tanto problema de retrabalho, a IA consegue fazer boa parte". Isso enfraquece a tese central (D-03). Alternativa que aparece no próprio brainstorm: a dor é **processo e padronização**, ou seja, obrigatoriedades, testes, dinâmica de repo e regras de negócio que cada dev reconfigura no seu agente. Registrado como A-14.
2. **Exemplos para impacto na banca ≠ evidência.** Mostrar skills que "poderiam estar lá" funciona como storytelling. Precisa aparecer como simulação, não como uso real.
3. **Gamificação e visão do gestor aumentam escopo** e levantam risco de percepção de vigilância. Registrado como A-15.
4. **Usabilidade:** o foco é criar ou publicar? Como gerar os gatilhos (hooks) para publicar sem esforço extra? Liga R-05.
