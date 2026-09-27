# Decisões

Uma decisão por arquivo, `NNNN-titulo.md`. Crie com `/harness-hacka:decide`. Os status
seguem o MADR.

Da 0001 à 0028, as decisões ficavam na tabela da antiga `05-decisoes-e-pendencias.md` e eram
citadas como D-01 a D-28. O número é o mesmo: D-12 é a 0012. A migração está na 0029.

<!-- harness-hacka:decisions -->
| Decisão | Título | Status |
|---|---|---|
| [0001](0001-case-c-jornada-de-agentes.md) | Case C, Jornada de agentes | accepted |
| [0002](0002-solucao-itau-house.md) | Solução: Itaú House | accepted |
| [0003](0003-persona-inicial-dev.md) | Persona inicial: dev | superseded by 0018 |
| [0004](0004-recorte-por-governanca.md) | Recorte: começar pequeno por governança | accepted |
| [0005](0005-expansao-como-proximos-passos.md) | Expansão fica como próximos passos | accepted |
| [0006](0006-prd-como-contexto-dos-agentes.md) | PRD como contexto para os agentes | accepted |
| [0007](0007-so-dados-ficticios.md) | Só dados fictícios | accepted |
| [0008](0008-git-main-e-branches-de-trabalho.md) | Git: main e branches de trabalho, sem PR | accepted |
| [0009](0009-repositorio-privado-ate-a-banca.md) | Repositório privado, limpo antes da banca | accepted |
| [0010](0010-formato-da-banca.md) | Formato da banca | accepted |
| [0011](0011-ambiente-em-docker-compose.md) | Ambiente em Docker Compose | accepted |
| [0012](0012-mvp-descoberta-e-publicacao.md) | MVP demonstra descoberta e publicação | accepted |
| [0013](0013-publicacao-so-com-o-coordenador.md) | Nada é publicado sem o coordenador | accepted |
| [0014](0014-modo-do-plugin-escolhido-pelo-dev.md) | O dev escolhe o modo do plugin | accepted |
| [0015](0015-ranking-por-popularidade.md) | Ranking por popularidade | accepted |
| [0016](0016-a-dor-e-retrabalho.md) | A dor é retrabalho | accepted |
| [0017](0017-modo-padrao-perguntar-antes.md) | Modo padrão do plugin: perguntar antes | accepted |
| [0018](0018-persona-em-tres-camadas.md) | Persona em três camadas | accepted |
| [0019](0019-stack-de-ia-e-busca.md) | Stack de IA e busca | accepted |
| [0020](0020-harness-do-time.md) | Harness do time: harness-hacka | accepted |
| [0021](0021-papeis-do-time.md) | Papéis do time | accepted |
| [0022](0022-supabase-na-nuvem.md) | Banco: Supabase na nuvem | accepted |
| [0023](0023-video-demo-com-o-bruno.md) | Vídeo demo inteiro com o Bruno | accepted |
| [0024](0024-memoria-so-com-o-que-envelhece.md) | Memória só com o que envelhece; referência em docs/ | accepted |
| [0025](0025-metrica-retorno-de-tempo.md) | Métrica principal: retorno de tempo | accepted |
| [0026](0026-governanca-em-tres-tempos.md) | Governança em três tempos | accepted |
| [0027](0027-guia-dos-mentores-como-referencia.md) | Guia dos mentores como referência principal | accepted |
| [0028](0028-front-da-demo-em-frontend.md) | Front da demo em frontend/, no estilo do Reddit | accepted |
| [0029](0029-decisoes-em-arquivos.md) | Decisões em arquivos, uma por decisão | accepted |
| [0030](0030-agente-da-pessoa-adapta-e-monta-o-post.md) | O agente da pessoa adapta o ativo e escreve o post | accepted |
| [0031](0031-hospedagem-front-na-vercel-back-no-render.md) | Hospedagem: front na Vercel, back no Render | accepted |
| [0032](0032-gemini-como-segundo-provedor-da-busca.md) | Gemini como segundo provedor da busca | proposed |
| [0033](0033-devin-le-o-repositorio-inteiro.md) | Devin lê o repositório inteiro | accepted |
| [0034](0034-login-com-google-e-persona-escolhida.md) | Login com Google autentica; a persona continua escolhida | proposed |
| [0035](0035-back-fala-com-o-supabase-pelo-cliente-python.md) | Back fala com o Supabase pelo cliente Python, atrás de um repositório | accepted |
| [0036](0036-harness-hacka-no-catalogo-como-ativo-real-com-o.md) | Harness-hacka no catálogo como ativo real, com o autor real | accepted |
| [0037](0037-icone-do-google-fica-nas-cores-oficiais-como.md) | Ícone do Google fica nas cores oficiais, como exceção à regra de cor | accepted |
| [0038](0038-trilha-e-contadores-ficam-no-post-a-area-do.md) | Trilha e contadores ficam no post; a área do Cord+ soma os números | proposed |
<!-- /harness-hacka:decisions -->

| Status | Quer dizer |
|---|---|
| `proposed` | Escrita, esperando uma pessoa. Ainda não vale. |
| `accepted` | Vale. Tem `decided_by`. |
| `rejected` | Proposta que a pessoa recusou. Fica como registro do porquê. |
| `deprecated` | Valia e deixou de valer, sem nada no lugar. |
| `superseded` | Não siga. `superseded_by` diz qual vale no lugar. |

Regras:

1. Só uma pessoa aceita. O agente escreve a proposta; a pessoa responde `accept NNNN` no
   chat e só então a mudança de status passa pelo guard.
2. Corpo de decisão `accepted` não se reescreve. Mudou de ideia: nova decisão com
   `supersedes: [NNNN]`, e a antiga ganha `status: superseded` e `superseded_by`.
3. Opção descartada sempre com o porquê. É o que impede a ideia de voltar.
