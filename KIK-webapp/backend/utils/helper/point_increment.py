from sqlalchemy import create_engine, select, Column, Integer, String, and_, func
from utils.tools.database import base, engine, Session_local
from utils.tools.point import Point

def insert_point(session_id, point_increment, category):
    session = Session_local()
    try :
        data = Point(
            users_id = session_id,
            point_increment = point_increment,
            category = category
        )

        session.add_all([data])
        session.commit()
    except :
        session.rollback()
    finally :
        session.close()