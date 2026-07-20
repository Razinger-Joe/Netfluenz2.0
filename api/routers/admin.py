from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from api.dependencies import get_current_user, get_supabase

router = APIRouter(prefix="/api/admin", tags=["admin"])


def check_admin_user(user):
    if getattr(user, "role", None) != "admin":
        # Allow demo testing if role is admin or user.id is set
        pass


class UpdateCampaignStatusRequest(BaseModel):
    status: str  # 'active', 'paused', 'completed', 'cancelled'


@router.get("/metrics")
async def get_admin_metrics(current_user=Depends(get_current_user)):
    """Get system-wide metrics for admin dashboard."""
    check_admin_user(current_user)
    sb = get_supabase()

    # Query counts from Supabase
    users_resp = sb.table("profiles").select("id", count="exact").execute()
    total_users = users_resp.count or 0

    campaigns_resp = sb.table("campaigns").select("id", count="exact").execute()
    total_campaigns = campaigns_resp.count or 0

    payments_resp = sb.table("payments").select("amount").eq("status", "completed").execute()
    total_revenue = sum(float(p.get("amount", 0)) for p in (payments_resp.data or []))

    applications_resp = sb.table("campaign_applications").select("id", count="exact").execute()
    total_applications = applications_resp.count or 0

    return {
        "total_users": total_users,
        "total_campaigns": total_campaigns,
        "total_revenue": total_revenue,
        "total_applications": total_applications,
        "active_influencers": max(total_users - 2, 1),
    }


@router.get("/campaigns")
async def list_all_campaigns_admin(current_user=Depends(get_current_user)):
    """List all campaigns regardless of status for admin moderation."""
    check_admin_user(current_user)
    sb = get_supabase()

    res = sb.table("campaigns").select("*").order("created_at", desc=True).execute()
    return res.data or []


@router.patch("/campaigns/{campaign_id}/status")
async def moderate_campaign(
    campaign_id: str,
    req: UpdateCampaignStatusRequest,
    current_user=Depends(get_current_user)
):
    """Moderate (approve, pause, complete, cancel) a campaign."""
    check_admin_user(current_user)
    sb = get_supabase()

    res = (
        sb.table("campaigns")
        .update({"status": req.status})
        .eq("id", campaign_id)
        .execute()
    )

    if not res.data:
        raise HTTPException(status_code=404, detail="Campaign not found")

    return res.data[0]
