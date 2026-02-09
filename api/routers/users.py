from fastapi import APIRouter, Depends, HTTPException
from api.dependencies import get_current_user, get_supabase, get_supabase_admin, require_admin
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

router = APIRouter(prefix="/api/users", tags=["users"])


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


# ─── Authenticated User Endpoints ─────────────────────────────────────────────

@router.get("/me")
async def get_my_profile(user=Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    sb = get_supabase()
    response = sb.table("profiles").select("*").eq("id", user.id).execute()

    if response.data:
        return response.data[0]

    # Fallback if profile doesn't exist yet (created before trigger)
    return {
        "id": user.id,
        "email": user.email,
        "role": user.user_metadata.get("role", "user"),
        "is_approved": False,
    }


@router.put("/me")
async def update_my_profile(profile: UserProfileUpdate, user=Depends(get_current_user)):
    """Update the current user's profile."""
    sb = get_supabase()

    update_data = {k: v for k, v in profile.model_dump().items() if v is not None}

    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided to update")

    try:
        response = sb.table("profiles").update(update_data).eq("id", user.id).execute()
        if response.data:
            return response.data[0]
        raise HTTPException(status_code=404, detail="Profile not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Admin Endpoints ──────────────────────────────────────────────────────────

@router.get("/pending")
async def get_pending_users(admin=Depends(require_admin)):
    """Get all users pending approval (admin only)."""
    sb = get_supabase_admin()
    response = (
        sb.table("profiles")
        .select("*")
        .eq("is_approved", False)
        .is_("rejected_at", "null")
        .order("created_at", desc=True)
        .execute()
    )
    return response.data or []


@router.get("/all")
async def get_all_users(admin=Depends(require_admin)):
    """Get all platform users (admin only)."""
    sb = get_supabase_admin()
    response = (
        sb.table("profiles")
        .select("*")
        .is_("rejected_at", "null")
        .order("created_at", desc=True)
        .execute()
    )
    return response.data or []


@router.post("/{user_id}/approve")
async def approve_user(user_id: str, admin=Depends(require_admin)):
    """Approve a pending user (admin only)."""
    sb = get_supabase_admin()

    response = sb.table("profiles").update({
        "is_approved": True,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", user_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User approved successfully", "user": response.data[0]}


@router.post("/{user_id}/reject")
async def reject_user(user_id: str, admin=Depends(require_admin)):
    """
    Reject a user — moves them to recycle bin.
    They will be auto-deleted after 72 hours by a database function.
    """
    sb = get_supabase_admin()

    response = sb.table("profiles").update({
        "rejected_at": datetime.now(timezone.utc).isoformat(),
        "is_approved": False,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", user_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User rejected and moved to recycle bin (72h auto-delete)", "user": response.data[0]}


@router.get("/recycled")
async def get_recycled_users(admin=Depends(require_admin)):
    """Get all rejected users in the recycle bin (admin only)."""
    sb = get_supabase_admin()
    response = (
        sb.table("profiles")
        .select("*")
        .not_.is_("rejected_at", "null")
        .order("rejected_at", desc=True)
        .execute()
    )
    return response.data or []


@router.post("/{user_id}/restore")
async def restore_user(user_id: str, admin=Depends(require_admin)):
    """Restore a rejected user from the recycle bin (admin only)."""
    sb = get_supabase_admin()

    response = sb.table("profiles").update({
        "rejected_at": None,
        "is_approved": False,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", user_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User restored from recycle bin", "user": response.data[0]}
