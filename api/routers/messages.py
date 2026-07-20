from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from api.dependencies import get_current_user, get_supabase

router = APIRouter(prefix="/api/messages", tags=["messages"])


class SendMessageRequest(BaseModel):
    recipient_id: str
    content: str


class CreateConversationRequest(BaseModel):
    other_user_id: str


@router.get("/conversations")
async def get_my_conversations(current_user=Depends(get_current_user)):
    """Get all active conversations for the authenticated user."""
    sb = get_supabase()
    response = (
        sb.table("conversations")
        .select("*, participant1:profiles!participant1_id(id, full_name, avatar_url), participant2:profiles!participant2_id(id, full_name, avatar_url)")
        .or_(f"participant1_id.eq.{current_user.id},participant2_id.eq.{current_user.id}")
        .order("last_message_at", desc=True)
        .execute()
    )
    return response.data or []


@router.get("/conversations/{conversation_id}/messages")
async def get_messages(
    conversation_id: str,
    current_user=Depends(get_current_user)
):
    """Get all messages in a conversation."""
    sb = get_supabase()

    # Check participation
    conv = sb.table("conversations").select("*").eq("id", conversation_id).execute()
    if not conv.data:
        raise HTTPException(status_code=404, detail="Conversation not found")

    c = conv.data[0]
    if c["participant1_id"] != current_user.id and c["participant2_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    messages_resp = (
        sb.table("messages")
        .select("*, sender:profiles!sender_id(full_name, avatar_url)")
        .eq("conversation_id", conversation_id)
        .order("created_at", asc=True)
        .execute()
    )

    return messages_resp.data or []


@router.post("/send")
async def send_message(
    req: SendMessageRequest,
    current_user=Depends(get_current_user)
):
    """Send a direct message to a user, creating a conversation if one does not exist."""
    sb = get_supabase()

    # Find or create conversation
    # Sort IDs to ensure unique constraint works regardless of order
    p1, p2 = sorted([current_user.id, req.recipient_id])

    conv = (
        sb.table("conversations")
        .select("id")
        .eq("participant1_id", p1)
        .eq("participant2_id", p2)
        .execute()
    )

    if conv.data:
        conv_id = conv.data[0]["id"]
    else:
        new_conv = (
            sb.table("conversations")
            .insert({"participant1_id": p1, "participant2_id": p2, "last_message_text": req.content})
            .execute()
        )
        if not new_conv.data:
            raise HTTPException(status_code=400, detail="Failed to start conversation")
        conv_id = new_conv.data[0]["id"]

    # Insert message
    msg_resp = (
        sb.table("messages")
        .insert({
            "conversation_id": conv_id,
            "sender_id": current_user.id,
            "content": req.content,
            "is_read": False,
        })
        .execute()
    )

    # Update last_message in conversation
    sb.table("conversations").update({
        "last_message_text": req.content,
    }).eq("id", conv_id).execute()

    if msg_resp.data:
        return msg_resp.data[0]

    raise HTTPException(status_code=400, detail="Failed to send message")
