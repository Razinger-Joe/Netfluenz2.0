import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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
    "http://localhost:8000",
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


# ─── Serve React Static Files (Production) ─────────────────────────────────────

DIST_DIR = Path(__file__).resolve().parent.parent / "dist"

if DIST_DIR.exists():
    # Serve static assets (JS, CSS, images, etc.)
    app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="static-assets")

    # Serve other static files at root level (favicon, manifest, etc.)
    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str):
        """
        SPA catch-all: serve the requested file if it exists in dist/,
        otherwise return index.html for client-side routing.
        """
        # Check if the file exists in the dist directory
        file_path = DIST_DIR / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))

        # For all other paths, return index.html (SPA client-side routing)
        return FileResponse(str(DIST_DIR / "index.html"))
