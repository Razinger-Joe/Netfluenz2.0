import os
import pytest
from unittest.mock import MagicMock
from fastapi.testclient import TestClient

# Set mock env vars BEFORE importing app/dependencies
os.environ["VITE_SUPABASE_URL"] = "https://mock.supabase.co"
os.environ["VITE_SUPABASE_ANON_KEY"] = "mock-anon-key"
os.environ["SUPABASE_SERVICE_ROLE_KEY"] = "mock-service-key"

from unittest.mock import patch, MagicMock

# Patch create_client to avoid real network calls/initialization
with patch("supabase.create_client") as mock_create:
    mock_client = MagicMock()
    mock_create.return_value = mock_client
    from api.main import app
    from api.dependencies import get_supabase, get_supabase_admin, get_current_user

# Mock Supabase Client
mock_supabase = MagicMock()
mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
mock_supabase.table.return_value.select.return_value.execute.return_value.data = []
mock_supabase.table.return_value.insert.return_value.execute.return_value.data = [{"id": "new-user"}]
mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value.data = [{"id": "updated-user"}]

# Mock Admin Client (same structure for now)
mock_admin = MagicMock()

@pytest.fixture
def client():
    # Override dependencies
    app.dependency_overrides[get_supabase] = lambda: mock_supabase
    app.dependency_overrides[get_supabase_admin] = lambda: mock_admin
    # By default, no user is logged in for base client
    # Tests can override get_current_user per request or use a specific fixture
    return TestClient(app)

@pytest.fixture
def mock_auth_user():
    user = MagicMock()
    user.id = "test-user-id"
    user.email = "test@example.com"
    user.user_metadata = {"role": "influencer"}
    return user

@pytest.fixture
def authorized_client(client, mock_auth_user):
    app.dependency_overrides[get_current_user] = lambda: mock_auth_user
    return client

@pytest.fixture
def admin_client(client):
    admin_user = MagicMock()
    admin_user.id = "admin-id"
    admin_user.email = "admin@example.com"
    admin_user.user_metadata = {"role": "admin"}
    app.dependency_overrides[get_current_user] = lambda: admin_user
    return client
