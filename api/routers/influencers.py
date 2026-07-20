from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from api.dependencies import get_current_user, get_supabase

router = APIRouter(prefix="/api/influencers", tags=["influencers"])


@router.get("")
async def list_influencers(
    niche: Optional[str] = Query(None),
    min_followers: Optional[int] = Query(None),
    max_followers: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0)
):
    """List approved influencers for the marketplace."""
    sb = get_supabase()

    query = (
        sb.table("profiles")
        .select("*")
        .eq("role", "influencer")
        .eq("is_approved", True)
        .is_("rejected_at", "null")
    )

    if niche:
        query = query.contains("niches", [niche])

    if min_followers is not None:
        query = query.gte("follower_count", min_followers)

    if max_followers is not None:
        query = query.lte("follower_count", max_followers)

    response = query.order("follower_count", desc=True).range(offset, offset + limit - 1).execute()
    influencers = response.data or []

    if search:
        search_lower = search.lower()
        influencers = [
            inf for inf in influencers
            if search_lower in (inf.get("full_name") or "").lower()
            or search_lower in (inf.get("username") or "").lower()
            or search_lower in (inf.get("bio") or "").lower()
        ]

    return influencers


@router.get("/{influencer_id}")
async def get_influencer(influencer_id: str):
    """Get public profile of a single influencer."""
    sb = get_supabase()

    response = (
        sb.table("profiles")
        .select("*")
        .eq("id", influencer_id)
        .single()
        .execute()
    )

    if not response.data or response.data.get("role") != "influencer":
        raise HTTPException(status_code=404, detail="Influencer not found")

    return response.data
