from sqlalchemy import create_engine, select, Column, Integer, String
from utils.tools.database import base, engine, Session_local
from utils.tools.users import User

def get_from_database(session_id):
    session = Session_local()
    try :
        data = session.scalars(select(User).where(User.id == session_id )).first()
        return data
    except Exception as e:
        session.rollback()
    finally :
        session.close()