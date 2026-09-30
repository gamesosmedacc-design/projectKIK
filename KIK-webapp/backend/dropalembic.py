from utils.tools.database import engine
from sqlalchemy import text

with engine.connect() as connection:
    connection.execute(text("DROP TABLE IF EXISTS alembic_version CASCADE;"))
    connection.commit()