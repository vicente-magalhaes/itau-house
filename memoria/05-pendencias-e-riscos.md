---
summary: "Em aberto, riscos e perguntas da banca, sugestões para o time avaliar"
read_when: "Antes de tratar algo como decidido; ao preparar respostas à banca"
review_by: 2026-09-28
---

# Pendências e riscos

Registro vivo do que falta decidir e do que pode dar errado.
As decisões ficam em [decisions/](decisions/README.md), uma por arquivo. Quando um item daqui for decidido, registre com `/harness-hacka:decide` e tire o item de "Em aberto".
Itens marcados **(sugestão Claude)** são propostas para o time avaliar, não decisões.
Nos textos antigos, D-12 é a decisão 0012.

## Em aberto

| # | Pergunta | Notas |
|---|---|---|
| A-05 | Qual a diferença para um repositório no GitHub e para o catálogo de skills homologadas que já existe? | Ver candidatas abaixo. Crítico para o critério de inovação. |
| A-06 | Como produto, design e risco entram depois do dev? | Em grande parte coberto pela decisão 0018: qualquer papel do squad usa o fluxo. Falta só a resposta curta para a banca (T-33). |
| A-08 | Nome final do produto. | "Itaú House" é provisório. |
| A-10 | Quem de fora do time testa o fluxo, e quando? | Obrigatório registrar pelo menos um teste com conclusão. |
| A-13 | Conversar com um dev do Itaú no evento. | Não aconteceu: nenhum dev do Itaú foi ouvido (Vicente, 27/09). Vira limitação declarada no pitch (R-06). |
| A-18 | O harness conta como elemento pré-existente (regulamento 7.1.1)? | Confirmar com a organização. Pendência que estava na decisão 0020. Ver [01](../docs/01-hackathon-regras-e-entregas.md), propriedade intelectual. |
| A-19 | A trilha (RF-22) e os contadores (RF-30) ficam na página do post ou na área do Cord+? | Resposta proposta na [0038](decisions/0038-trilha-e-contadores-ficam-no-post-a-area-do.md): no post, para todos; a área do Cord+ soma. Sai daqui quando a 0038 for aceita. |
| A-20 | Ligar o Devin no MCP do Itaú House, para mostrar o mesmo catálogo em duas ferramentas? | **(sugestão Claude)** Plugins do Devin aceitam servidor MCP (F7). O nosso roda por stdio e chama a API por HTTP (T-12), então daria para apontar para o back publicado (0031). Não testado. Só depois de o fluxo principal rodar (R-08). Tornaria verdadeira a frase "agnóstico de ferramenta" (R-13). |

## Checklist de desenho do MVP (exigências do Case C)

O fluxo do MVP (decisão 0012) precisa responder:
- Entrada definida: o que o dev ou a squad fornece?
- Trabalho do agente: o que ele faz e com quais limites?
- Revisão humana: quem decide e em que ponto?
- Resultado registrado: o que fica gravado e quem consulta depois?
- Caso normal e caso incompleto ou incorreto: o que acontece em cada um?
- Comparação: como a mesma tarefa é feita hoje, sem a solução?
- O que é real e o que é simulado?

## Diferenciação (A-05): candidatas **(sugestão Claude)**

Hipóteses para o time validar. Nenhuma foi testada.
- **Proativo:** o aviso chega no fluxo de trabalho do dev. Um repositório exige que ele saiba que deve procurar.
- **Vai além de código:** cobre agentes, skills, prompts e frameworks, não só repositórios.
- **Governança embutida:** critérios de entrada, curadoria, visibilidade e trilha de quem publicou, aprovou e reaproveitou.
- **Cross-squad e agnóstico de ferramenta:** reúne ativos feitos com Copilot, Claude, GPT ou Devin. Não testado (A-20).
- Antes de afirmar que é inédito, verificar análogos: portais internos de desenvolvedor (ex.: Backstage, do Spotify), catálogos de agentes de plataformas corporativas e o catálogo de skills homologadas do próprio Itaú.
- Já verificado: o marketplace de plugins do Devin (F7), que distribui skills na empresa inteira. Ver a seção abaixo e o R-11.

## Devin: concorrente ou argumento

Análise de 26/09/2026 (Vicente, com Claude). Fontes em [03](../docs/03-evidencias-pesquisa.md), F6 e F7. Nada aqui é decisão.
- **Sobreposição real (F7):** o Devin já distribui skills e plugins na empresa inteira, com marketplace privado. Um "lugar para compartilhar skills" já existe. É o análogo mais próximo do R-01, mais que o catálogo homologado do F1.
- **O que sobra para nós:** descoberta no momento do trabalho (0017) e governança de entrada (0013, 0026). A doc pública do Devin não mostra nenhum dos dois. A diferenciação tem que ficar aí.
- **Argumento a favor (Vicente):** o Itaú já escalou quem cria com IA (F6). Como circulam as skills, os agentes e os plugins que esses engenheiros criam, entre squads e com produto, design e Finanças? É o "por que agora". Vários Devins em paralelo, sem saber um do outro, repetem trabalho em velocidade de máquina.
- **A demo já mostra isso:** na cena 1, o dev acha e usa o harness-hacka, plugin do Claude Code que o Vicente (PM na demo) publicou em outra squad (0036). Se quem cria não usa Devin, o marketplace do Devin não mostraria esse ativo.

Cuidados **(sugestão Claude)**:
- **Tom:** complemento, nunca crítica ao Devin. Pode haver na banca quem defendeu esse investimento. Frase candidata: "O Devin acelera quem cria. O Itaú House faz o que foi criado circular, com governança."
- **Escopo:** Finanças e as outras áreas são expansão (0005). O argumento vai para o slide de visão. A demo continua com um dev.
- **Exemplo:** não usar esqueleto de código como exemplo principal. O Devin já documenta 300 mil repositórios (F6). Nosso terreno é skill, agente e prompt.
- **"Agnóstico" é hipótese:** o formato de skill do Devin parece com o do Claude Code, mas nada foi testado (A-20).

## Métrica de impacto: sugestões em aberto

A métrica principal, a conta e o exemplo estão na [decisão 0025](decisions/0025-metrica-retorno-de-tempo.md). A dica 6 do [guia dos mentores](../docs/10-guia-dicas-mentores.md) pede também fatores que ajudam a melhorá-la e limites que não podem piorar.

**Fatores e limites (sugestão Claude).** Como no exemplo do guia (reduzir golpe sem bloquear transação legítima): aumentar o reuso sem deixar passar segredo e sem travar quem publica. Indicadores da PRD, seção 11:
- Fatores que ajudam: taxa de reaproveitamento, reuso entre papéis, precisão da sugestão.
- Limites que não podem piorar: tempo até publicar; segredo ou dado pessoal publicado, que precisa ficar em zero (este é novo, não está na PRD).

**Limites da conta (sugestão Claude):**
- É teto, não média. Supõe que cada pessoa que reusou teria criado o ativo do zero, no mesmo tempo, e que reusar não custa nada.
- Conta mais justa: reusos × (horas para criar − horas para adaptar) − horas do coordenador aprovando.
- Com agente autônomo, criar do zero fica barato e a conta encolhe (R-12). Reusar um ativo aprovado poupa também a revisão e a aprovação. Somar essas horas deixa a conta mais robusta.
- De onde vem o tempo de criação: hoje é premissa (a PRD fala em entrevista). Num piloto, o autor declara ao publicar e quem reusa confirma quanto poupou. Fora do escopo do MVP.

## Decisões que devem continuar humanas

Posição do time na [decisão 0026](decisions/0026-governanca-em-tres-tempos.md). Ninguém do Itaú foi ouvido sobre isso (F1 não respondeu), então é proposta, não evidência.
- O dev decide se reaproveita ou não. O agente só sugere e mostra por que achou parecido.
- No MVP, uma pessoa aprova a entrada de um ativo no hub: o coordenador do squad (decisão 0013).
- O dono do ativo define quem pode ver.
- Nada vai para produção sem os gates que o Itaú já tem.
- No MVP, o validador é só código, sem IA: chave, CPF, e-mail, README e autor (RF-14). O julgamento é do coordenador (RF-19), como a dica 7 do guia dos mentores pede: regra simples onde ela resolve.
- Cada aprovação e devolução vira dado; a devolução já exige comentário (RF-21). Depois do MVP, esse histórico serve para construir um agente de julgamento que decide a entrada sozinho. Pergunta provável da banca: R-09.

## Riscos e perguntas prováveis da banca

Referência principal para preparar as respostas: o [guia dos mentores](../docs/10-guia-dicas-mentores.md) (decisão 0027).

| # | Risco ou pergunta | Resposta ou controle possível |
|---|---|---|
| R-01 | "Isso já existe." O Itaú tem skills homologadas (F1), e o regulamento exige solução inédita (1.3). | Diferenciação clara (A-05). Mostrar o que o catálogo atual não faz. |
| R-02 | "É só um GitHub ou uma wiki." | Demonstrar o aviso proativo no fluxo do dev. |
| R-03 | Vazamento: um ativo publicado carrega segredo ou dado sensível. | Verificação na entrada, visibilidade por nível, aprovação humana. |
| R-04 | O agente erra: aponta algo que não é parecido, ou não vê o que é. | O agente só sugere, com justificativa rastreável. O dev decide. Medir a precisão. |
| R-05 | Ninguém publica (catálogo vazio). F1: soluções que dependem de disciplina manual repetem o problema. | Publicar precisa ser efeito colateral do trabalho, não tarefa extra. |
| R-06 | Evidência fraca: poucas conversas, nenhum dev. | Apresentar como hipótese. Mostrar o plano de validação. |
| R-07 | A ferramenta oficial é o Copilot; Claude está em homologação. Na engenharia, o Devin está em escala (F6). | Pensada para qualquer agente com MCP (0018). Só testada no Claude Code (A-20). |
| R-08 | Escopo grande demais para ~10 h. | Uma persona, uma tarefa, um fluxo funcionando. O resto simulado ou como próximo passo. |
| R-09 | "No futuro, então, a IA aprova sozinha?" Tensiona com o tema do Case C, a decisão humana (decisão 0026). | **(sugestão Claude)** A autonomia vem com número. O agente de julgamento roda ao lado do coordenador e só passa a aprovar sozinho quando concorda com ele numa taxa alta e medida. Mesmo assim, só nos casos de baixo risco (alcance squad, checagens fixas limpas). O resto continua com uma pessoa, que audita por amostragem. |
| R-10 | "De onde vêm as 2 horas e os R$ 3.600?" (decisão 0025) | Premissas do time, ditas como premissas. O custo-hora de estagiário é conservador. Num piloto, o tempo vem do autor e de quem reusa (ver a decisão 0025). Dado real, com limite: o autor do harness-hacka, ativo real (0036), declara 2 a 3 h para adaptá-lo no hackathon (Vicente, 27/09). É uma pessoa e um ativo. |
| R-11 | "O Devin já tem marketplace de skills na empresa inteira." (F7) | **(sugestão Claude)** O Devin distribui, mas a doc pública não mostra aprovação antes de compartilhar nem aviso de "já existe" no momento de criar. Esse é o nosso núcleo (0013, 0017, 0026). E ele só chega a quem usa Devin. Ver "Devin: concorrente ou argumento". |
| R-12 | "Com agente autônomo, criar do zero ficou barato. Reuso importa menos." Ataca a conta da 0025. | **(sugestão Claude)** Gerar ficou barato; revisar, aprovar e passar pelos gates, não. O próprio Devin entrega "PR pronto para revisão" (F6). Reusar um ativo aprovado aproveita a aprovação que ele já teve. Somar as horas de revisão evitadas (ver "Limites da conta"). |
| R-13 | "A Cognition vai fazer isso." Ou: "padronizem tudo no Devin." | **(sugestão Claude)** Fornecedor otimiza para a própria ferramenta. O Itaú usa várias (F1, F6), e a camada que atravessa todas e guarda as decisões do coordenador é do banco. O Devin é de engenharia: produto, design e Finanças não estão nele. Limite: "agnóstico" ainda não foi testado (A-20). |
| R-14 | Citar os números do Devin como fato. | São da Cognition, sem método publicado (F6). Citar como "segundo a Cognition". A página do crédito fala em 10 mil engenheiros; o blog, em "mais de 75% dos times de tecnologia". |
