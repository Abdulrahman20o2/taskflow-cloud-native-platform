
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.routes.auth import get_current_user
from app.api.routes.projects import get_accessible_project
from app.models import Task, ActivityLog, User
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse


router = APIRouter(
    tags=["Tasks"]
)


@router.post(
    "/projects/{project_id}/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED
)
def create_task(
    project_id: int,
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = get_accessible_project(
        db,
        project_id,
        current_user
    )

    task = Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
        project_id=project.id
    )

    db.add(task)
    db.flush()

    activity = ActivityLog(
        user_id=current_user.id,
        project_id=project.id,
        task_id=task.id,
        action="task_created",
        description=f"Created task: {task.title}"
    )

    db.add(activity)
    db.commit()
    db.refresh(task)

    return task


@router.get(
    "/projects/{project_id}/tasks",
    response_model=list[TaskResponse]
)
def list_project_tasks(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = get_accessible_project(
        db,
        project_id,
        current_user
    )

    statement = (
        select(Task)
        .where(Task.project_id == project.id)
        .order_by(Task.created_at.desc())
    )

    tasks = db.scalars(statement).all()

    return tasks


@router.get(
    "/tasks/{task_id}",
    response_model=TaskResponse
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    statement = (
        select(Task)
        .join(Task.project)
        .where(Task.id == task_id)
    )

    task = db.scalars(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    get_accessible_project(
        db,
        task.project_id,
        current_user
    )

    return task


@router.put(
    "/tasks/{task_id}",
    response_model=TaskResponse
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    statement = select(Task).where(Task.id == task_id)
    task = db.scalars(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    get_accessible_project(
        db,
        task.project_id,
        current_user
    )

    update_data = task_data.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No update data provided"
        )

    for field, value in update_data.items():
        setattr(task, field, value)

    activity = ActivityLog(
        user_id=current_user.id,
        project_id=task.project_id,
        task_id=task.id,
        action="task_updated",
        description=f"Updated task: {task.title}"
    )

    db.add(activity)
    db.commit()
    db.refresh(task)

    return task


@router.delete(
    "/tasks/{task_id}"
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    statement = select(Task).where(Task.id == task_id)
    task = db.scalars(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    get_accessible_project(
        db,
        task.project_id,
        current_user
    )

    activity = ActivityLog(
        user_id=current_user.id,
        project_id=task.project_id,
        task_id=task.id,
        action="task_deleted",
        description=f"Deleted task: {task.title}"
    )

    db.add(activity)
    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }
