from fastapi.testclient import TestClient

def test_health_check(client: TestClient):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "Netfluenz API", "version": "2.0.0"}

def test_root(client: TestClient):
    response = client.get("/api")
    assert response.status_code == 200
    assert "Welcome to Netfluenz API" in response.json()["message"]
