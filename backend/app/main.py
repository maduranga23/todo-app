from typing import List

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from . import schemas, crud

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/tasks", response_model=schemas.TaskOut, status_code=201)
def create_task(task_in: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db, task_in)


@app.get("/tasks", response_model=List[schemas.TaskOut])
def get_tasks(
    limit: int = Query(5, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return crud.list_tasks(db, limit=limit)


@app.patch("/tasks/{task_id}/complete", response_model=schemas.TaskOut)
def mark_task_complete(task_id: int, db: Session = Depends(get_db)):
    task = crud.complete_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
