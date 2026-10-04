from sqlalchemy import create_engine, select, Column, Integer, String, and_, func
from utils.tools.database import base, engine, Session_local
from utils.tools.attendance import Attendance

def get_my_summary(session_id):
    session = Session_local()

    try :
        data = (select(Attendance.status, func.count(Attendance.id)).where(Attendance.users_id == session_id).group_by(Attendance.status))
        result = session.execute(data).all()
        return {status: count for status, count in result}
    except:
        session.rollback()
        return {}
    finally:
        session.close()