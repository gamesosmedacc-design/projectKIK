from sqlalchemy import text
import sys
import os
from utils.tools.database import engine

with engine.connect() as conn :
    conn.execute(text("DROP TYPE IF EXISTS status_enum CASCADE"))
    conn.commit()