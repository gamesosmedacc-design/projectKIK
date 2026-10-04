from sqlalchemy import create_engine, select, Column, Integer, String, and_, func
from utils.tools.database import base, engine, Session_local
from utils.tools.users import User
from utils.tools.point import Point

def check_students_point(targetclass):
    session = Session_local()

    try :
        data = select(User, func.coalesce(func.sum(Point.point_increment), 0).label("total_point")).outerjoin(Point, User.id == Point.users_id).where(User.class_ == targetclass).group_by(User.id)

        result = session.execute(data).all()
        return {user.id: points for user, points in result}

    except :
        session.rollback()
    finally :
        session.close()