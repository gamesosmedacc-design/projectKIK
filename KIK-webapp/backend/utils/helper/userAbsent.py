from sqlalchemy import create_engine, select, Column, Integer, String
from utils.tools.database import base, engine, Session_local
from utils.tools.attendance import attendance

def user_absent(user_id, data_status, data_photo_url, data_latitude, data_longitude, data_file_url, data_reason):
    session = Session_local()
    try :
        data_absent = attendance(
            users_id = user_id,
            status = data_status,
            photo_url = data_photo_url,
            user_latitude = data_latitude,
            user_longitude = data_longitude,
            file_url = data_file_url,
            reason = data_reason
        )
        session.add_all([data_absent])
        session.commit()
    except :
        session.rollback()
        raise
    finally :
        session.close()
