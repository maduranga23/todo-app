# ToDo App (Full Stack)

This is a simple ToDo web application built with:
- **Backend**: FastAPI (Python)
- **Frontend**: React + TailwindCSS
- **Database**: PostgreSQL
- **Containerization**: Docker + docker-compose

---

## Features
- Create tasks with title & description.
- Display only the latest 5 tasks.
- Mark tasks as done (removes them from UI).
- Data stored in PostgreSQL database.

---

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [docker-compose](https://docs.docker.com/compose/)

---

## Setup & Run

```bash
# Clone repository
git clone https://github.com/maduranga23/todo-app.git
cd todo-app

# Build and start containers
docker compose up --build
