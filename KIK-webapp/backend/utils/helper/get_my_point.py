from sqlalchemy import create_engine, select, Column, Integer, String, and_, func
from utils.tools.database import base, engine, Session_local
from utils.tools.point import Point

def get_my_point(session_id):
    session = Session_local()

    try :
        data = session.scalars(select(func.coalesce(func.sum(Point.point_increment), 0)).where(Point.users_id == session_id)).first()
        return data if data is not None else 0
    except :
        session.rollback()
    finally:
        session.close()