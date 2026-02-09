import os
from fastapi import Header, HTTPException, Depends
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set in .env file")

# Initialize Supabase Client (anon key — RLS enforced)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Service client for admin operations (bypasses RLS)
supabase_admin: Client | None = None
if SUPABASE_SERVICE_KEY:
    supabase_admin = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def get_supabase() -> Client:
    """Returns the standard Supabase client (RLS enforced)."""
    return supabase


def get_supabase_admin() -> Client:
    """Returns the admin Supabase client (bypasses RLS). Required for admin operations."""
    if supabase_admin is None:
        raise HTTPException(
            status_code=500,
            detail="Admin client not configured. Set SUPABASE_SERVICE_ROLE_KEY in .env"
        )
    return supabase_admin


async def get_current_user(authorization: str = Header(...)):
    """
    Verifies the JWT token from the Authorization header using Supabase Auth.
    Returns the user object if valid, raises 401 otherwise.
    """
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header format")

        token = authorization.split(" ")[1]
        user_response = supabase.auth.get_user(token)

        if not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid token or expired session")

        return user_response.user
    except HTTPException:
        raise
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")


async def require_admin(user=Depends(get_current_user)):
    """
    Dependency that ensures the authenticated user has the 'admin' role.
    Must be used after get_current_user.
    """
    sb = get_supabase()
    response = sb.table("profiles").select("role").eq("id", user.id).execute()

    if not response.data or response.data[0].get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return user
