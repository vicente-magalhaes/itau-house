# Roteiro da demo: Itaú House

T-02 · Dono: Bruno · Valida: JP · Base do vídeo (T-30), do ensaio (T-24) e da API (T-03).
Nomes, squads, ativos e números são **fictícios**.

## Elenco

| Pessoa | Papel | Squad | Perfil |
|---|---|---|---|
| Rafael Nunes | dev | Pix Cobranças | Cord− |
| Marina Alves | PM | Cartões Fatura | Cord− |
| Juliana Prado | coordenadora | Pix Cobranças | Cord+ |

## Estrutura (2 min)

| Tempo | Bloco | Formato |
|---|---|---|
| 0:00–0:06 | Abertura: Rafael precisa de uma skill | Animação |
| 0:06–0:50 | Cena 1: acha a skill da Marina e adapta | Tela real (Cap) |
| 0:50–1:40 | Cena 2: cria, é barrado, corrige, Juliana aprova | Tela real (Cap) |
| 1:40–2:00 | Fecho: a viagem da skill + próximo passo | Animação |

Selo em toda tela: "Protótipo de hackathon · dados fictícios". Esperas da IA são cortadas na edição.

## Cena 1: acha e adapta (0:06–0:50)

| # | Tela | O que acontece | Sistema |
|---|---|---|---|
| 1 | Claude Code | Rafael digita: `cria uma skill que transforma a demanda em critérios de aceitação e casos de teste` | Hook reconhece "skill" (RF-03) |
| 2 | Claude Code | Plugin: "Quer que eu procure no Itaú House se alguém já fez algo parecido?" Rafael: `sim` | RF-04 |
| 3 | Claude Code | Plugin mostra **Demanda em critérios de aceitação** · Marina Alves, PM, Cartões Fatura · 23 curtidas · 41 instalações. Motivo: "Escreve critérios em Dado/Quando/Então. Faz metade do que você pediu; não gera casos de teste." Opções: usar, adaptar, ignorar | `buscar_ativos` (RF-05, RF-06) |
| 4 | Claude Code | Rafael: `adaptar`. Plugin mostra o que manteve e o que acrescentou (casos positivo, negativo e de borda). Rafael: `pode salvar` | `registrar_decisao`, `derivado_de` (RF-07 a RF-10) |
| 5 | Plataforma | Post da Marina: derivações 3 → **4**, com "Rafael Nunes, dev, Pix Cobranças" | RF-27, RF-30 |

**Narração:**
- "O Rafael é dev da squad Pix e precisa de uma skill nova. O Itaú House percebe e pergunta se pode buscar."
- "Ele acha uma skill feita pela Marina, PM de outra squad, e entende por que serve."
- "Adapta em vez de começar do zero. E a Marina ganha o crédito."

## Cena 2: cria, é barrado, corrige, é aprovado (0:50–1:40)

| # | Tela | O que acontece | Sistema |
|---|---|---|---|
| 1 | Claude Code | Rafael: `cria uma skill que gera massa de dados fictícios para testes de Pix, usando meu script scripts/gerar_massa.py`. Aceita a busca | RF-03, RF-04 |
| 2 | Claude Code | Plugin: "Não encontrei nada parecido. Quando terminar, posso ajudar a publicar." Claude cria a skill | `buscar_ativos` (RF-11) |
| 3 | Claude Code | Plugin: "**Barrado.** Chave de API em `scripts/gerar_massa.py`, linha 12. Leia de uma variável de ambiente. Nada foi enviado." | `validar_ativo`, só código, sem IA (RF-14, RF-15, D-26) |
| 4 | Claude Code | Rafael: `corrige`. Validação de novo: **passou**. Plugin: "Quer publicar? Eu monto o post, você revisa, a Juliana aprova." Rafael: `sim` | RF-16 |
| 5 | Claude Code | Plugin mostra o post (título, descrição, autor, alcance sugerido: squad). Rafael: `muda o alcance para frente e envia` | `montar_post`, `enviar_para_aprovacao` (RF-17, RF-18) |
| 6 | Plataforma | Login simulado como **Juliana**. Fila (1): post, checagem (barrado → passou), alcance frente. Clica **Aprovar** | RF-19, RF-23, RF-32 |
| 7 | Plataforma | Post publicado: "Enviado por Rafael · Aprovado por Juliana". Aparece no feed | RF-22, RF-25 |

**Narração:**
- "Na segunda skill, não existe nada parecido. O plugin já prepara a publicação."
- "Uma checagem automática pega uma chave de API no código e diz onde corrigir."
- "Ele revisa o post, escolhe quem pode ver e envia."
- "Quem decide o que entra é uma pessoa: a coordenadora. Cada decisão dela fica registrada."

## Fecho: a viagem da skill (1:40–2:00)

Animação: Marina cria → Rafael adapta → Juliana aprova → a próxima pessoa, de outra squad, instala → a árvore de derivações cresce.
Mostra o mecanismo (+1 derivação, +1 instalação). Sem número de impacto.

**Narração:** "O que uma pessoa cria vira do squad inteiro. Próximo passo: um validador que aprende com cada decisão da coordenadora."

## O que o seed precisa (T-04)

- Os 3 usuários acima, mais um Cord+ da Cartões Fatura (não pode ver a fila da Pix, RF-19).
- **Demanda em critérios de aceitação**: Marina, alcance banco, publicado, 23 curtidas, 41 instalações, 3 derivações.
- **Critérios de aceitação para histórias de fatura**: Cartões Fatura, alcance **squad**. Parecido com o pedido da cena 1 e **nunca** aparece para o Rafael (RF-05). Conferir no ensaio.
- Nenhum ativo de massa de dados de Pix.

## Cuidados

- `scripts/gerar_massa.py` já existe no repositório do Rafael, com uma chave **inventada** na linha 12 (prefixo `ihs_demo_`). Conferir que o `block_secrets.py` e o scanner do GitHub não travam o arquivo.
- A skill da cena 2 não pode ter CPF de exemplo escrito. Se tiver, a checagem barra por dado pessoal e a cena muda.
- O plugin pergunta uma vez por pedido. Conferir no ensaio.
- Se passar de 2 min, o primeiro corte é o passo 5 da cena 1.
