
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ActivityResponse(BaseModel):
    id: int
    user_id: int | None
    project_id: int | None
    task_id: int | None
    action: str
    description: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
