from sqlalchemy import create_engine, select, Column, Integer, String, and_, func
from utils.tools.database import base, engine, Session_local
from utils.tools.attendance import Attendance

def get_my_history(session_id):
    session = Session_local()

    try :
        data = session.scalars(select(Attendance).where(Attendance.users_id == session_id)).all()
        histories = {history: history for history in data}
        return histories
    except :
        session.rollback()
    finally :
        session.close()