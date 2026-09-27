---
status: accepted
date: 2026-09-26
decided_by: time
supersedes: []
superseded_by: []
---

# 0025: Métrica principal: retorno de tempo

## Rule

- Métrica principal: horas economizadas = reusos × horas para criar o ativo, em reais pelo custo-hora. No evento é estimada; só um piloto mede.

## Decision

Métrica principal de impacto: **retorno de tempo**. Horas economizadas = reusos de um ativo × horas que levou para criá-lo, convertidas em reais pelo custo-hora. No evento, o valor é estimado sobre o catálogo fictício e premissas declaradas; só um piloto mede. Motivo: pergunta de dois mentores de produto (F5 em `docs/03`, removido); responde às dicas 5 e 6 do guia dos mentores. Conta, exemplo e limites em "Métrica de impacto", abaixo. Fecha A-07.

## Métrica de impacto

Formato da dica 6 do guia dos mentores (`docs/10`, removido): uma métrica principal, fatores que ajudam a melhorá-la e limites que não podem piorar.

- Conta: para cada ativo, reusos × horas que levou para criá-lo. Em reais, × custo-hora.
- Exemplo ilustrativo, com premissas do time (sem fonte): um plugin criado em 2 h e reutilizado por 6 pessoas poupa 12 h. Um estagiário custa cerca de R$ 3.600 por mês com benefícios, com 6 h por dia e 20 dias úteis, o que dá R$ 30/h. Resultado: R$ 360, com um ativo numa squad.
- O custo-hora de estagiário é escolha conservadora. Com mais ativos e mais squads, a economia cresce. Isso é hipótese, não resultado.
- No evento, é estimado sobre o catálogo fictício. Medido, só num piloto.

Fatores, limites e ressalvas da conta, ainda como sugestão para o time, estavam em `05-pendencias-e-riscos.md` (removido).

## Origin

Era a D-25 na tabela "Decidido" da antiga `05-decisoes-e-pendencias.md`. Texto copiado sem mudança; o link foi ajustado para esta pasta. A seção "Métrica de impacto" veio da mesma nota.
