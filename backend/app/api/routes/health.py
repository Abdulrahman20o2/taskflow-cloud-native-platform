from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "taskflow-backend",
        "message": "TaskFlow API is running successfully"
    }
