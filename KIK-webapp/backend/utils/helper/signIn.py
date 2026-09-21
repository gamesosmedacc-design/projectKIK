from utils.tools.database import base, engine, Session_local
from utils.tools.users import users
from sqlalchemy import select

session = Session_local()
def check_user_data(username_data):

    data = session.scalars(select(users).where(users.username == username_data)).first()
    if data:
        print(f"data user found ID = {data.id} | USERNAME = {data.username} \nclass = {data.class_} | role = {data.role}")

    else :
        print("none data")

    return data