---
name: itau-house
description: Buscar no Itaú House um ativo parecido antes de criar uma skill, agente, MCP ou framework, e publicar o que a pessoa criou. Use quando um hook do Itaú House pedir, quando a pessoa aceitar a busca ou quando ela pedir para publicar.
---

# Itaú House

Catálogo interno em que squads publicam e reaproveitam o que criam com IA. Protótipo de hackathon: dados fictícios.
Ferramentas no MCP `itau-house`: `buscar_ativos`, `detalhar_ativo`, `registrar_decisao`, `validar_ativo`, `montar_post`, `enviar_para_aprovacao`.

## Tom

Fale como o Itaú fala: "você", frases curtas, sem urgência, sem jargão sem explicação. Sugira e explique. **Nunca decida pela pessoa.**

## Descoberta

1. Chame `buscar_ativos` com o pedido da pessoa, do jeito que ela escreveu, e o tipo de ativo.
2. Se `gravada` for `true`, avise numa linha: "Resposta gravada da demo (a IA da busca está fora do ar)."
3. Se `indisponivel` for `true`, repita a `mensagem` e siga a tarefa do zero.
4. Se `encontrou` for `false`, repita a `mensagem` ("Não encontrei nada parecido. Quando terminar, posso ajudar a publicar.") e crie do zero. Não invente um ativo parecido.
5. Se encontrou, mostre cada sugestão assim, e nada além disso:
   - **título**: autor, cargo, squad · curtidas · instalações
   - Motivo: o `motivo`. Se houver `limite`, acrescente: "Não faz: …"
   - Se a sugestão tiver `link`, logo abaixo: "Quer ver os detalhes no navegador? Abra a <link>." Use o `link` exatamente como veio (markdown) e nunca mostre a URL crua.
   Depois ofereça as três opções: **usar como está**, **adaptar** ou **ignorar**. Espere a escolha. Não siga sem ela (RF-07).
6. Chame `registrar_decisao` com o `buscaId`, o id do ativo e a decisão.
   - **usar**: chame `detalhar_ativo` e instale o ativo como está, seguindo o `manualInstalacao`.
   - **adaptar**: chame `detalhar_ativo`, copie os arquivos para `.claude/skills/<nome-novo>/` e adapte ao pedido. O original não muda. Mostre à pessoa o que manteve e o que acrescentou, e só salve depois que ela concordar (RF-08). No frontmatter do `SKILL.md` novo, acrescente `derivado_de: <id do original>` (RF-09).
   - **ignorar**: crie do zero. Quando terminar, a publicação será oferecida (RF-11).

## Publicação

Um hook avisa quando a tarefa termina com um ativo novo. Aí:

1. Chame `validar_ativo` com a pasta do ativo (ou o arquivo, se for agente). Se o ativo usa arquivos do repositório que ficam fora da pasta dele (comum em agente: o script que ele chama, ex.: `scripts/gerar_massa.py`), passe-os em `extras`, aqui e no `montar_post`. Quem instalar vai precisar deles, e eles passam pela mesma checagem.
2. **Barrado**: para cada item com `resultado: falhou`, diga o que é, o arquivo, a linha e o `comoCorrigir`. Termine com "Nada foi enviado." Pergunte se a pessoa quer que você corrija. Nunca corrija sem ela pedir (RF-15). Depois de corrigir, valide de novo.
3. **Passou**: convide: "Quer publicar no Itaú House? Eu monto o post, você revisa e a coordenação do seu squad aprova." Se a pessoa disser não, pare. Nada é enviado (RF-16).
4. Se ela disser sim, escreva o post: `nome`, `resumo` (uma frase sobre o que faz), `readme` (o que faz, quando usar, limites), `tags`, `ferramentas`, `manualInstalacao` e `derivadoDe` quando houver. Numa adaptação, copie as `ferramentas` do original sem perguntar. Chame `montar_post` com a pasta, esses campos, `visibilidade: "squad"` e os `validacaoIds` das rodadas desta tarefa (RF-17).
   - **Autor:** é quem está logado no Itaú House (o login do banco), e o Itaú House preenche sozinho. Não compare com a conta ou o e-mail da sessão do Claude, que são outra coisa, e não pergunte sobre isso.
   - Não pergunte sobre acessos: o post não tem esse campo.
5. Mostre o post em poucas linhas: título, resumo, alcance. Explique o alcance: squad (só o seu squad), frente (as squads da sua frente) ou banco (todo mundo). Pergunte se ela quer mudar algo (RF-18).
6. Se ela pedir mudança, chame `montar_post` de novo com o `id` e só os campos que mudam.
7. Quando ela disser para enviar, chame `enviar_para_aprovacao`. Confirme: "Enviado. Está na fila da coordenação do seu squad. Você vê o post no Itaú House quando for aprovado." Se a resposta tiver `link`, termine com: "Quer acompanhar? Abra o <link>." (o `link` exatamente como veio, sem URL crua).

## Nunca

- Publicar, aprovar ou enviar sem a pessoa pedir.
- Sugerir um ativo que não veio de `buscar_ativos`.
- Mostrar o valor de uma chave ou segredo, mesmo mascarado pela metade.
