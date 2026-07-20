import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from api.dependencies import get_current_user
from api.main import app

client = TestClient(app)


@pytest.fixture
def mock_user():
    user = MagicMock()
    user.id = "brand-123"
    user.email = "brand@example.com"
    user.user_metadata = {"role": "brand"}
    return user


@pytest.fixture
def mock_influencer():
    user = MagicMock()
    user.id = "influencer-456"
    user.email = "inf@example.com"
    user.user_metadata = {"role": "influencer"}
    return user


@patch("api.routers.campaigns.get_supabase")
def test_list_campaigns(mock_get_sb, mock_user):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    mock_sb = MagicMock()
    mock_sb.table.return_value.select.return_value.order.return_value.execute.return_value.data = [
        {"id": "c1", "title": "Test Campaign", "status": "active"}
    ]
    mock_get_sb.return_value = mock_sb

    response = client.get("/api/campaigns", headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Test Campaign"
    app.dependency_overrides = {}


@patch("api.routers.campaigns.get_supabase")
def test_create_campaign(mock_get_sb, mock_user):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    mock_sb = MagicMock()
    mock_sb.table.return_value.insert.return_value.execute.return_value.data = [
        {"id": "c2", "brand_id": "brand-123", "title": "New Campaign", "status": "draft"}
    ]
    mock_get_sb.return_value = mock_sb

    payload = {
        "title": "New Campaign",
        "description": "Test description",
        "budget": 50000,
        "status": "draft",
        "niches": ["Fashion"]
    }

    response = client.post("/api/campaigns", json=payload, headers={"Authorization": "Bearer token"})
    assert response.status_code == 210
    assert response.json()["title"] == "New Campaign"
    app.dependency_overrides = {}


@patch("api.routers.campaigns.get_supabase")
def test_apply_to_campaign(mock_get_sb, mock_influencer):
    app.dependency_overrides[get_current_user] = lambda: mock_influencer
    mock_sb = MagicMock()
    # Mock campaign lookup (brand_id != influencer_id)
    mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {"status": "active", "brand_id": "brand-123"}
    ]
    # Mock application insert
    mock_sb.table.return_value.insert.return_value.execute.return_value.data = [
        {"id": "app-1", "campaign_id": "c1", "influencer_id": "influencer-456", "status": "pending"}
    ]
    mock_get_sb.return_value = mock_sb

    payload = {"pitch": "I would love to participate"}
    response = client.post("/api/campaigns/c1/apply", json=payload, headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    assert response.json()["status"] == "pending"
    app.dependency_overrides = {}
