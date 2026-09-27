---
status: proposed
date: 2026-09-27
decided_by:
supersedes: []
superseded_by: []
---

# 0036: Harness-hacka no catálogo como ativo real, com o autor real

## Rule

- O `harness-hacka` é o primeiro ativo real do catálogo (`a-harness-hacka`): arquivos idênticos ao commit do repositório público, autor e aprovação reais (Vicente Magalhães, squad "Itaú House · Hackathon", nome e foto com consentimento) e números reais, começando em zero. O resto do catálogo continua fictício (0007).

## Context

A 0020 já dizia que o harness "é também um exemplo de ativo que iria para o Itaú House". Em 27/09, o Vicente pediu que ele fosse o primeiro plugin real disponível no catálogo, e que funcionasse.

Conferido no mesmo dia:
- o validador do Itaú House aprova os 40 arquivos do plugin (140 KB);
- os arquivos lidos pela API são idênticos ao commit `6f35354` do repositório público;
- instalado a partir deles, o `init` e o hook de início de sessão funcionam (`backend/tests/test_harness_real.py`);
- o `claude plugin validate` passa, com um aviso: o `plugin.json` não declara versão.

Requisitos: RF-17, RF-27, RF-29, RNF-02 e RNF-03.

## Options

### Autor real, na squad do time, com a aprovação dele

Escolhida. O Vicente entra no seed como pessoa real (`u-vicente`), Cord+ da squad nova "Itaú House · Hackathon", frente "Hackathon". Ele envia e aprova o próprio ativo: foi ele quem decidiu publicar. Nome e foto com o consentimento dele. A foto sai sem metadados (a original tinha a localização GPS). Os contadores começam em zero, e o texto do post diz que o ativo é real.

### Persona fictícia (Camila Duarte) como quem publica

Descartada porque mentiria sobre a autoria. Foi a primeira versão do brief da DV-9.

### Aprovação simulada por uma coordenadora fictícia

Descartada porque inventaria uma aprovação sobre algo real. A regra de não inventar aprovações pesa mais num ativo real do que nos fictícios.

### Publicado sem aprovação

Descartada porque contraria a 0013 e a RNF-02: nada é publicado sem o coordenador.

## Consequences

Boas: o catálogo tem um ativo que instala e funciona de verdade, e a tese do harness vira demonstração: o plugin que ajudou a construir o Itaú House passou pelo validador dele. O ativo sobrevive ao reset, porque está no seed, e a busca o encontra.

Ruins, e aceitas:
- É autoaprovação, e a banca pode perguntar. Resposta: no time do hackathon não há outro coordenador; no banco, a fila exige o Cord+ do squad.
- Nome e foto reais no seed e na tela. É exceção à 0007 e à regra de nomes reais do `.claude/rules/security.md`, que ganha essa ressalva. Vale só para quem consente e é autor de um ativo real.
- `GET /api/usuarios` passa a devolver 21 pessoas, e o teste mudou.
- A A-18 (o harness conta como elemento pré-existente?) continua aberta. A declaração de uso de IA (T-34) precisa citar o harness.

## Revisit when

- A organização disser que dado real de participante não pode aparecer no protótipo.
- Outra pessoa real do time aceitar aprovar o ativo: aí a autoaprovação sai.
- O harness mudar de versão: rodar de novo o `supabase/empacotar_harness.py` e o gerador do seed.
