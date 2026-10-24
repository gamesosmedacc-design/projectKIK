from sqlalchemy import create_engine, select, Column, Integer, String
from utils.tools.database import base, engine, Session_local
from utils.tools.attendance import Attendance
from datetime import datetime
from zoneinfo import ZoneInfo

def get_today_row(users_target_id):
    session = Session_local()
    today = datetime.now(ZoneInfo("Asia/Makassar")).date()

    try :
        data = session.scalars(select(Attendance).where(Attendance.users_id == users_target_id, Attendance.date_insert == today)).first()

        if data :
            print("data ada")

        else :
            print("data tidak ada")

        return data
    except:
        session.rollback()
    finally:
        session.close()