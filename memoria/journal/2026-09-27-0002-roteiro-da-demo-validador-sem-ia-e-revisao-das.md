---
author: Bruno (sessão com Claude)
status: partial
decisions: [0026, 0030]
---

# Roteiro da demo, validador sem IA e revisão das tasks do Bruno

## Changes

- `docs/roteiro-demo.md` (T-02): versão curta em tabela. Abertura e fecho animados; cenas 1 e 2 em tela real; fecho termina com "próximo passo: um validador que aprende com cada decisão da coordenadora".
- PRD (glossário, RF-14, camada de IA, real e simulado) e T-11 alinhados à 0026: validador só por código.
- `513cc66`: validador aceita valor de exemplo (`<sua chave>`) e domínio fictício (`.test`, `ficticio.com.br`); Cord+ vê os ativos em aprovação do próprio squad (`catalogo.visivel`).
- Revisão das tasks da sessão paralela (T-03, T-04, T-05, T-10, T-11): contrato e schema conferem. Chamada do Claude na busca conferida contra a doc e o SDK 1.8.0.
- Animações de abertura (6 s) e fecho (20,5 s) em `~/Desktop/itau-house-video/`, fora do repo (HyperFrames).

## Why

A cena 2 ao vivo quebrava em dois pontos do validador e a fila da Juliana dava 404. O time tirou a IA do validador (0026) para dar o julgamento ao coordenador.

## Dead ends

- Roteiro longo, com fecho explicando o que é simulado → confuso e tirava valor da entrega. **Lesson:** roteiro em tabela curta; limitação vira próximo passo, numa linha.
- Fecho animado com seis etapas em 20 s → confuso pelo tamanho, o começo não se entende. **Lesson:** animação de fecho com uma ideia só; o Bruno vai usar só o trecho final.
- Validador mandava documentar a variável no README, e o exemplo barrava de novo → loop na cena 2. **Lesson:** testar a correção que o validador sugere, não só o caso barrado.
- Registrar o validador sem IA como decisão nova → o Vicente já tinha a 0026. **Lesson:** `git pull` e ler `memoria/decisions/` antes de criar decisão.

## Verification

- `uv run pytest -q` no backend: 25 testes passando. `ruff check`: sem erros.
- `harness-hacka check`: 0 erros, 3 avisos (04, 05 e 09 com revisão marcada para hoje).
- Não verificado: busca com o Claude de verdade (os testes simulam o LLM); `supabase db push` no banco da nuvem.

## Next steps

- [ ] Bruno: pôr a chave no `backend/.env` e rodar uma busca real da cena 1; conferir `gravada: false` e tempo abaixo de 10 s
- [ ] Bruno: `accept 0030` (agente da pessoa adapta e monta o post), aprovada no chat e ainda `proposed`
- [ ] Vicente: confirmar se o schema foi aplicado no Supabase (`db push` precisa de aprovação) e validar T-03, T-04, T-05, T-10 e T-11
- [ ] Vicente: T-06 e T-07 gravando eventos e validações; sem isso, contador 3 → 4 e fila "barrado → passou" não aparecem
- [ ] Bruno: T-13 (plugin). Começar por hooks e instruções; a instrução proíbe CPF e telefone de exemplo e usa e-mail de domínio fictício
- [ ] JP: validar `docs/roteiro-demo.md` (T-02 segue Fazendo até isso)
- [ ] Bruno: vídeo (T-30) só depois do ensaio (T-24); reaproveitar a abertura e o fim do fecho
