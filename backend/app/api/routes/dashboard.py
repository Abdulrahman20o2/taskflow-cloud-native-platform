
from fastapi import APIRouter, Depends
from sqlalchemy import select, or_, func, case
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.routes.auth import get_current_user
from app.models import Project, ProjectMember, Task, User
from app.schemas.dashboard import DashboardResponse


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get(
    "/stats",
    response_model=DashboardResponse
)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project_statement = (
        select(Project.id)
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
        .distinct()
    )

    project_ids = db.scalars(project_statement).all()

    total_projects = len(project_ids)

    if not project_ids:
        return DashboardResponse(
            total_projects=0,
            total_tasks=0,
            pending_tasks=0,
            in_progress_tasks=0,
            completed_tasks=0,
            completion_rate=0.0
        )

    task_statement = (
        select(
            func.count(Task.id).label("total"),
            func.sum(
                case(
                    (Task.status == "pending", 1),
                    else_=0
                )
            ).label("pending"),
            func.sum(
                case(
                    (Task.status == "in_progress", 1),
                    else_=0
                )
            ).label("in_progress"),
            func.sum(
                case(
                    (Task.status == "completed", 1),
                    else_=0
                )
            ).label("completed")
        )
        .where(Task.project_id.in_(project_ids))
    )

    result = db.execute(task_statement).one()

    total_tasks = result.total or 0
    pending_tasks = result.pending or 0
    in_progress_tasks = result.in_progress or 0
    completed_tasks = result.completed or 0

    completion_rate = (
        round((completed_tasks / total_tasks) * 100, 2)
        if total_tasks > 0
        else 0.0
    )

    return DashboardResponse(
        total_projects=total_projects,
        total_tasks=total_tasks,
        pending_tasks=pending_tasks,
        in_progress_tasks=in_progress_tasks,
        completed_tasks=completed_tasks,
        completion_rate=completion_rate
    )
