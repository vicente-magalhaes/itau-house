---
author: Vicente (sessão com Claude)
status: done
decisions: [0037]
---

# Corrigir as falhas da DV-4 e simplificar aviso e entrada

## Changes

- DV-4 (T-15): 6 itens ok e 4 falhas no relatório do Devin. O resultado está no `docs/devin.md`.
- 404 em Dados → "Abrir o post": o `Dados.jsx` lia o catálogo fictício (`a1`…`a14`). Agora lê da API, com as mesmas chaves do início e do post (RF-30, RF-22). O "Ver dados deste ativo" voltou para os ativos da API.
- Aviso (RNF-06): o selo do topo saiu, a pedido do Vicente. Toda tela interna tem rodapé com "Protótipo do Hackathon Itaú 2026. Não é um produto oficial do Itaú."
- Entrada (RF-23): sem login e senha simulados. Ficam o Google e a escolha de persona, e o rodapé diz "O login com Google é real; as personas são simuladas." O marcador literal [SIMULADO] saiu junto.
- Markdown do post (RF-27): negrito, blocos de código com cerca e `\r\n`. No "Como instalar" do harness sobravam asteriscos e uma linha "text".
- 0037 aceita: o G do Google fica nas cores oficiais, como exceção à regra de cor.

## Why

O Vicente pediu para corrigir o que a DV-4 apontou e depois simplificar o aviso e a entrada.

## Dead ends

- `TaskStop` no Vite em segundo plano → o processo filho continuou na porta, e o segundo `vite --strictPort` falhou. **Lesson:** matar pela porta (`netstat -ano`, depois `taskkill //PID <pid> //T //F`).
- Mudar o `localStorage` e só trocar o hash no teste por CDP → a sessão não remonta e a tela continua na entrada. **Lesson:** `Page.reload` depois de mudar o `localStorage`.
- O `manualInstalacao` de produção vem com `\r\n` (reset feito a partir do Windows) → sobrava `\r` no bloco de código. **Lesson:** quem lê texto do banco divide por `/\r?\n/`.

## Verification

- Front: lint sem aviso novo (os 5 de `only-export-components` já existiam), build ok.
- Front local com a API de produção, como Juliana: 14 de 14 ativos do Dados abrem o detalhe e o post sem "não encontrado".
- Produção depois do push: o bundle tem os textos novos e não tem mais "E-mail ou funcional" nem o selo. `harness-hacka check`: 0 erros.

## Next steps

- [ ] Bruno: conferir se algum vídeo já gravado mostra o selo ou o login com senha, que saíram. Validar T-43 com as telas novas.
- [ ] Chave válida da Anthropic no Render: a busca de produção está fora do ar (Claude 401, Gemini falhando).
- [ ] Alexandre: validar T-42 e T-44 (instalar o harness pelo Claude Code a partir do Itaú House).
- [ ] Reset em produção antes de gravar: `reset_demo.sh` num container `postgres:16`, com `tr -d '\r'` antes.
- [ ] Bruno: conferir se o roteiro novo está todo no `docs/roteiro-demo.md`. As cenas 1 e 2 já entraram.
- [ ] T-34 citando o Devin, o Claude Code, o Gemini (0032) e o harness. Aceitar a 0032 e a 0034.
