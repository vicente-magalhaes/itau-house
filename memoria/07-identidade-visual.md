---
summary: "Qual fonte de marca vale para quê, regras de front-end, cores, fontes, logo"
read_when: "Front-end, slides, vídeo"
review_by: 2026-10-01
---

# Identidade visual

Duas fontes, com papéis diferentes:

| Fonte | Papel | Vale para |
|---|---|---|
| `design-system/` | Design system do protótipo. Gerado no Claude Design a partir do guia oficial. Tokens CSS, componentes React, regras de voz. | **Toda UI**, slides e vídeo |
| `itau-design-system/` | Guia de Marca Itaú oficial (PDF, dez/2023, v1) e logos originais. | Dúvida sobre marca ou logo. Em conflito, o guia oficial vence. |

Ponto de entrada para agentes: `design-system/readme.md`. A skill `itau-design` (`.claude/skills/itau-design/`) carrega esse contexto.

## Regras para o front-end

- Importar `design-system/styles.css`. Ele traz fontes, cores, tipografia, espaçamento e base.
- Usar os componentes de `design-system/components/` antes de criar um novo. Cada um tem `.prompt.md` com uso.
- Cor, fonte, raio, sombra e espaçamento só por token (`var(--brand)`, `var(--space-4)`, `var(--radius-lg)`). Nada de hex solto no código.
- Um só botão primário por tela.
- Texto de interface segue a voz do readme: "você", frases curtas, CTA sem urgência ("Conheça", "Quero reaproveitar"), erro factual sem "Ops".

## Cuidados

- Marca, logo e look and feel são do Itaú (regulamento 7.7).
- Tudo deve se identificar como protótipo de hackathon, não produto oficial do Itaú.
- Não alterar, distorcer, rotacionar, contornar ou aplicar gradiente no logo. Usar o componente `Logo`.
- Nunca vermelho ou roxo (cores da concorrência). Nunca gradiente. Nunca tom de laranja inventado.
- Máximo de 3 cores complementares por peça. O laranja sempre presente.

## Cores

Paleta principal: Laranja Itaú `#FF6200`, Branco `#FFFFFF`, Preto `#000000` (só legibilidade).
Proporção 60-30-10: branco de fundo, laranja em display e logo, preto no texto.
Cinzas, complementares, ilustração e tons de pele: `design-system/tokens/colors.css`.

Contraste: preto sobre laranja passa (6,99:1). Branco sobre laranja só em título grande (~3:1). Por isso os botões usam texto preto.

## Tipografia

- Oficial: Itaú Display Pro (títulos) e Itaú Text Pro (texto). Proprietárias, não temos os arquivos.
- O design system usa **Mulish** (Google Fonts, incluída em `design-system/fonts/`) e cai para Arial, que é o fallback do guia.
- No máximo 3 tamanhos por peça. Texto alinhado à esquerda.

## Interpretações do design system (não estão no guia oficial)

Tratar como provisórias. Confirmar com o time se alguém questionar.
- **Erro sem vermelho:** estados de erro usam azul-marinho `#000D3C` com ícone.
- **Ícones:** o capítulo de iconografia do guia não foi publicado. O design system usa Lucide como substituto.
- **Fonte:** Mulish substitui as fontes proprietárias.

## Logo

- Primária: laranja sobre branco. Secundária: branca, sobre laranja ou fundo colorido.
- Área de proteção: metade do logo. Mínimo de 30 px no digital.
- Arquivos: `design-system/assets/logo/` (usados pelo componente) e `itau-design-system/logos/` (originais).
