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


@patch("api.routers.payments.get_supabase")
def test_initiate_mpesa_stk_push(mock_get_sb, mock_user):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    mock_sb = MagicMock()
    mock_sb.table.return_value.insert.return_value.execute.return_value.data = [
        {"id": "pay-1", "user_id": "user-123", "amount": 2500, "status": "pending"}
    ]
    mock_get_sb.return_value = mock_sb

    payload = {
        "phone_number": "254712345678",
        "amount": 2500.0,
        "description": "Campaign Payment"
    }

    response = client.post("/api/payments/mpesa/stk-push", json=payload, headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert "ws_CO_" in response.json()["checkout_request_id"]
    app.dependency_overrides = {}


@patch("api.routers.payments.get_supabase")
def test_get_payment_history(mock_get_sb, mock_user):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    mock_sb = MagicMock()
    mock_sb.table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value.data = [
        {"id": "pay-1", "amount": 2500, "status": "completed"}
    ]
    mock_get_sb.return_value = mock_sb

    response = client.get("/api/payments/history", headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["amount"] == 2500
    app.dependency_overrides = {}
