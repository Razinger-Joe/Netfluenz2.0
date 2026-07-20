import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from api.dependencies import get_current_user
from api.main import app

client = TestClient(app)


@pytest.fixture
def mock_user():
    user = MagicMock()
    user.id = "user-123"
    user.email = "user@example.com"
    return user


@patch("api.routers.notifications.get_supabase")
def test_list_notifications(mock_get_sb, mock_user):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    mock_sb = MagicMock()
    mock_sb.table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value.data = [
        {"id": "n1", "title": "Application Accepted", "message": "Your application was accepted!"}
    ]
    mock_get_sb.return_value = mock_sb

    response = client.get("/api/notifications", headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Application Accepted"
    app.dependency_overrides = {}


@patch("api.routers.notifications.get_supabase")
def test_mark_all_read(mock_get_sb, mock_user):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    mock_sb = MagicMock()
    mock_get_sb.return_value = mock_sb

    response = client.post("/api/notifications/read-all", headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    assert response.json()["message"] == "All notifications marked as read"
    app.dependency_overrides = {}
