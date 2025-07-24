from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

from . import models, schemas


def create_task(db: Session, task_in: schemas.TaskCreate) -> models.Task:
    task = models.Task(title=task_in.title, description=task_in.description)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def list_tasks(db: Session, limit: int = 5) -> List[models.Task]:
    stmt = (
        select(models.Task)
        .where(models.Task.completed == False)  # noqa: E712
        .order_by(models.Task.created_at.desc(), models.Task.id.desc())
        .limit(limit)
    )
    return db.scalars(stmt).all()


def complete_task(db: Session, task_id: int):
    task = db.get(models.Task, task_id)
    if not task:
        return None
    if not task.completed:
        task.completed = True
        db.add(task)
        db.commit()
        db.refresh(task)
    return task
