
from fastapi import FastAPI

from app.api.routes import health, auth


app = FastAPI(
    title="TaskFlow API",
    description="Cloud-Native Team Task Management Platform",
    version="1.0.0"
)


app.include_router(health.router)

app.include_router(
    auth.router,
    prefix="/api/v1"
)


@app.get("/")
def root():
    return {
        "application": "TaskFlow",
        "description": "Cloud-Native Team Task Management Platform",
        "version": "1.0.0",
        "status": "running"
    }
