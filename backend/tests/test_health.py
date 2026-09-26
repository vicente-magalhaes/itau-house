from fastapi.testclient import TestClient

from app.main import app


def test_health_responde_ok() -> None:
    resposta = TestClient(app).get("/api/health")

    assert resposta.status_code == 200
    assert resposta.json() == {"status": "ok"}
