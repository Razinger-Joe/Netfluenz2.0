import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)


@patch("api.routers.influencers.get_supabase")
def test_list_influencers(mock_get_sb):
    mock_sb = MagicMock()
    mock_sb.table.return_value.select.return_value.eq.return_value.eq.return_value.is_.return_value.order.return_value.range.return_value.execute.return_value.data = [
        {
            "id": "inf-1",
            "full_name": "Sarah Wanjiku",
            "username": "sarahcreates",
            "role": "influencer",
            "follower_count": 259000,
            "niches": ["Fashion", "Lifestyle"]
        }
    ]
    mock_get_sb.return_value = mock_sb

    response = client.get("/api/influencers")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["full_name"] == "Sarah Wanjiku"


@patch("api.routers.influencers.get_supabase")
def test_get_influencer_not_found(mock_get_sb):
    mock_sb = MagicMock()
    mock_sb.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value.data = None
    mock_get_sb.return_value = mock_sb

    response = client.get("/api/influencers/invalid-id")
    assert response.status_code == 404
