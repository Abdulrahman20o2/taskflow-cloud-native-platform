
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import (
    health,
    auth,
    projects,
    tasks,
    activities,
    dashboard
)
app = FastAPI(
    title="TaskFlow API",
    description="Cloud-Native Team Task Management Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(health.router, prefix="/api/v1")

app.include_router(
    auth.router,
    prefix="/api/v1"
)
app.include_router(projects.router, prefix="/api/v1")
app.include_router(tasks.router, prefix="/api/v1")
app.include_router(activities.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
@app.get("/")
def root():
    return {
        "application": "TaskFlow",
        "description": "Cloud-Native Team Task Management Platform",
        "version": "1.0.0",
        "status": "running"
    }
