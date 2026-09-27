"""Respostas de erro no formato do contrato da API."""

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException


class ErroApi(Exception):
    def __init__(self, status: int, erro: str, mensagem: str, **extra: object) -> None:
        self.status = status
        self.erro = erro
        self.mensagem = mensagem
        self.extra = extra


def tratar_erro_api(_request: Request, exc: ErroApi) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status,
        content={"erro": exc.erro, "mensagem": exc.mensagem, **exc.extra},
    )


def tratar_http_exception(_request: Request, exc: HTTPException) -> JSONResponse:
    if isinstance(exc.detail, dict) and "erro" in exc.detail:
        return JSONResponse(status_code=exc.status_code, content=exc.detail)
    codigos = {
        401: ("nao_autorizado", "Você precisa entrar para continuar."),
        403: ("sem_permissao", "Você não tem permissão para esta ação."),
        404: ("nao_encontrado", "Não encontrei o que você pediu."),
        409: ("conflito", "Esta ação não pode ser concluída agora."),
        422: ("entrada_invalida", "Confira os dados enviados."),
    }
    erro, mensagem = codigos.get(
        exc.status_code, ("erro_http", "Não foi possível concluir sua solicitação.")
    )
    return JSONResponse(status_code=exc.status_code, content={"erro": erro, "mensagem": mensagem})


def tratar_validacao(_request: Request, exc: RequestValidationError) -> JSONResponse:
    campos = sorted(
        {".".join(str(parte) for parte in erro["loc"] if parte != "body") for erro in exc.errors()}
    )
    mensagem = (
        f"Confira os campos: {', '.join(campos)}." if campos else "Confira os dados enviados."
    )
    return JSONResponse(status_code=422, content={"erro": "entrada_invalida", "mensagem": mensagem})
