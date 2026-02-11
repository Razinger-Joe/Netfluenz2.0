"""
Run the Supabase schema migration via the REST API.
"""
import httpx
import sys

PROJECT_REF = "wmpxoivjmrzhuqnibzpo"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtcHhvaXZqbXJ6aHVxbmlienBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk3MjcxMSwiZXhwIjoyMDgzNTQ4NzExfQ.QbIRBYKpLqjxQVnL4KysG35eIK5W2eYN9KPUnBtXKBE"

BASE_URL = f"https://{PROJECT_REF}.supabase.co"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
}

# Read the SQL schema file
with open("supabase_schema.sql", "r") as f:
    full_sql = f.read()

# Split into individual statements and run each one
statements = [s.strip() for s in full_sql.split(";") if s.strip() and not s.strip().startswith("--")]

print(f"Found {len(statements)} SQL statements to execute")
print(f"Target: {BASE_URL}")
print()

# Try the pg_meta query endpoint
for i, stmt in enumerate(statements):
    if not stmt or stmt.startswith("--"):
        continue
    
    # Skip comments-only blocks
    lines = [l for l in stmt.split("\n") if l.strip() and not l.strip().startswith("--")]
    if not lines:
        continue
    
    short = lines[0][:80]
    print(f"[{i+1}] {short}...")
    
    # Try via pg REST
    url = f"{BASE_URL}/rest/v1/rpc/exec_sql"
    r = httpx.post(url, json={"sql": stmt + ";"}, headers=HEADERS, timeout=30)
    
    if r.status_code == 404:
        print(f"    ⚠️  exec_sql RPC not available (404)")
        break
    elif r.status_code >= 400:
        print(f"    ❌ Error {r.status_code}: {r.text[:200]}")
    else:
        print(f"    ✅ Success")

print()
print("=" * 60)
print("If the exec_sql RPC is not available, you need to run the")
print("SQL schema manually in the Supabase Dashboard SQL Editor:")
print(f"  https://supabase.com/dashboard/project/{PROJECT_REF}/sql/new")
print("Copy the contents of supabase_schema.sql and click 'Run'")
