# Roteiro da demo: Itaú House

Versão inicial (T-02), 26/09/2026. Dono: Bruno. Valida: JP.
Serve para três coisas: o ensaio ao vivo (T-24), o vídeo de 2 min (T-30) e o contrato da API (T-03).
Todos os nomes, squads, ativos e números são **fictícios**.

Convenções:
- **Narração** é o que o Bruno fala no vídeo.
- **Digita** é o que o dev escreve no Claude Code.
- **Plugin** é o que o Claude Code responde com o Itaú House. É o texto esperado; a IA pode variar a redação, não o conteúdo.
- **[IA]** marca passo que chama o Claude. Cada um tem resposta gravada de reserva (T-14, RNF-04).
- **[MCP]** marca a ferramenta do servidor MCP chamada no passo.

## 1. Elenco e estado inicial

| Pessoa | Papel | Squad (frente) | Perfil | Onde aparece |
|---|---|---|---|---|
| Rafael Nunes | dev | Pix Cobranças (Pix) | Cord− | Claude Code, cenas 1 e 2 |
| Marina Alves | produto (PM) | Cartões Fatura (Cartões) | Cord− | Autora da skill da cena 1 |
| Juliana Prado | dev (coordenadora) | Pix Cobranças (Pix) | Cord+ | Plataforma, fim da cena 2 |

Ativos do seed que a demo usa (o resto do catálogo vem no T-04):

| Ativo | Tipo | Autor | Alcance | Status | Curtidas | Instalações | Derivações | Por que existe |
|---|---|---|---|---|---|---|---|---|
| Demanda em critérios de aceitação | skill | Marina Alves | banco | publicado | 23 | 41 | 3 | Cena 1: é o que o Rafael encontra |
| Critérios de aceitação para histórias de fatura | skill | outra pessoa da Cartões Fatura | **squad** | publicado | 9 | 12 | 0 | Teste do RF-05: é parecido com o pedido da cena 1 e **nunca** pode aparecer para o Rafael |
| (nenhum ativo de massa de dados de Pix) | — | — | — | — | — | — | — | Cena 2: a busca precisa voltar vazia |

Estado da máquina da demo:
- Plugin Itaú House instalado no Claude Code, modo **perguntar antes** (RF-02).
- Repositório de trabalho do Rafael aberto, com o arquivo `scripts/gerar_massa.py` já existente. Na linha 12 ele tem uma chave de API **fictícia** escrita no código (ver 4.3). É o "script antigo" que ele quer reaproveitar.
- Plataforma aberta no navegador em outra janela, sem ninguém logado.
- Banco no estado inicial do roteiro (comando de reset do T-25).

## 2. Visão do tempo (vídeo de 2 min)

| Tempo | Bloco | Tela |
|---|---|---|
| 0:00–0:10 | Abertura: quem usa e o que quer | Claude Code |
| 0:10–0:55 | Cena 1: acha a skill da PM e adapta | Claude Code → post da Marina |
| 0:55–1:45 | Cena 2: cria, validador barra, corrige, publica, coordenadora aprova | Claude Code → fila → post |
| 1:45–2:00 | Fechamento: o que é real, o que é simulado, uma limitação | Plataforma |

Orçamento de fala: cerca de 280 palavras no total. As respostas do plugin aparecem na tela e não são lidas inteiras.

## 3. Abertura (0:00–0:10)

**Tela:** Claude Code aberto no repositório do Rafael. No canto, o selo "Protótipo de hackathon. Não é produto oficial do Itaú. Dados fictícios."

**Narração:** "O Rafael é dev da squad Pix Cobranças. Ele trabalha com o Claude Code e precisa de uma skill nova. Não sabe que alguém de outra squad já fez algo parecido."

## 4. Cena 1: acha a skill da PM e adapta (0:10–0:55)

### 4.1 Pedido e pergunta

1. **Digita:** `cria uma skill que transforma a demanda em critérios de aceitação e casos de teste`
2. Hook de pedido reconhece a intenção: tipo **skill** (RF-03). [IA, esforço low]
3. **Plugin:** "Parece que você vai criar uma skill. Quer que eu procure no Itaú House se alguém já fez algo parecido?" (RF-04)
4. **Digita:** `sim`

**Narração:** "O Itaú House percebe que ele vai criar uma skill e pergunta antes de buscar. Esse é o modo padrão."

### 4.2 Busca com justificativa

5. [MCP `buscar_ativos`] com o pedido e o Rafael como usuário. O back filtra visibilidade (RF-05) e o Claude ranqueia (RF-06). [IA, esforço low]
6. **Plugin:**

   > Encontrei 1 skill parecida no Itaú House.
   >
   > **Demanda em critérios de aceitação** · skill
   > Marina Alves, PM da squad Cartões Fatura · 23 curtidas · 41 instalações
   > **Por que é parecida:** lê a demanda e escreve critérios de aceitação no formato Dado/Quando/Então. Faz a primeira metade do que você pediu. Não gera casos de teste.
   >
   > O que você quer fazer?
   > 1. Usar como está
   > 2. Adaptar para gerar também os casos de teste
   > 3. Ignorar e criar do zero

   A skill "Critérios de aceitação para histórias de fatura" (alcance squad, outra squad) **não aparece**.

**Narração:** "Ele encontra uma skill feita por uma PM de outra squad, e entende por que ela serve."

### 4.3 Adapta e registra a origem

7. **Digita:** `2`
8. [MCP `detalhar_ativo`] traz o conteúdo. [MCP `registrar_decisao`] com decisão **adaptar** (RF-07, RF-10).
9. O Claude clona e adapta (RF-08). [IA, esforço medium] Salva em `.claude/skills/criterios-e-casos-de-teste/SKILL.md`, com `derivado_de` apontando para a skill da Marina no frontmatter (RF-09).
10. **Plugin:**

    > Adaptei a skill da Marina. O original não mudou.
    > **Mantive:** leitura da demanda e critérios em Dado/Quando/Então.
    > **Acrescentei:** para cada critério, casos de teste positivo, negativo e de borda.
    > A skill nova guarda "derivado de: Demanda em critérios de aceitação". Quer salvar?

11. **Digita:** `pode salvar`

**Narração:** "Ele adapta em vez de começar do zero. A skill nova guarda de onde veio."

### 4.4 Crédito para a autora

12. **Tela:** plataforma, post "Demanda em critérios de aceitação". Contador de derivações passa de 3 para **4**. Na lista de derivações: "Critérios e casos de teste · Rafael Nunes, dev, Pix Cobranças". Indicador de reuso entre papéis: produto → dev (RF-30, RF-27).

**Narração:** "E a Marina ganha o crédito: a derivação conta no post dela."

> Decisão para o Bruno: a skill derivada entra como ativo `rascunho` no banco, com `derivado_de`, para o link do RF-27 funcionar. A publicação dela segue o mesmo fluxo da cena 2 e **não aparece no vídeo**, por tempo.

## 5. Cena 2: cria, validador barra, corrige, coordenadora aprova (0:55–1:45)

### 5.1 Busca sem resultado

1. **Digita:** `cria uma skill que gera massa de dados fictícios para testes de Pix, usando meu script scripts/gerar_massa.py`
2. Hook reconhece a intenção: skill (RF-03). **Plugin:** mesma pergunta do passo 4.1.3. **Digita:** `sim`
3. [MCP `buscar_ativos`] [IA, esforço low]. **Plugin:** "Não encontrei nada parecido no Itaú House. Quando você terminar, posso ajudar a publicar." (RF-06, RF-11)
4. [MCP `registrar_decisao`] registra a busca sem resultado (RF-10).
5. O Claude cria `.claude/skills/massa-dados-pix/` com `SKILL.md` e `scripts/gerar_massa.py` copiado do script antigo.

**Narração:** "Na segunda skill, não existe nada parecido. O plugin avisa e já prepara a publicação."

### 5.2 Validador barra

6. Hook de ativo novo detecta a skill ao fim da tarefa (RF-13). [MCP `validar_ativo`]. Checagens fixas + IA (RF-14). [IA, esforço medium]
7. **Plugin:**

   > O validador do Itaú House barrou esta skill. Nada foi enviado.
   > **Motivo:** chave de API escrita no código.
   > **Onde:** `scripts/gerar_massa.py`, linha 12.
   > **Como corrigir:** leia a chave de uma variável de ambiente, por exemplo `PIX_SANDBOX_API_KEY`, e tire o valor do arquivo.
   > O validador não altera seu código. Quer que eu faça essa correção?

   (RF-15. Primeira linha da trilha de validação: **barrado**.)

**Narração:** "Antes de qualquer pessoa ver, um agente validador confere o ativo. Achou uma chave no código, e explica onde e como corrigir. Ele não corrige sozinho."

### 5.3 Corrige e passa

8. **Digita:** `sim, corrige`
9. O Claude troca a linha 12 por leitura de `os.environ["PIX_SANDBOX_API_KEY"]`. [MCP `validar_ativo`] de novo. Resultado: **aprovado**.
10. **Plugin** (RF-16):

    > Agora passou na validação.
    > Quer publicar no Itaú House? Eu monto o post, você revisa, e a Juliana Prado, coordenadora da sua squad, aprova antes de alguém ver.

11. **Digita:** `sim`

### 5.4 Revisa o post e escolhe o alcance

12. [MCP `montar_post`] (RF-17). **Plugin** mostra o rascunho:

    > **Título:** Massa de dados fictícios para testes de Pix
    > **Tipo:** skill
    > **Descrição:** gera chaves Pix, valores e cenários de erro fictícios para testes automatizados.
    > **Autor:** Rafael Nunes, dev, Pix Cobranças
    > **Alcance sugerido:** squad
    > **README** e **manual de instalação:** gerados a partir da skill.
    > Quer mudar algo antes de enviar?

13. **Digita:** `muda o alcance para frente e envia` (RF-18)
14. [MCP `enviar_para_aprovacao`]. Status: **em aprovação**. **Plugin:** "Enviado. Está na fila da Juliana Prado."

**Narração:** "Ele revisa o post, escolhe quem pode ver, e manda para a coordenadora."

### 5.5 Coordenadora aprova

15. **Tela:** plataforma. Login simulado (RF-23): escolhe **Juliana Prado · Cord+ · Pix Cobranças**. A tela avisa que o login é simulado.
16. Menu mostra **Fila de aprovação (1)** (RF-24, RF-32). Abre o item:
    - Post como o Rafael enviou.
    - Validador: rodada 1 **barrado** (chave de API, linha 12); rodada 2 **aprovado**.
    - Alcance pedido: **frente Pix**.
    - Botões: **Aprovar** e **Devolver**.
17. Clica **Aprovar** (RF-19). Status: **publicado**.
18. **Tela:** página do post. Trilha (RF-22): "Enviado por Rafael Nunes · Aprovado por Juliana Prado", com data e hora. Depois, o feed com o ativo (RF-25).

**Narração:** "A Juliana vê o post, o que o validador disse, e aprova. Só agora a skill fica visível para a frente Pix."

## 6. Fechamento (1:45–2:00)

**Tela:** feed da plataforma, com o selo de protótipo.

**Narração:** "Plugin, busca e validador rodam de verdade. O login, a hierarquia e o catálogo são simulados, com dados fictícios. Uma limitação: hoje a busca compara o pedido com cerca de vinte ativos. Com milhares, vamos precisar de um pré-filtro antes da IA."

> Decisão para o Bruno: a limitação escolhida é técnica (busca). Alternativa: "ainda não testamos com um dev do Itaú" (A-13). Escolher uma.

## 7. O que cada frente precisa entregar para este roteiro rodar

| Frente | Precisa | Task |
|---|---|---|
| Seed | Os 3 usuários, as 2 squads e os ativos da seção 1. Mais um Cord+ da Cartões Fatura, para testar que ele não vê a fila da Pix (RF-19) | T-04 |
| API | Busca com visibilidade, detalhe, decisão, validação, rascunho, envio, fila, aprovar, contadores | T-03, T-06, T-07 |
| MCP | `buscar_ativos`, `detalhar_ativo`, `registrar_decisao`, `validar_ativo`, `montar_post`, `enviar_para_aprovacao` | T-12 |
| IA | Intenção (low), ranqueamento com justificativa e limiar (low), validador (medium), adaptação (medium) | T-10, T-11 |
| Plugin | Hook de pedido, pergunta única por pedido, hook de ativo novo, convite a publicar | T-13 |
| Front | Login simulado, fila com resultado do validador, página do post com derivações e trilha, feed | T-16 a T-19 |
| Reserva | Resposta gravada para cada passo [IA], com aviso "resposta gravada" na tela | T-14 |

## 8. Cuidados

- **Chave fictícia.** A chave do `gerar_massa.py` é inventada, com prefixo próprio, por exemplo `ihs_demo_` seguido de letras aleatórias. O validador (T-11) precisa pegar esse padrão. Conferir que o hook `block_secrets.py` e o scanner do GitHub não travam o commit do arquivo de demo.
- **CPF na massa de dados.** A skill da cena 2 gera dados de teste. Se o `SKILL.md` tiver um CPF de exemplo escrito, o validador barra por dado pessoal, e a cena muda. Exemplos usam marcador (`<cpf gerado>`), nunca um número.
- **Uma pergunta por pedido** (RF-04). No ensaio, conferir que o plugin não pergunta de novo no meio da cena.
- **O que não aparece no vídeo, mas precisa funcionar no ensaio:** a skill de alcance squad da Cartões Fatura nunca aparece para o Rafael (RF-05, RNF-07).
- **Nada de dado real** em tela: nomes, chaves e números são do seed.

## 9. Pendências

- JP valida a história e a narração.
- Bruno decide as duas notas marcadas "Decisão para o Bruno" (4.4 e 6).
- Cronometrar no ensaio (T-24). Se passar de 2 min, cortar primeiro o passo 4.4 (crédito da autora) para uma frase só.
