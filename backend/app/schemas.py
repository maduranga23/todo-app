from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class TaskBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class TaskOut(TaskBase):
    id: int
    completed: bool
    created_at: datetime

    class Config:
        from_attributes = True  
