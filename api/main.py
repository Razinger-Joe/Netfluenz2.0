from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from api.routers import users

app = FastAPI(
    title="Netfluenz API",
    description="Backend API for Netfluenz 2.0",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Netfluenz API"}

@app.get("/api")
async def root():
    return {"message": "Welcome to Netfluenz API"}
