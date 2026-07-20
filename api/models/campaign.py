from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class CampaignCreate(BaseModel):
    title: str
    description: str
    budget: float = 0
    status: str = "draft"
    niches: List[str] = []
    requirements: Optional[Dict[str, Any]] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    budget: Optional[float] = None
    status: Optional[str] = None
    niches: Optional[List[str]] = None
    requirements: Optional[Dict[str, Any]] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class CampaignApplicationCreate(BaseModel):
    pitch: Optional[str] = None


class ApplicationDecision(BaseModel):
    status: str  # "accepted" or "rejected"
