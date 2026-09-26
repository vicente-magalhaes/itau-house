# syntax=docker/dockerfile:1

# Imagem do back-end (FastAPI). Três estágios:
#   base        Python + uv + dependências de runtime. Compartilhado pelos outros dois.
#   dev         + dependências de dev (ruff, pytest) e hot reload. É o que o docker-compose.yml usa.
#   production  só o necessário para rodar, sem root. É o que o docker-compose.prod.yml usa.

ARG PYTHON_VERSION=3.12

FROM python:${PYTHON_VERSION}-slim AS base

# uv copiado da imagem oficial: binário estático, sem depender de pip ou curl.
COPY --from=ghcr.io/astral-sh/uv:0.11 /uv /uvx /usr/local/bin/

# O venv fica em /opt/venv, fora de /app. Em dev, /app é o código montado da máquina, e um
# .venv ali dentro seria sombreado pelo .venv do Windows ou do macOS (que não roda no Linux).
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never \
    UV_PROJECT_ENVIRONMENT=/opt/venv \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Só os manifestos primeiro: a camada de dependências fica em cache enquanto o código muda.
# --frozen falha se o uv.lock não bater com o pyproject.toml, em vez de reescrever o lock.
COPY pyproject.toml uv.lock .python-version ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

EXPOSE 8000

# Usa python em vez de curl, que não existe na imagem slim. PORT permite rodar em plataformas
# que definem a porta (Render, Cloud Run); sem ela, 8000.
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=5 \
    CMD python -c "import os, urllib.request; urllib.request.urlopen('http://127.0.0.1:' + os.environ.get('PORT', '8000') + '/api/health', timeout=2)" || exit 1


FROM base AS dev

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen

COPY app ./app

# Roda como root de propósito: o código chega por volume montado da máquina do dev.
# --reload-dir app: só observa o código. Sem isso o reload varreria também o .venv da máquina.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--reload-dir", "app"]


FROM base AS production

RUN useradd --system --uid 10001 --no-create-home appuser

COPY app ./app

USER appuser

# exec: o uvicorn vira o processo 1 e recebe o sinal de parada do Docker direto.
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
