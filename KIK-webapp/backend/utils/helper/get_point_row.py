from sqlalchemy import create_engine, select, Column, Integer, String
from utils.tools.database import base, engine, Session_local
from utils.tools.point import Point
from datetime import datetime
from zoneinfo import ZoneInfo

def get_update_point_row(users_target_id, new_point, new_category):
    session = Session_local()
    today = datetime.now(ZoneInfo("Asia/Makassar")).date()

    try:
        data = session.scalars(select(Point).where(Point.users_id == users_target_id, Point.date_log == today)).first()

        if not data:
            print("data tidak ada")
            return None

        data.point_increment = new_point
        data.category = new_category

        session.commit()
        return data
    except:
        session.rollback()
    finally:
        session.close()