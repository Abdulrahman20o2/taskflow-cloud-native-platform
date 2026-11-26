
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.routes.auth import get_current_user
from app.api.routes.projects import get_accessible_project
from app.models import ActivityLog, User
from app.schemas.activity import ActivityResponse


router = APIRouter(
    prefix="/activities",
    tags=["Activities"]
)


@router.get(
    "/projects/{project_id}",
    response_model=list[ActivityResponse]
)
def get_project_activities(
    project_id: int,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = get_accessible_project(
        db,
        project_id,
        current_user
    )

    statement = (
        select(ActivityLog)
        .where(ActivityLog.project_id == project.id)
        .order_by(ActivityLog.created_at.desc())
        .offset(offset)
        .limit(limit)
    )

    activities = db.scalars(statement).all()

    return activities


@router.get(
    "/my-activities",
    response_model=list[ActivityResponse]
)
def get_my_activities(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    statement = (
        select(ActivityLog)
        .where(ActivityLog.user_id == current_user.id)
        .order_by(ActivityLog.created_at.desc())
        .offset(offset)
        .limit(limit)
    )

    activities = db.scalars(statement).all()

    return activities
