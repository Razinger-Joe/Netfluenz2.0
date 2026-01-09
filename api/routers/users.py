from fastapi import APIRouter, Depends, HTTPException, Body
from api.dependencies import get_current_user, get_supabase
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/users", tags=["users"])

class UserProfileCreate(BaseModel):
    full_name: str
    role: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

@router.get("/me")
async def get_my_profile(user = Depends(get_current_user)):
    supabase = get_supabase()
    
    # Query the 'profiles' table we created in SQL
    data, count = supabase.table("profiles").select("*").eq("id", user.id).execute()
    
    if not data[1]: # data[1] is the list of results in some versions, or data.data
        # Depending on supabase-py version, response format varies. 
        # Modern version: response.data
        if hasattr(data, 'data') and data.data:
             return data.data[0]
        elif isinstance(data, list) and len(data) > 0:
             return data[0]
        else:
             # If profile doesn't exist (maybe created before trigger), return basic auth info
             return {
                 "id": user.id,
                 "email": user.email,
                 "role": user.user_metadata.get("role", "user")
             }

    # Handle supabase-py v2 response structure
    return data.data[0] if data.data else {}

@router.put("/me")
async def update_my_profile(profile: UserProfileUpdate, user = Depends(get_current_user)):
    supabase = get_supabase()
    
    update_data = {k: v for k, v in profile.dict().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided to update")
        
    try:
        response = supabase.table("profiles").update(update_data).eq("id", user.id).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
