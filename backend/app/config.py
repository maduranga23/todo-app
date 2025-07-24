import os


def get_database_url() -> str:
   
    url = os.getenv("DATABASE_URL")
    if url:
        return url

    user = os.getenv("DB_USER", "todo_user")
    pw = os.getenv("DB_PASSWORD", "todo_pass")
    host = os.getenv("DB_HOST", "db")
    port = os.getenv("DB_PORT", "5432")
    name = os.getenv("DB_NAME", "todo_db")
    return f"postgresql+psycopg2://{user}:{pw}@{host}:{port}/{name}"
