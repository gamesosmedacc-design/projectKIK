from sqlalchemy import create_engine, select, Column, Integer, String
from utils.tools.database import base, engine, Session_local
from utils.tools.attendance import Attendance
from datetime import datetime
from zoneinfo import ZoneInfo

def get_update_row(users_target_id, new_status, new_reason, new_file64):
    session = Session_local()
    today = datetime.now(ZoneInfo("Asia/Makassar")).date()

    try :
        row = session.scalars(select(Attendance).where(Attendance.users_id == users_target_id, Attendance.date_insert == today)).first()

        if not row :
            print("murid belum absen hari ini")
            return None
        
        row.status = new_status
        row.reason = new_reason
        row.file_url = new_file64

        session.commit()
        print(f"data ditemukan ID:{row.id} USER:{row.users_id} STATUS:{row.status}")
        return row
    except :
        session.rollback()
        return 
    finally :
        session.close()