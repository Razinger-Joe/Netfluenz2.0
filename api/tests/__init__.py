import os

# Set mock env vars for testing
os.environ["VITE_SUPABASE_URL"] = "https://mock.supabase.co"
os.environ["VITE_SUPABASE_ANON_KEY"] = "mock-anon-key"
os.environ["SUPABASE_SERVICE_ROLE_KEY"] = "mock-service-key"
