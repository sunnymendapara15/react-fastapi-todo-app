from itertools import count
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Todo List API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = ""


class Task(TaskBase):
    id: int
    completed: bool = False


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


tasks: List[Task] = []
_id_generator = count(1)


def _get_task(task_id: int) -> Task:
    for task in tasks:
        if task.id == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")


@app.get("/tasks", response_model=List[Task])
def list_tasks() -> List[Task]:
    return tasks


@app.post("/tasks", response_model=Task, status_code=201)
def create_task(payload: TaskBase) -> Task:
    task = Task(id=next(_id_generator), completed=False, **payload.dict())
    tasks.append(task)
    return task


@app.patch("/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, payload: TaskUpdate) -> Task:
    task = _get_task(task_id)

    if payload.title is not None:
        task.title = payload.title
    if payload.description is not None:
        task.description = payload.description
    if payload.completed is not None:
        task.completed = payload.completed

    return task


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int) -> None:
    task = _get_task(task_id)
    tasks.remove(task)
