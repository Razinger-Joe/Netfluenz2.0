from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from api.dependencies import get_current_user, get_supabase

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


class CreateNotificationRequest(BaseModel):
    user_id: str
    title: str
    message: str
    type: str = "info"
    link: Optional[str] = None


@router.get("")
async def list_notifications(current_user=Depends(get_current_user)):
    """List all notifications for the logged in user."""
    sb = get_supabase()
    response = (
        sb.table("notifications")
        .select("*")
        .eq("user_id", current_user.id)
        .order("created_at", desc=True)
        .execute()
    )
    return response.data or []


@router.patch("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user=Depends(get_current_user)
):
    """Mark a single notification as read."""
    sb = get_supabase()
    response = (
        sb.table("notifications")
        .update({"read": True})
        .eq("id", notification_id)
        .eq("user_id", current_user.id)
        .execute()
    )
    return {"message": "Notification marked as read"}


@router.post("/read-all")
async def mark_all_read(current_user=Depends(get_current_user)):
    """Mark all notifications as read for current user."""
    sb = get_supabase()
    sb.table("notifications").update({"read": True}).eq("user_id", current_user.id).execute()
    return {"message": "All notifications marked as read"}
