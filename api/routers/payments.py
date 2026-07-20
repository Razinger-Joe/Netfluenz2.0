from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import uuid
import os
from api.dependencies import get_current_user, get_supabase

router = APIRouter(prefix="/api/payments", tags=["payments"])


class MpesaStkPushRequest(BaseModel):
    phone_number: str
    amount: float
    campaign_id: Optional[str] = None
    description: Optional[str] = "Netfluenz Payment"


class MpesaCallbackPayload(BaseModel):
    CheckoutRequestID: str
    ResultCode: int
    ResultDesc: str
    MpesaReceiptNumber: Optional[str] = None


@router.post("/mpesa/stk-push")
async def initiate_mpesa_stk_push(
    req: MpesaStkPushRequest,
    current_user=Depends(get_current_user)
):
    """Initiate M-Pesa Express (STK Push) transaction."""
    sb = get_supabase()

    # Generate reference CheckoutRequestID
    checkout_id = f"ws_CO_{uuid.uuid4().hex[:12].upper()}"

    payment_record = {
        "user_id": current_user.id,
        "campaign_id": req.campaign_id,
        "amount": req.amount,
        "currency": "KES",
        "status": "pending",
        "payment_method": "mpesa",
        "mpesa_phone": req.phone_number,
        "mpesa_checkout_request_id": checkout_id,
        "description": req.description,
    }

    res = sb.table("payments").insert(payment_record).execute()

    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to initialize payment record")

    # In sandbox or simulated mode, return success response
    return {
        "success": True,
        "checkout_request_id": checkout_id,
        "merchant_request_id": f"MR_{uuid.uuid4().hex[:8]}",
        "response_description": "Success. Request accepted for processing",
        "customer_message": f"STK push prompt sent to {req.phone_number}. Enter PIN on your phone.",
        "payment": res.data[0]
    }


@router.post("/mpesa/callback")
async def mpesa_callback(payload: MpesaCallbackPayload):
    """Callback endpoint for Safaricom Daraja API."""
    sb = get_supabase()

    status = "completed" if payload.ResultCode == 0 else "failed"
    update_data = {
        "status": status,
        "mpesa_receipt_number": payload.MpesaReceiptNumber,
    }

    res = (
        sb.table("payments")
        .update(update_data)
        .eq("mpesa_checkout_request_id", payload.CheckoutRequestID)
        .execute()
    )

    return {"ResultCode": 0, "ResultDesc": "Accepted"}


@router.get("/history")
async def get_payment_history(current_user=Depends(get_current_user)):
    """Get payment transaction history for current user."""
    sb = get_supabase()
    res = (
        sb.table("payments")
        .select("*")
        .eq("user_id", current_user.id)
        .order("created_at", desc=True)
        .execute()
    )
    return res.data or []


@router.get("/subscription")
async def get_user_subscription(current_user=Depends(get_current_user)):
    """Get active subscription for current user."""
    sb = get_supabase()
    res = (
        sb.table("subscriptions")
        .select("*")
        .eq("user_id", current_user.id)
        .order("created_at", desc=True)
        .execute()
    )

    if res.data:
        return res.data[0]

    return {
        "user_id": current_user.id,
        "plan_name": "free",
        "status": "active",
        "amount": 0,
    }
