from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import users

app = FastAPI(
    title="Netfluenz API",
    description="Backend API for Netfluenz 2.0 — Influencer Marketing Platform",
    version="2.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# Configure CORS — restricted to known origins
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://netfluenz2-0.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

app.include_router(users.router)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Netfluenz API", "version": "2.0.0"}

@app.get("/api")
async def root():
    return {"message": "Welcome to Netfluenz API", "docs": "/api/docs"}
