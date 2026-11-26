from fastapi import FastAPI
from app.api.routes import health

app = FastAPI(
    title="TaskFlow API",
    description="Cloud-Native Team Task Management Platform",
    version="1.0.0"
)


app.include_router(health.router)


@app.get("/")
def root():
    return {
        "application": "TaskFlow",
        "description": "Cloud-Native Team Task Management Platform",
        "version": "1.0.0",
        "status": "running"
    }
