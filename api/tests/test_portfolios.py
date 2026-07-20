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


@patch("api.routers.portfolios.get_supabase")
def test_get_user_portfolio(mock_get_sb):
    mock_sb = MagicMock()
    mock_sb.table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value.data = [
        {"id": "p1", "user_id": "user-123", "title": "Safaricom Campaign Video"}
    ]
    mock_get_sb.return_value = mock_sb

    response = client.get("/api/portfolios/user-123")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Safaricom Campaign Video"


@patch("api.routers.portfolios.get_supabase")
def test_create_portfolio_item(mock_get_sb, mock_user):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    mock_sb = MagicMock()
    mock_sb.table.return_value.insert.return_value.execute.return_value.data = [
        {"id": "p2", "user_id": "user-123", "title": "New Campaign Item"}
    ]
    mock_get_sb.return_value = mock_sb

    payload = {
        "title": "New Campaign Item",
        "description": "Showcasing travel content",
        "campaign_name": "Kenya Airways Vlogs"
    }

    response = client.post("/api/portfolios", json=payload, headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    assert response.json()["title"] == "New Campaign Item"
    app.dependency_overrides = {}
