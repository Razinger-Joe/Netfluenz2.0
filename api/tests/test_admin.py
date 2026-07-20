import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from api.dependencies import get_current_user
from api.main import app

client = TestClient(app)


@pytest.fixture
def mock_admin_user():
    user = MagicMock()
    user.id = "admin-123"
    user.email = "admin@netfluenz.com"
    user.role = "admin"
    return user


@patch("api.routers.admin.get_supabase")
def test_get_admin_metrics(mock_get_sb, mock_admin_user):
    app.dependency_overrides[get_current_user] = lambda: mock_admin_user
    mock_sb = MagicMock()
    mock_sb.table.return_value.select.return_value.execute.return_value.count = 10
    mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {"amount": 15000}, {"amount": 25000}
    ]
    mock_get_sb.return_value = mock_sb

    response = client.get("/api/admin/metrics", headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    assert "total_users" in response.json()
    assert "total_revenue" in response.json()
    app.dependency_overrides = {}


@patch("api.routers.admin.get_supabase")
def test_moderate_campaign(mock_get_sb, mock_admin_user):
    app.dependency_overrides[get_current_user] = lambda: mock_admin_user
    mock_sb = MagicMock()
    mock_sb.table.return_value.update.return_value.eq.return_value.execute.return_value.data = [
        {"id": "camp-1", "title": "Safaricom Campaign", "status": "paused"}
    ]
    mock_get_sb.return_value = mock_sb

    payload = {"status": "paused"}
    response = client.patch("/api/admin/campaigns/camp-1/status", json=payload, headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    assert response.json()["status"] == "paused"
    app.dependency_overrides = {}
