"""Ponto de entrada da API do Itaú House."""

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException

from app.api_aprovacoes import router as aprovacoes
from app.api_ativos import router as ativos
from app.api_busca import router as busca
from app.api_decisoes import router as decisoes
from app.api_usuarios import router as usuarios
from app.api_validacoes import router as validacoes
from app.erros import ErroApi, tratar_erro_api, tratar_http_exception, tratar_validacao

# Tudo sob /api: o front chama a API pelo mesmo endereço (proxy do Vite em dev, nginx na demo).
# A documentação fica em /api/docs para também passar pelo proxy.
app = FastAPI(
    title="Itaú House API",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url=None,
    openapi_url="/api/openapi.json",
)
app.add_exception_handler(ErroApi, tratar_erro_api)
app.add_exception_handler(HTTPException, tratar_http_exception)
app.add_exception_handler(RequestValidationError, tratar_validacao)


@app.get("/api/health", tags=["infra"])
def health() -> dict[str, str]:
    """Responde se a API está no ar. Usado pelo healthcheck do Docker e pelo CI."""
    return {"status": "ok"}


app.include_router(validacoes)
app.include_router(busca)
app.include_router(usuarios)
app.include_router(ativos)
app.include_router(decisoes)
app.include_router(aprovacoes)
