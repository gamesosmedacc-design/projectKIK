from sqlalchemy import create_engine, select, Column, Integer, String
from utils.tools.database import base, engine, Session_local
from utils.tools.users import users

def get_groups_from_database():
    session = Session_local()
    try :
        data = session.scalars(select(users).where(users.role == "Murid")).all()
        return data
    except Exception as e:
        session.rollback()
    finally :
        session.close()