
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, or_
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.routes.auth import get_current_user
from app.models import Project, ProjectMember, ActivityLog, User
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
)

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


def get_accessible_project(
    db: Session,
    project_id: int,
    current_user: User
) -> Project:
    statement = (
        select(Project)
        .outerjoin(
            ProjectMember,
            ProjectMember.project_id == Project.id
        )
        .where(
            Project.id == project_id,
            or_(
                Project.owner_id == current_user.id,
                ProjectMember.user_id == current_user.id
            )
        )
    )

    project = db.scalars(statement).unique().first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    return project


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED
)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = Project(
        name=project_data.name,
        description=project_data.description,
        owner_id=current_user.id
    )

    db.add(project)
    db.flush()

    activity = ActivityLog(
        user_id=current_user.id,
        project_id=project.id,
        action="project_created",
        description=f"Created project: {project.name}"
    )

    db.add(activity)
    db.commit()
    db.refresh(project)

    return project


@router.get(
    "",
    response_model=list[ProjectResponse]
)
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    statement = (
        select(Project)
        .outerjoin(
            ProjectMember,
            ProjectMember.project_id == Project.id
        )
        .where(
            or_(
                Project.owner_id == current_user.id,
                ProjectMember.user_id == current_user.id
            )
        )
        .order_by(Project.created_at.desc())
    )

    projects = db.scalars(statement).unique().all()

    return projects


@router.get(
    "/{project_id}",
    response_model=ProjectResponse
)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_accessible_project(
        db,
        project_id,
        current_user
    )


@router.put(
    "/{project_id}",
    response_model=ProjectResponse
)
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = get_accessible_project(
        db,
        project_id,
        current_user
    )

    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the project owner can update this project"
        )

    update_data = project_data.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update data provided"
        )

    for field, value in update_data.items():
        setattr(project, field, value)

    activity = ActivityLog(
        user_id=current_user.id,
        project_id=project.id,
        action="project_updated",
        description=f"Updated project: {project.name}"
    )

    db.add(activity)
    db.commit()
    db.refresh(project)

    return project


@router.delete(
    "/{project_id}"
)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = get_accessible_project(
        db,
        project_id,
        current_user
    )

    if project.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the project owner can delete this project"
        )

    activity = ActivityLog(
        user_id=current_user.id,
        project_id=project.id,
        action="project_deleted",
        description=f"Deleted project: {project.name}"
    )

    db.add(activity)
    db.delete(project)
    db.commit()

    return {
        "message": "Project deleted successfully"
    }
