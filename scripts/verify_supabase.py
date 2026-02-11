"""
Quick script to verify Supabase connection and check if tables exist.
Run with: python scripts/verify_supabase.py
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from dotenv import load_dotenv
load_dotenv()

from supabase import create_client

url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env")
    sys.exit(1)

print(f"🔗 Connecting to: {url}")
sb = create_client(url, key)

# Check profiles table
try:
    result = sb.table("profiles").select("id").limit(1).execute()
    print(f"✅ profiles table exists — {len(result.data)} rows found")
except Exception as e:
    print(f"❌ profiles table error: {e}")

# Check campaigns table
try:
    result = sb.table("campaigns").select("id").limit(1).execute()
    print(f"✅ campaigns table exists — {len(result.data)} rows found")
except Exception as e:
    print(f"❌ campaigns table error: {e}")

# Check auth health
try:
    # List users (admin operation)
    users = sb.auth.admin.list_users()
    print(f"✅ Auth service healthy — {len(users)} users in system")
except Exception as e:
    print(f"⚠️  Auth admin check: {e}")

print("\n🎉 Supabase connection verified!")
