# Itaú Design System (Hacka Itaú)

Design system for building Itaú-branded interfaces and assets during **Hacka Itaú**. Built from the official institutional brand kit.

## Sources
- `uploads/ITAU INSTITUCIONAL/` (from `ITAU INSTITUCIONAL.zip`)
  - `ITAU_GUIDELINES_WIP_V1.pdf` — *Guia de Marca Itaú*, V1, dez 2023 (131 pp): Estratégia, Verbal, Visual, Sonoro. The "A Pedra", "Iconografia" and "Composição" chapters are greyed out (WIP) — not yet defined.
  - `HEX/POS`, `HEX/NEG` — logo PNG/SVG at 340–1360px; `CMYK/` — print PDFs.
- No codebase, Figma, product screens or slide templates were supplied.

## Brand context
Itaú Unibanco — Brazilian bank, ~100 years old. Higher cause: *"Que cada brasileiro tenha uma relação mais positiva com o dinheiro."* Pillars: **Seguro** (especialista, confiável, ético), **Caloroso** (amigável, acolhedor, acessível), **Transformador** (vivo, dinâmico, inspirador). Tagline family: *Feito com você*, *Feito de futuro*. Brand architecture: Itaú Unibanco (monolithic) → Itaú Empresas, Uniclass, Personnalité, Private Bank, Asset… — orange is the thread across all; the higher the income segment, the more orange becomes a detail. The **institutional** mark (this kit) is used for sponsorships, events, education, open banking, security.

---

## CONTENT FUNDAMENTALS
Language: **Brazilian Portuguese**. Speak to **"você"**, by name when known ("Oi, Patrícia,"). The brand speaks as **"a gente" / "nós"** — avoid "o Itaú" in 3rd person except to endorse products/promos ("O Itaú leva você pro The Town").

- **Tone:** close, warm, clear. Short sentences mixed with longer ones for rhythm. Lists and step-by-step for complex content.
- **Colloquial OK:** "pra", "tá", "né", "bora", "legal", "bacana", "beleza". Never caricatured youth slang.
- **Questions invite:** "Que tal…?", "Já pensou em…?". *Que tal um alívio na fatura? Conheça o parcelamento em até 24x.*
- **No negative openers:** "Lembre de" instead of "Não se esqueça". Active voice: "Incluímos o seguro…". No hedging ("Tentaremos…"), no gerundismo ("vamos estar fazendo").
- **CTAs:** capitalised first letter, non-urgent — *Conheça, Aproveite, Quero contratar, Simular agora, Acessar, Abrir minha conta*. Avoid "Peça já", "Faça agora". Titles should pair with their CTA (*Conte com a gente pra renegociar seus débitos* → *Quero renegociar*).
- **Errors/friction:** factual + empathetic, no "Ops/Eita/Poxa/Putz", no ":(" — *Você digitou a senha errada 3 vezes. Por segurança, bloqueamos seu cartão.*
- **Casing:** sentence case for titles; product names capitalised (Tag Itaú, Itaú Shop, iToken); generic terms lowercase (cartão de crédito). **Itaú** always capitalised. No ALL-CAPS paragraphs. No underscore/underline gimmick ("_feito com você" ✗). No period on taglines.
- **Numbers:** digits and symbols — 10%, 1º de maio, 10 de agosto de 2023. Weekdays without "-feira" (seg, ter, qua…).
- **Emoji:** rare; punctuation goes before it ("Pronto! 🎉"). Never text emoticons. Hashtags in PascalCase (#VamosDeTurma, #VamosResolver).
- **Inclusive language:** avoid defaulting to masculine; talk to "você"/"pessoas".
- **Forbidden:** overly formal (Prezado, Atenciosamente, Por obséquio, Senhor/senhora) and competitor phrasing ("Juntos", "Vá mais longe", "N possibilidades", "Onde você precisar").
- Explain financial jargon inline: *O que é liquidez? É o termo usado pra dizer quando seu investimento pode ser resgatado.*

## VISUAL FOUNDATIONS
- **Color — 3 tiers, 60-30-10:** Paleta principal = **Laranja Itaú #FF6200**, Branco, Preto (black is for legibility). White now dominates as background (60%), orange for display type + logo (30%), black for body (10%). Paleta base = cool grays #F1F2F4 → #000. Paleta complementar (tropical Brazil: macaw blue, forest green, sunset yellows): blues #0131FF/#001FBD/#000066/#000D3C, greens #A6CF2E/#008717/#0A3B00, yellows→orange #FFCC00…#FF7D00. **Max 3 complementary colors per piece.** Orange must always be present.
- **Never:** red or purple (competitor colors), gradients, new orange tones, invented colors. Error states therefore use deep navy #000D3C + an icon, not red (our interpretation — confirm).
- **Contrast:** black on orange = 6.99:1 (text OK); white on orange ≈ 3:1 → headline-size only. Components put black labels on orange.
- **Type:** proprietary **Itaú Display Pro** (≥13pt; Light→Black, diagonal cuts, compact ascenders) and **Itaú Text Pro** (≤11pt; wider tracking). Fallback per guide: Arial. Rules: left-aligned, start with capital, keep simple, limit to 3 sizes/"pontos", no widows, no extreme kerning, no accent colors inside body text. Section openers use a letter-spaced caps eyebrow (e.g. "C O R E S") over a bold 2-line title.
- **Backgrounds:** flat full-bleed color fields (white, orange, black, or a complementary color) — split horizontally in layouts. Full-bleed warm photography. No textures, patterns or gradients. Large cropped "Pedra" shapes appear as graphic devices on orange covers.
- **Photography:** real life, spontaneous, diverse people, joy/optimism, natural slightly warm light, everyday settings, discreet orange presence. Avoid posed, over-produced, blown-out, color-filtered imagery or all-orange backgrounds.
- **Illustration:** geometric primitives (rect/circle/triangle), large perfect-circle curves, flat fills, no outlines/gradients/texture, the Pedra as motif, diverse skin tones (dedicated palette). Three scales: spot, spot-hero, hero.
- **Corner radii:** soft, echoing the Pedra's water-worn curves — 8/12/20/28px; pills for chips/toggles. Swatch chips in the guide are soft squircles.
- **Cards:** white with 1px #E3E5E8 hairline, 20px radius, no resting shadow; or solid orange/black/gray fields. Never colored left-border accents.
- **Shadows:** minimal — the brand is flat. Shadows only for overlays (dialog, toast) and hover lift.
- **Motion:** fluid and precise (guide's movement fundamentals: Fluidez, Precisão, Simplicidade, Criatividade). Standard ease `cubic-bezier(.2,0,0,1)`, 120–320ms, fades/slides; no bounce.
- **States:** hover lightens orange to #FF7D00 / neutrals to gray-50; press darkens (#E65800) + scale .98; focus = 2px black ring with white gap; disabled = gray-100 fill, gray-400 text.
- **Transparency/blur:** not part of the brand; only a 48% black scrim behind dialogs.
- **Layout:** generous white space, left-aligned text, logo in a corner (header/footer), never directly beside/under a CTA in wide pieces. Logo clear space = ½ logo; min 30px digital / 8mm print.
- **Logo:** primary = orange Pedra with white "itaú" on white; secondary = white (use on orange/complementary/photo). Don't recolor, rotate, outline, separate, distort, gradient, or place on red/purple or low contrast.

## ICONOGRAPHY
The guide's Iconografia chapter is not yet published (WIP), and no icon files were supplied. Only rule found: icons min 30px, colors must meet contrast. **Substitution:** [Lucide](https://lucide.dev) via CDN (`lucide-static@0.456.0`), rendered by the `Icon` component as a CSS mask so it inherits `currentColor`. Rounded line icons fit the warm, humanist tone — **flagged, replace with Itaú's icon set when available.** Emoji: allowed sparingly in social/copy, never as UI icons. No unicode-glyph icons.

---

## Index
- `styles.css` — entry; imports `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`.
- `fonts/` — Mulish (Google Fonts substitute for Itaú Pro).
- `assets/logo/` — `itau-logo-pos.{svg,png}`, `itau-logo-neg.{svg,png}` (square canvases with padding; the Logo component crops them).
- `assets/imagery/` — photos + tropical-palette nature images (rendered from guide pages). `assets/illustrations/` — two hero illustrations.
- `guidelines/` — 24 foundation cards (Colors, Type, Spacing, Brand).
- `components/` — React primitives + `.d.ts` + `.prompt.md` + one card per folder.
- Skill do agente: `.claude/skills/itau-design/SKILL.md` (na raiz do repo).

## Components
No component inventory exists in the sources, so a standard set was authored:
- **core/** — Button, IconButton, Icon, Logo
- **forms/** — Input, Select, Checkbox, Radio, Switch
- **display/** — Card, Badge, Tag
- **navigation/** — Tabs
- **feedback/** — Dialog, Toast, Tooltip

**Intentional additions:** `Icon` (wraps the Lucide substitute set), `Logo` (crops/sizes the official PNGs and enforces the 30px minimum).

## Not included
- **UI kits** — no Itaú product screens/code were supplied; inventing app screens would misrepresent the product.
- **Slides** — no slide template supplied.
- **Fonts** — Itaú Display Pro / Text Pro files not supplied.
