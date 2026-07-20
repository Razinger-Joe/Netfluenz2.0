import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from api.dependencies import get_current_user
from api.main import app

client = TestClient(app)


@pytest.fixture
def mock_brand_user():
    user = MagicMock()
    user.id = "brand-123"
    user.email = "brand@safaricom.co.ke"
    user.role = "brand"
    return user


@patch("api.routers.analytics.get_supabase")
def test_get_analytics_overview(mock_get_sb, mock_brand_user):
    app.dependency_overrides[get_current_user] = lambda: mock_brand_user
    mock_sb = MagicMock()
    mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {"id": "camp-1", "status": "active"}
    ]
    mock_get_sb.return_value = mock_sb

    response = client.get("/api/analytics/overview", headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    assert response.json()["role"] == "brand"
    assert response.json()["total_campaigns"] == 1
    app.dependency_overrides = {}


@patch("api.routers.analytics.get_supabase")
def test_get_campaign_analytics(mock_get_sb, mock_brand_user):
    app.dependency_overrides[get_current_user] = lambda: mock_brand_user
    mock_sb = MagicMock()
    mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
    mock_get_sb.return_value = mock_sb

    response = client.get("/api/analytics/campaigns/camp-1", headers={"Authorization": "Bearer token"})
    assert response.status_code == 200
    assert response.json()["campaign_id"] == "camp-1"
    assert "roi_multiplier" in response.json()
    app.dependency_overrides = {}
