"""Ponto de entrada da API do Itaú House."""

from fastapi import FastAPI

# Tudo sob /api: o front chama a API pelo mesmo endereço (proxy do Vite em dev, nginx na demo).
# A documentação fica em /api/docs para também passar pelo proxy.
app = FastAPI(
    title="Itaú House API",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url=None,
    openapi_url="/api/openapi.json",
)


@app.get("/api/health", tags=["infra"])
def health() -> dict[str, str]:
    """Responde se a API está no ar. Usado pelo healthcheck do Docker e pelo CI."""
    return {"status": "ok"}
