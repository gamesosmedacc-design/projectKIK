from utils.tools.database import base, engine, Session_local
from utils.tools.users import User
from sqlalchemy import select

def check_user_data(username_data):
    session = Session_local()
    try :
        data = session.scalars(select(User).where(User.username == username_data)).first()
        
        if data:
            print(f"data user found ID = {data.id} | USERNAME = {data.username} \nclass = {data.class_} | role = {data.role}")
        else :
            print("none data")
        return data
    except :
        session.rollback()
    finally :
        session.close()