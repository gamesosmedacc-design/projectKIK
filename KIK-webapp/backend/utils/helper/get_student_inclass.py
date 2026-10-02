from sqlalchemy import create_engine, select, Column, Integer, String, and_
from utils.tools.database import base, engine, Session_local
from utils.tools.users import User
from utils.tools.attendance import Attendance
from datetime import datetime
from zoneinfo import ZoneInfo

def get_student_perperson(targetclass):
    session = Session_local()
    today = datetime.now(ZoneInfo("Asia/Makassar")).date()

    try :
        student_list = select(User, Attendance.status).outerjoin(Attendance, and_(User.id == Attendance.users_id, Attendance.date_insert == today)).where(User.class_ == targetclass)
        return session.execute(student_list).all()
    except :
        session.rollback()
    finally:
        session.close()
