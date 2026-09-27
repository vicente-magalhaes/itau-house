---
summary: "O que ouvimos de pessoas do Itaú, com limites; fluxo as-is"
read_when: "Argumentos, slide de evidências, mapa ponta a ponta"
review_by: 2026-10-01
---

# Evidências e pesquisa

O que ouvimos de pessoas do Itaú e o que achamos em fonte pública. Cada fonte tem limites; respeitá-los no pitch (critério "Dados").
Regra: fato dito pela fonte ≠ interpretação nossa. Interpretações estão marcadas.

Regras de evidência do guia:
- Dados públicos e benchmarks: registrar fonte, data e o que a informação realmente sustenta.
- Conversas e testes: pedir autorização, evitar informação sensível, dizer quantas pessoas participaram. Uma opinião não representa todo o público.
- Hipóteses e simulações: dizer o que é suposição e o que usa dado fictício. Resultado simulado não é impacto comprovado.

## Fontes

| # | Fonte | Quando | Alcance | Limite |
|---|---|---|---|---|
| F1 | Group Design Manager, Itaú Pagamentos (BU PF) | 24/09/2026, call de 40 min | Processo de produto visto pelo design; uso de IA; conhecimento | n = 1. Repertório de design, não de PM ou dev. |
| F2 | 3 pessoas de Finanças do Itaú, atuação cross-squad | 26/09/2026, no evento | Uso de IA entre squads | n = 3. Conversa informal. |
| F3 | Product Analyst (PA), atua em uma squad | 26/09/2026, no evento | Jornada de produtização e dor do dev | n = 1. Relato sobre o time de dev, não do próprio dev. |
| F4 | Mentores do hackathon | 26/09/2026 | Orientação de recorte | Não registrado em detalhe. |
| F5 | 2 mentores de produto, externos ao Itaú | 26/09/2026, no evento | Pergunta sobre a métrica de impacto | n = 2. Não são do Itaú. É orientação sobre a entrega, não evidência da dor. |
| F6 | Cognition, fornecedora do Devin: página do crédito Devin do hackathon e blog | Blog de 22/09/2026; página vista em 26/09/2026 | Adoção do Devin no Itaú e números de resultado | Marketing do fornecedor, sem método publicado. Números não auditados. |
| F7 | Documentação pública do Devin | Conferida em 26/09/2026 | Como o Devin compartilha skills e plugins (análogo, dica 4 do guia) | Doc pública. Não mostra como o Itaú configurou. Não é evidência da dor. |

Ainda não conversamos com um dev. É a persona escolhida. Lacuna principal. Em andamento: o time está buscando um dev no evento (A-13).

Citar pelo papel, não pelo nome. F1 sabe que o Vicente participaria do hackathon, mas não autorizou citação nominal.

## F2: Finanças (visão cross-squad)

- Atuam em várias squads ao mesmo tempo.
- Usam muita IA.
- Não conseguem saber que agente cada pessoa está usando.
- Uma pessoa usa um agente; outra queria um parecido e não saberia criar.
- Querem aproveitar o que outros já desenvolveram.
- Citaram guard rails como preocupação.

## F3: Product Analyst

- Fluxo de produtização que ela descreveu: discovery → definição de hipótese → design → desenvolvimento.
- Recomendou escolher **uma** persona específica do fluxo (produto, dev, design, risco).
- Dor que ela apontou no time de dev: retrabalho e não aproveitamento.
- Cena: o dev está desenvolvendo, ou revisando código que fez com um agente, e não sabe que outra squad já fez algo parecido.
- "Se o agente avisasse isso, evitaria muito retrabalho." (paráfrase)

Interpretação nossa: F2 e F3 chegam à mesma dor por caminhos diferentes. Falta visibilidade do que outras squads já construíram, incluindo agentes.

## F1: Group Design Manager (Pagamentos)

### Conhecimento (ponto mais forte da conversa)

- O tema foi puxado por nós (dor da Poli Júnior). A confissão de que também é dor no Itaú partiu dele.
- "Confesso que a gente não tem nada muito bem estruturado, tanto que essa dor que vocês têm aí de perder informação quando tem rotatividade também é um fato para a gente."
- Pagamentos criou "notebooks" por conta própria: repositório de PPTs e atas que o Copilot lê.
- "Esses notebooks não são algo institucional [...] é algo muito criado do próprio time para o time."
- Tem surtido efeito, mas falta processo: "A gente tem que pensar nosso ways of working para conseguir criar quase um workflow [...] algo que inclusive está como um desejo aqui do nosso time, que a gente não conseguiu priorizar ainda."
- Design tem uma plataforma de pesquisa com muitos documentos. Usam IA para resgatar insights.

### Skills e agentes compartilhados (atenção: já existe algo)

- Existem dois níveis de skills e agentes:
  - criados pelo próprio time para uso específico (Pagamentos cria alguns);
  - "homologados": um time específico cria e disponibiliza para o banco inteiro.
- Os times consomem skills e agentes de outros times.

Interpretação nossa: há compartilhamento, mas F2 diz que não se sabe o que cada um usa. Hipótese: o que existe não resolve descoberta nem reuso no momento do trabalho. **Não validado.** Ver risco R-01 em [05-pendencias-e-riscos.md](../memoria/05-pendencias-e-riscos.md).

### IA no Itaú

- Ferramenta oficial: Copilot (Microsoft).
- Claude (Claude Code e Claude Design) está em homologação, com poucas pessoas com acesso.
- GPT Enterprise em alguns casos.
- Figma Make e agente do Figma para criar telas.
- Uso diário: atas, material executivo, resgate de informação.
- Existe um time específico de IA, responsável também pelo Íai (IA do Itaú para clientes).
- Guard rails para evitar vazamento de dados; "já aconteceu no passado".
- Para o Íai, cada produto define sua knowledge base (KB). Há testes de pergunta e resposta para detectar alucinação.
- Perfil conservador: guard rails mais rigorosos que outros bancos.
- Citações: "Para o Íai funcionar, todos os produtos precisam definir os seus KBs." / "Tem as perguntas e respostas que a gente precisa validar se a IA alucinou ou não." / "Eu acho que aí já está bem emaranhado esse nosso dia a dia" (sobre IA).

### Estrutura da squad

- Core: tríade produto, design e tecnologia, sempre com um representante de cada.
- Tecnologia: tech lead, front-end, back-end, QA, arquitetura.
- Times de apoio fora das squads: analytics, ciência de dados, design de serviço, content design.
- Cada especialidade tem sua diretoria. Várias squads por frente, cada uma com escopo próprio.

### Governança

- Toda subida de produto passa por gestão de mudança.
- Cada mudança recebe um grau. "Não é só do feeling [...] sempre tem tipo um grau envolvido."
- Gates: compliance, risco, segurança transacional (fraude).
- Produto novo: jurídico entra no começo. Produto existente: checkpoints quando muda jornada, fluxo ou condição.

### Processo de produto (as-is)

1. Estratégia anual desce do CEO até os KRs táticos de cada squad.
2. Pesquisa com cliente para identificar valor.
3. Cruzamento com KRs e estudo de esforço → roadmap.
4. Validação de proposta de valor antes de desenhar tela (SVM: vídeo + protótipo low-fi para base segmentada; go se a aderência for alta, ex.: 70%).
5. Design cria telas. Refinamento técnico. Teste de usabilidade (moderado e não moderado).
6. Desenvolvimento pela tríade.
7. Gestão de mudança com grau e gates.
8. Rollout gradual: funcionários primeiro, depois clientes. Rollback previsto.
9. Medição: árvore de indicadores define a métrica da jornada; SDKs internos de feedback; dashboards; IA que resume comentários de clientes.

Já existe e funciona (não reinventar): OKRs em árvore, SVM, usabilidade, árvore de indicadores, dashboards, IA de sentimento, rollout gradual, gates de mudança, skills homologadas, KB do Íai.

## F5: mentores de produto (externos ao Itaú)

- Pergunta: qual é a métrica de impacto de vocês? Como mostrar que o MVP, aplicado a uma squad específica, trouxe retorno e eficiência? (paráfrase)
- Resposta do time: retorno de tempo, convertido em reais (decisão [0025](../memoria/decisions/0025-metrica-retorno-de-tempo.md)).
- A pergunta bate com as dicas 5 e 6 do [guia dos mentores](10-guia-dicas-mentores.md).

## F6: Cognition, sobre o Devin no Itaú

Dois textos do fornecedor.
- **Página do crédito Devin do hackathon** (vista em 26/09/2026). Diz que o Itaú disponibilizou o Devin para mais de 10.000 engenheiros. Cita:
  - migração .NET → Java 6x mais rápida e de SQL Server 5x mais rápida;
  - 70% das vulnerabilidades de segurança corrigidas automaticamente;
  - cobertura de testes de ~50% para 90%+;
  - nos squads, 20–30% mais throughput e ciclos de entrega 10–15% mais curtos.
- **[Blog da Cognition](https://cognition.com/blog/devin-comes-to-sao-paulo)** (22/09/2026). "More than 75% of Itaú's technology teams use Devin", "documenting 300,000+ repositories". Repete os números de migração, vulnerabilidades e throughput. Não fala em 10 mil engenheiros.

O que sustenta: o Devin é ferramenta de engenharia adotada em escala no Itaú.
O que não sustenta: os números como fato. No pitch, "segundo a Cognition".

Interpretação nossa: com F1 (Copilot oficial, Claude em homologação, GPT Enterprise, Figma Make), o Itaú convive com várias ferramentas de IA. F6 fala só de engenharia. Não diz nada sobre produto, design ou Finanças.

## F7: documentação pública do Devin (análogo)

Conferida em 26/09/2026, nas páginas [Knowledge](https://docs.devin.ai/product-guides/knowledge) e [Plugins](https://docs.devin.ai/product-guides/plugins). Serve à dica 4 do guia: pesquisem o que já existe.

O que o Devin já tem:
- **Plugins:** juntam skills, regras, hooks, servidores MCP e subagentes. Instalado, cada skill vira `/<plugin>:<skill>`.
- **Três escopos:** pessoal, organização e empresa inteira.
- **Marketplace:** o oficial da Cognition junto com os plugins que a organização ou a empresa adicionou. O admin pode esconder o oficial.
- **Knowledge** está sendo migrado para skills em plugins: "Knowledge is deprecated and will be removed in a future update".
- **Formato:** skill em markdown com frontmatter, parecido com o do Claude Code. O manifesto do plugin é outro. Leitura nossa da doc, não testada.

O que a doc não mostra:
- aprovação antes de compartilhar. A responsabilidade fica com quem instala: "only proceed if you trust the plugin and have verified its source";
- curtidas, contagem de uso ou crédito por derivação;
- aviso de "já existe algo parecido" no momento de criar.

Limite: não aparecer na doc pública não quer dizer que não existe. A versão enterprise do Itaú pode ter mais.

Interpretação nossa: o Devin resolve a distribuição de skills dentro da própria ferramenta. Análise e respostas para a banca em [05](../memoria/05-pendencias-e-riscos.md), seção "Devin: concorrente ou argumento".

## Mapa do fluxo ponta a ponta (base para o entregável do Case C)

Junção de F1 e F3. Onde a dor aparece:

| Etapa | Quem | Dor ligada ao reuso |
|---|---|---|
| Discovery e pesquisa | Produto, design | Insights espalhados em documentos (F1). |
| Hipótese e priorização | Produto (PM, PA) | Não coberto. |
| Design | Design | Não coberto pela nossa pesquisa. |
| **Desenvolvimento e revisão de código** | **Dev** | **Refaz o que outra squad já fez; recria agentes que já existem (F3, F2).** |
| Gestão de mudança e gates | Risco, compliance, jurídico | Não coberto. |
| Rollout e medição | Tríade, analytics | Não coberto. |

## Lacunas (tudo que depender disso é hipótese)

- Nenhum dev entrevistado ainda (busca em andamento).
- Frequência e custo do retrabalho: sem número medido. Já sabemos como calcular (retorno de tempo, D-25), mas o exemplo usa premissas do time. O número real só sai de um piloto.
- Como o dev procura hoje algo que já existe (GitHub interno? pergunta no chat? não procura?).
- Como funciona o catálogo de skills e agentes homologados: onde fica, quem homologa, quem usa.
- Como o Itaú usa os plugins e skills do Devin: se as squads compartilham entre si, quem aprova, se produto e design têm acesso (F7). Perguntar ao dev da A-13.
- Tempo por etapa do fluxo.
- Quais decisões as pessoas querem manter humanas (F1 não chegou a responder). O time tem uma proposta (D-26), mas ninguém do Itaú foi ouvido sobre ela.
