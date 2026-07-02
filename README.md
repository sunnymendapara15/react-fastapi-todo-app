# React + FastAPI Todo App

This repository contains a full-stack todo list project with a **React + Vite** frontend and a **FastAPI** backend. The backend exposes a simple REST API for creating, updating, and deleting tasks, and the frontend consumes that API to render a responsive task board.

## Repository layout

- `backend/` – FastAPI service that manages todos in memory and exposes CRUD endpoints.
- `frontend/` – Vite-powered React application that interacts with the backend via `fetch`.

## Prerequisites

- Python 3.11 or newer
- Node.js 20 or newer (Node 18+ should also work) and npm

## Backend setup

1. `cd backend`
2. `python -m venv .venv`
3. `pip install -r requirements.txt`
4. Run `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`

The API is now available at `http://localhost:8000/tasks`.

## Frontend setup

1. `cd frontend`
2. `npm install`
3. Optionally set `VITE_API_URL` (default: `http://localhost:8000`).
4. `npm run dev -- --host 0.0.0.0 --port 5173`

Navigate to `http://localhost:5173` to view the UI, which will communicate with the backend API.

## API Overview

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/tasks` | Fetch all tasks |
| `POST` | `/tasks` | Create a new task (requires `title`)|
| `PATCH` | `/tasks/{id}` | Update title/description/completed state |
| `DELETE` | `/tasks/{id}` | Remove a task |

## Environment

If you run the frontend from a different host or port than the backend, set `VITE_API_URL` (for example, `VITE_API_URL=http://localhost:8000`).
