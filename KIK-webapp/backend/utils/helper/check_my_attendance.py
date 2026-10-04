from sqlalchemy import create_engine, select, Column, Integer, String
from utils.tools.database import base, engine, Session_local
from utils.tools.attendance import Attendance
from datetime import datetime
from zoneinfo import ZoneInfo

def check_my_attendance(session_id):
    session = Session_local()
    today = datetime.now(ZoneInfo("Asia/Makassar")).date()
    
    try :
        data_absen = session.scalars(select(Attendance).where(Attendance.users_id == session_id, Attendance.date_insert == today)).first()
        if data_absen :
            return {
                "users_id" : data_absen.users_id,
                "status" : data_absen.status
            }
        return None
    except Exception as e :
        session.rollback()
    finally:
        session.close()