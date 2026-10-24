from sqlalchemy import create_engine, select, Column, Integer, String
from utils.tools.database import base, engine, Session_local
from utils.tools.updated_attendance import attendance_updated
from datetime import datetime
from zoneinfo import ZoneInfo

def updated_by_insert(attendance_id, old_status, new_status, description, updated_by):
    session = Session_local()

    try :
        data = attendance_updated(
            attendance_id = attendance_id,
            old_status = old_status,
            new_status = new_status,
            description = description,
            updated_by = updated_by
        )

        session.add_all([data])
        session.commit()
    except :
        session.rollback()
    finally :
        session.close()