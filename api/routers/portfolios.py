from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from api.dependencies import get_current_user, get_supabase

router = APIRouter(prefix="/api/portfolios", tags=["portfolios"])


class PortfolioItemCreate(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    campaign_name: Optional[str] = None
    metrics: Optional[Dict[str, Any]] = None


@router.get("/{user_id}")
async def get_user_portfolio(user_id: str):
    """Get all portfolio items for a user."""
    sb = get_supabase()
    response = (
        sb.table("user_portfolios")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return response.data or []


@router.post("")
async def create_portfolio_item(
    item: PortfolioItemCreate,
    current_user=Depends(get_current_user)
):
    """Create a new portfolio item for the current user."""
    sb = get_supabase()
    payload = item.model_dump()
    payload["user_id"] = current_user.id

    response = sb.table("user_portfolios").insert(payload).execute()
    if response.data:
        return response.data[0]

    raise HTTPException(status_code=400, detail="Failed to create portfolio item")


@router.delete("/{item_id}")
async def delete_portfolio_item(
    item_id: str,
    current_user=Depends(get_current_user)
):
    """Delete a portfolio item owned by the current user."""
    sb = get_supabase()
    existing = sb.table("user_portfolios").select("user_id").eq("id", item_id).execute()

    if not existing.data:
        raise HTTPException(status_code=404, detail="Portfolio item not found")

    if existing.data[0]["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this item")

    sb.table("user_portfolios").delete().eq("id", item_id).execute()
    return {"message": "Portfolio item deleted successfully"}
