from sqlalchemy import create_engine, select, Column, Integer, String
from utils.tools.database import base, engine, Session_local
from utils.tools.point_config import point_config
from datetime import datetime
from zoneinfo import ZoneInfo

def get_point(category_name):   
    session = Session_local()

    try :
        data = session.scalars(select(point_config).where(point_config.category_master == category_name)).first()

        if data:
            print("ok")
            return data.point_weight

        else :
            return 0

        return data
    except:
        session.rollback()
    finally:
        session.close()