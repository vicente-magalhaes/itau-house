# Vídeo de abertura: Itaú House e as IAs

Vídeo oficial de abertura. As IAs giram em volta do Itaú House e trocam de lugar: hoje o Copilot, amanhã outras, depois as que ainda não existem. O Itaú House fica no centro. Mensagem: "Um ecossistema que se adapta à IA. Não um serviço que depende dela."

- **Arquivo final:** [renders/abertura-ias.mp4](renders/abertura-ias.mp4). 15s, 1920×1080, 30fps, sem áudio.
- **Fonte:** [index.html](index.html), uma composição [HyperFrames](https://hyperframes.heygen.com). O briefing está em [BRIEF.md](BRIEF.md).
- **Logos das IAs:** [assets/ias.js](assets/ias.js). Simple Icons (CC0) e, para o Copilot da Microsoft, LobeHub Icons (MIT). As marcas pertencem aos seus donos.

## Como renderizar de novo

```bash
cd video/abertura
npx hyperframes@0.8.79 preview   # abre o Studio para revisar
npx hyperframes@0.8.79 render . -q high -o ./renders/abertura-ias.mp4
```
