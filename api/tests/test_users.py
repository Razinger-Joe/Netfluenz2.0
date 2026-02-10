from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from api.dependencies import get_current_user, require_admin
from api.main import app

def test_get_my_profile_unauthorized(client: TestClient):
    # Override get_current_user to raise 401
    from fastapi import HTTPException
    app.dependency_overrides[get_current_user] = lambda: (_ for _ in ()).throw(HTTPException(status_code=401, detail="Invalid token"))
    
    response = client.get("/api/users/me", headers={"Authorization": "Bearer invalid_token"})
    assert response.status_code == 401
    
    app.dependency_overrides = {}

@patch("api.routers.users.get_supabase")
def test_get_my_profile_authorized(mock_get_supabase, client: TestClient):
    # Mock user dependency
    mock_user = MagicMock()
    mock_user.id = "user-123"
    mock_user.email = "test@example.com"
    app.dependency_overrides[get_current_user] = lambda: mock_user

    # Mock Supabase response
    mock_sb = MagicMock()
    mock_sb.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{
        "id": "user-123",
        "email": "test@example.com",
        "role": "influencer"
    }]
    mock_get_supabase.return_value = mock_sb

    response = client.get("/api/users/me", headers={"Authorization": "Bearer valid_token"})
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    
    app.dependency_overrides = {}

def test_admin_route_forbidden_for_normal_user(client: TestClient):
    # Mock normal user
    mock_user = MagicMock()
    mock_user.user_metadata = {"role": "influencer"}
    app.dependency_overrides[get_current_user] = lambda: mock_user
    
    # Mock require_admin failure
    from fastapi import HTTPException
    def mock_require_admin():
        raise HTTPException(status_code=403, detail="Admin privileges required")
        
    app.dependency_overrides[require_admin] = mock_require_admin

    response = client.get("/api/users/all", headers={"Authorization": "Bearer valid_token"})
    assert response.status_code == 403
    
    app.dependency_overrides = {}

@patch("api.routers.users.get_supabase_admin")
def test_admin_route_success_for_admin(mock_get_admin, client: TestClient):
    # Override require_admin success
    mock_admin = MagicMock()
    mock_admin.id = "admin-123"
    app.dependency_overrides[require_admin] = lambda: mock_admin
    
    # Mock Supabase Admin response
    mock_sb_admin = MagicMock()
    mock_sb_admin.table.return_value.select.return_value.is_.return_value.order.return_value.execute.return_value.data = [
        {"id": "u1", "email": "u1@example.com"}
    ]
    mock_get_admin.return_value = mock_sb_admin

    response = client.get("/api/users/all", headers={"Authorization": "Bearer admin_token"})
    assert response.status_code == 200
    assert len(response.json()) == 1
    
    app.dependency_overrides = {}
