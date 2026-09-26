# PRD: formato, convenções e stack

A PRD não é entregável do hackathon. Serve de contexto para os agentes que vão desenvolver.
Quando escrita, fica em `PRD.md` na raiz do projeto.
Escrever para um leitor sem nenhum contexto prévio do projeto.

## Regras de escrita

- Frases curtas. Uma ideia por linha.
- Pouco texto corrido. O centro da PRD são os requisitos.
- Todo requisito tem código estável (RN-01, RF-01, RNF-01). O código nunca muda de significado.
- **RN e RF compartilham o número.** RN-05 anuncia a regra; RF-05 detalha a mesma regra.
- Todo RF tem critério de aceitação testável.
- Cada mudança de código cita o requisito que atende.
- Referência cruzada explícita: "(liga RF-11)", "(ver RN-09)".
- Não renumerar. Requisito descartado mantém o código, recebe **[FORA]** e diz quem decidiu, quando e por quê. Nunca deixar código vazio.
- Fora de escopo sempre diz o destino: "fica manual", "fica para a v2", "escala para humano".
- Marcar **[SIMULADO]** toda integração ou dado simulado.
- Marcar **[HIPÓTESE]** tudo que ainda não foi validado.
- RNF são atributos de qualidade (segurança, rastreabilidade, desempenho). Não repetem os RF.
- Todo termo técnico ou sigla usado entra no glossário.

## Estrutura (sumário)

1. Controle do documento e glossário
2. Visão geral: fluxo atual, dores, objetivo
3. Solução: escopo do MVP e fora de escopo
4. Atores e personas
5. Fluxo principal
6. Regras de negócio (RN)
7. Requisitos funcionais (RF)
8. Requisitos não funcionais (RNF)
9. Arquitetura e stack
10. Modelo de dados
11. Métricas
12. Decisões em aberto e riscos

## Forma de cada seção

Os exemplos abaixo usam um domínio fictício (reserva de salas de reunião) só para mostrar a forma.
**Não são requisitos do Itaú House.**

### 1. Controle do documento

| Produto | Nome e subtítulo em uma linha |
|---|---|
| **Equipe** | Nomes |
| **Status** | Em desenvolvimento |
| **Data** | dd/mm/aaaa |

Glossário:

| Termo | Significado |
|---|---|
| **Sigla ou termo** | Explicação em uma frase, para quem nunca ouviu. |

### 2. Visão geral

Um parágrafo de contexto: quem é o usuário e o que faz hoje.

**2.1 Fluxo atual (as-is):** um passo por bullet, sempre com quem faz.
- O colaborador pede a sala por mensagem ao gestor.
- O gestor confere a agenda manualmente e responde.

**2.2 Dores:** nome curto em negrito, depois a consequência.
- **Dependência de uma pessoa:** toda reserva passa pelo gestor. Gargalo e ponto único de falha.
- **Sem padrão na entrada:** cada pedido vem de um jeito. Gera idas e vindas.

**2.3 Objetivo:** uma frase. Usar a frase de recorte do guia:
"Queremos ajudar [pessoa] a [tarefa], quando [situação], porque hoje [dificuldade]. Saberemos que ajudamos se [mudança observável]."

### 3. Solução

"O [produto] é [o que é], que:" seguido de bullets começando por verbo.
- recebe o pedido e identifica o usuário;
- valida as regras da sala;
- deixa o gestor no controle das exceções.

**3.1 Escopo incluído (MVP):** um bullet por capacidade, com o RF entre parênteses.
- Validação de antecedência por sala (RF-02).

**3.2 Fora de escopo:** um bullet por item, com o destino.
- Cobrança de uso da sala: fica manual, fora da plataforma.
- App mobile: fica para a v2. O MVP é web.

### 4. Atores e personas

| Ator | Papel | Interage via |
|---|---|---|
| **Colaborador** | Pede a reserva. | Web |
| **Gestor da sala** | Aprova exceções e resolve conflitos. | Painel web |
| **Agente** | Interpreta o pedido, aplica as regras, escala exceções. | Back-end |

### 5. Fluxo principal

Organizar por raias (quem faz). Cada decisão aparece explícita, com os dois caminhos.

**5.1 Raia Agente**
- Recebe o pedido e identifica o usuário.
- Decisão "cumpre a antecedência?": sim → segue para 5.2; não → escala para o gestor (RF-05).

**5.2 Raia Gestor**
- Valida a exceção. Aprova ou recusa.

**5.3 Caso incompleto ou incorreto**
- Pedido sem horário: o agente pergunta em vez de assumir.

No Itaú House, o fluxo precisa mostrar: entrada → trabalho do agente → revisão humana → resultado registrado.

### 6. Regras de negócio (RN)

Definem os serviços do produto. É o **anúncio** das regras.
- Tabela de duas colunas: código e regra.
- A regra é um verbo no infinitivo com 3 a 7 palavras.
- Sem o "como". O detalhe vai no RF de mesmo número.
- Quando a regra envolve decisão humana, o humano aparece na frase.
- Regra descartada fica na lista com **[FORA]**.

| Código | Regra |
|---|---|
| **RN-01** | Identificar usuário pelo e-mail corporativo |
| **RN-02** | Validar antecedência mínima por sala |
| **RN-03** | Confirmar reserva em duas etapas |
| **RN-04** | Versionar alterações da reserva |
| **RN-05** | Escalar exceção para o gestor da sala |
| **RN-06** | Solicitar avaliação após o uso **[FORA]** (time, dd/mm: sem ganho no MVP) |

### 7. Requisitos funcionais (RF)

Se houver agente conversando com alguém, declarar antes da tabela a persona e o tom dele em uma linha.

| Código | Nome | Descrição | Critérios de aceitação |
|---|---|---|---|
| **RF-02** | Validar antecedência mínima por sala | Cada sala tem uma antecedência mínima. Se o pedido a estoura, o agente não confirma e escala para o gestor. | • A antecedência é parametrizável por sala. • Dado um pedido que estoura a antecedência, o agente não confirma e notifica o gestor (liga RF-05). • Fallback conservador quando a sala não tem regra cadastrada. |
| **RF-03** | Confirmar reserva em duas etapas | O usuário confirma o entendimento; o gestor valida a exceção; só então a reserva é confirmada. | • Etapa 1: o agente valida o entendimento com o usuário, sem prometer a reserva. • Etapa 2: exceções vão para o gestor. • Etapa 3: só após o aval o usuário recebe a confirmação. |

Padrões de critério que funcionam bem:
- Dado/então: "Dado um pedido sem horário, o agente pergunta."
- Proibição: "Nenhum campo obrigatório é preenchido por suposição."
- Máquina de estados: "Padrão AUTOMÁTICO. Gestor assume → MANUAL. Concluído → volta a AUTOMÁTICO. Enquanto ≠ AUTOMÁTICO, nenhuma ação automática."
- Incerteza: "Se a leitura não for confiável, o agente confirma com o usuário em vez de assumir."
- Rastreio: "Cada registro guarda a origem (informada, inferida, confirmada) e a data."

### 8. Requisitos não funcionais (RNF)

Mesma tabela dos RF. Cobrir pelo menos: segurança de dados, rastreabilidade, revisão humana, desempenho da demo.

| Código | Nome | Descrição | Critérios de aceitação |
|---|---|---|---|
| **RNF-01** | Rastreabilidade | Toda saída do agente guarda entrada, fontes e quem aprovou. | • Dado um resultado, é possível ver de onde veio e quem aprovou. |
| **RNF-02** | Dados fictícios | O sistema só contém dados de demonstração. | • Nenhum dado real, chave ou segredo no código, no banco ou em tela. |

### 9. Arquitetura e stack

| Camada | Tecnologia e função |
|---|---|
| **Back-end** | Tecnologia. O que orquestra e quais regras aplica. |
| **Camada de IA** | Modelo e como é usado. Onde a memória fica. |

Mais uma tabela do que é real e do que é simulado:

| Componente | Estado | Observação |
|---|---|---|
| Base de ativos | **[SIMULADO]** | Populada com dados fictícios. |

Custos (critério de escalabilidade): listar as contas de custo e qual é o principal fator de custo de cada uma.

### 10. Modelo de dados

Um parágrafo com as decisões-chave de modelagem. Depois, cada tabela com uma frase em linguagem simples do que guarda e por que existe.

**Tabela salas:** cada sala reservável, com a antecedência mínima própria.

| SALAS | Tipo | Chave | Notas |
|---|---|---|---|
| **id** | uuid | **PK** | |
| nome | text | — | UQ |
| antecedencia_min | int | — | null = usa o fallback |

**Tabela reservas:** cada pedido de reserva. Liga usuário e sala.

| RESERVAS | Tipo | Chave | Notas |
|---|---|---|---|
| **id** | uuid | **PK** | |
| **sala_id** | uuid | **FK** → salas.id | |
| status | enum | — | def 'rascunho': rascunho / em_validacao / confirmada / cancelada |

Relacionamentos, um por bullet:
- Uma sala tem muitas reservas (1:N).

### 11. Métricas

| Indicador | Como medir | Medido ou estimado | Meta |
|---|---|---|---|
| Nome | Fonte e cálculo | Medido no evento / estimado | Se houver |

### 12. Decisões em aberto e riscos

| Nº | Decisão ou risco | Impacta |
|---|---|---|
| **D-01** | O que precisa ser decidido e por que é arriscado. | Arquitetura, custo, cronograma |

## Restrições do evento que a stack precisa respeitar

- Roda ao vivo na banca, com dados de teste prontos.
- Link de acesso ou instruções de execução.
- Nenhuma conexão com sistemas reais do Itaú.
- Dados fictícios. Nenhuma chave ou segredo em tela, vídeo ou repositório.
- Integrações simuladas precisam aparecer como simuladas.
- Cerca de 6 h de construção. Preferir o que o time já domina.
- Ferramentas de IA usadas precisam ser declaradas à banca, com a finalidade.

## Stack

**A decidir (A-09).** Referência: o que o time usou no projeto anterior e já domina.

| Camada | Candidata | Função |
|---|---|---|
| Back-end | Python + FastAPI | API REST. Orquestra o agente e as regras. |
| Front-end | TypeScript + React (Vite) | Interface web. Componentes a definir (shadcn/ui ou MUI). |
| Banco | Supabase (PostgreSQL) | Dados relacionais. Auth para login. Realtime se precisar de atualização ao vivo. |
| IA | LLM via API, a definir | Agente(s) do fluxo. |
| Ambiente | Docker | Padroniza o ambiente do time. |

Candidatas para o Itaú House **(sugestão Claude)**:
- Busca por similaridade entre ativos: embeddings + pgvector no próprio Supabase.
- Redis só se houver necessidade real. O projeto anterior usava para memória de conversa.
