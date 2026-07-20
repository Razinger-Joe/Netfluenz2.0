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


@patch("api.routers.messages.get_supabase")
def test_get_my_conversations(mock_get_sb, mock_user):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    mock_sb = MagicMock()
    mock_sb.table.return_value.select.return_value.or_.return_value.order.return_value.execute.return_value.data = [
        {"id": "conv-1", "participant1_id": "user-123", "participant2_id": "user-456", "last_message_text": "Hello!"}
    ]
    mock_get_sb.return_value = mock_sb

    response = client.get("/api/messages/conversations", headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["last_message_text"] == "Hello!"
    app.dependency_overrides = {}


@patch("api.routers.messages.get_supabase")
def test_send_message(mock_get_sb, mock_user):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    mock_sb = MagicMock()
    # Mock conversation lookup
    mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [
        {"id": "conv-1"}
    ]
    # Mock message insert
    mock_sb.table.return_value.insert.return_value.execute.return_value.data = [
        {"id": "m1", "conversation_id": "conv-1", "sender_id": "user-123", "content": "Hi there!"}
    ]
    mock_get_sb.return_value = mock_sb

    payload = {"recipient_id": "user-456", "content": "Hi there!"}
    response = client.post("/api/messages/send", json=payload, headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    assert response.json()["content"] == "Hi there!"
    app.dependency_overrides = {}
