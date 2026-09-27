import pytest

from app.main import app
from app.repositorio import RepositorioMemoria, obter_repositorio


@pytest.fixture(autouse=True)
def repositorio_isolado(monkeypatch):
    monkeypatch.delenv("SUPABASE_URL", raising=False)
    monkeypatch.delenv("SUPABASE_SECRET_KEY", raising=False)
    memoria = RepositorioMemoria()
    app.dependency_overrides[obter_repositorio] = lambda: memoria
    yield memoria
    app.dependency_overrides.pop(obter_repositorio)
