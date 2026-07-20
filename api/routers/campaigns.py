from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from api.dependencies import get_current_user, get_supabase, get_supabase_admin, require_admin
from api.models.campaign import CampaignCreate, CampaignUpdate, CampaignApplicationCreate, ApplicationDecision

router = APIRouter(prefix="/api/campaigns", tags=["campaigns"])


# ─── List & Get Campaigns ─────────────────────────────────────────────────────

@router.get("")
async def list_campaigns(
    status_filter: Optional[str] = Query(None, alias="status"),
    niche: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    user=Depends(get_current_user)
):
    """List campaigns. Filterable by status and niche."""
    sb = get_supabase()
    query = sb.table("campaigns").select("*, profiles!brand_id(full_name, avatar_url)")

    if status_filter and status_filter != "all":
        query = query.eq("status", status_filter)

    if niche:
        query = query.contains("niches", [niche])

    response = query.order("created_at", desc=True).execute()
    campaigns = response.data or []

    if search:
        search_lower = search.lower()
        campaigns = [
            c for c in campaigns
            if search_lower in c.get("title", "").lower()
            or search_lower in c.get("description", "").lower()
        ]

    return campaigns


@router.get("/{campaign_id}")
async def get_campaign(campaign_id: str, user=Depends(get_current_user)):
    """Get detailed information about a single campaign."""
    sb = get_supabase()
    response = (
        sb.table("campaigns")
        .select("*, profiles!brand_id(full_name, avatar_url)")
        .eq("id", campaign_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Campaign not found")

    return response.data[0]


# ─── Create, Update, Delete Campaign ─────────────────────────────────────────

@router.post("", status_code=210)
async def create_campaign(
    campaign: CampaignCreate,
    current_user=Depends(get_current_user)
):
    """Create a new campaign (brand or admin)."""
    sb = get_supabase()

    payload = campaign.model_dump()
    payload["brand_id"] = current_user.id

    try:
        response = sb.table("campaigns").insert(payload).execute()
        if response.data:
            return response.data[0]
        raise HTTPException(status_code=400, detail="Failed to create campaign")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{campaign_id}")
async def update_campaign(
    campaign_id: str,
    campaign_update: CampaignUpdate,
    current_user=Depends(get_current_user)
):
    """Update an existing campaign (owning brand or admin)."""
    sb = get_supabase()

    # Check ownership
    existing = sb.table("campaigns").select("brand_id").eq("id", campaign_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Campaign not found")

    user_role = current_user.user_metadata.get("role") if hasattr(current_user, "user_metadata") else None
    if existing.data[0]["brand_id"] != current_user.id and user_role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update this campaign")

    update_data = {k: v for k, v in campaign_update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided to update")

    response = sb.table("campaigns").update(update_data).eq("id", campaign_id).execute()
    if response.data:
        return response.data[0]

    raise HTTPException(status_code=500, detail="Failed to update campaign")


@router.delete("/{campaign_id}")
async def delete_campaign(
    campaign_id: str,
    current_user=Depends(get_current_user)
):
    """Delete a campaign (owning brand or admin)."""
    sb = get_supabase()

    existing = sb.table("campaigns").select("brand_id").eq("id", campaign_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Campaign not found")

    user_role = current_user.user_metadata.get("role") if hasattr(current_user, "user_metadata") else None
    if existing.data[0]["brand_id"] != current_user.id and user_role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this campaign")

    sb.table("campaigns").delete().eq("id", campaign_id).execute()
    return {"message": "Campaign deleted successfully"}


# ─── Campaign Applications ───────────────────────────────────────────────────

@router.post("/{campaign_id}/apply")
async def apply_to_campaign(
    campaign_id: str,
    app_data: CampaignApplicationCreate,
    current_user=Depends(get_current_user)
):
    """Apply to an active campaign (influencer)."""
    sb = get_supabase()

    # Check campaign exists and is active
    campaign_resp = sb.table("campaigns").select("status, brand_id").eq("id", campaign_id).execute()
    if not campaign_resp.data:
        raise HTTPException(status_code=404, detail="Campaign not found")

    if campaign_resp.data[0]["brand_id"] == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot apply to your own campaign")

    application_payload = {
        "campaign_id": campaign_id,
        "influencer_id": current_user.id,
        "pitch": app_data.pitch,
        "status": "pending",
    }

    try:
        response = sb.table("campaign_applications").insert(application_payload).execute()
        if response.data:
            return response.data[0]
        raise HTTPException(status_code=400, detail="Failed to submit application")
    except Exception as e:
        if "duplicate" in str(e).lower() or "unique" in str(e).lower():
            raise HTTPException(status_code=400, detail="You have already applied to this campaign")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{campaign_id}/applications")
async def get_campaign_applications(
    campaign_id: str,
    current_user=Depends(get_current_user)
):
    """Get all applications for a campaign (owning brand or admin)."""
    sb = get_supabase()

    existing = sb.table("campaigns").select("brand_id").eq("id", campaign_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Campaign not found")

    user_role = current_user.user_metadata.get("role") if hasattr(current_user, "user_metadata") else None
    if existing.data[0]["brand_id"] != current_user.id and user_role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view applications")

    response = (
        sb.table("campaign_applications")
        .select("*, profiles!influencer_id(full_name, avatar_url, email)")
        .eq("campaign_id", campaign_id)
        .order("created_at", desc=True)
        .execute()
    )

    return response.data or []


@router.post("/{campaign_id}/applications/{application_id}/decision")
async def application_decision(
    campaign_id: str,
    application_id: str,
    decision: ApplicationDecision,
    current_user=Depends(get_current_user)
):
    """Accept or reject a campaign application (owning brand or admin)."""
    if decision.status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Decision status must be 'accepted' or 'rejected'")

    sb = get_supabase()

    existing = sb.table("campaigns").select("brand_id").eq("id", campaign_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Campaign not found")

    user_role = current_user.user_metadata.get("role") if hasattr(current_user, "user_metadata") else None
    if existing.data[0]["brand_id"] != current_user.id and user_role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    response = (
        sb.table("campaign_applications")
        .update({"status": decision.status})
        .eq("id", application_id)
        .eq("campaign_id", campaign_id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Application not found")

    return {"message": f"Application {decision.status}", "application": response.data[0]}
