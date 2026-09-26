from sqlalchemy import create_engine, select, Column, Integer, String
from utils.tools.database import base, engine, Session_local
from utils.tools.users import users

session = Session_local()
def get_from_database(session_id):
    data = session.scalars(select(users).where(users.id == session_id )).first()

    return data