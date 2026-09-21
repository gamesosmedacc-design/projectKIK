from sqlalchemy import create_engine, select, Column, Integer, String
from utils.tools.database import base, engine, Session_local
from utils.tools.users import users

session = Session_local()

def insert_user_data(data_username, hash_password, data_call_name, data_subject, data_class, data_role, data_email, data_nis, data_phone_number):
    data = users(
        username = data_username,
        hashed_pw = hash_password,
        call_name = data_call_name,
        subject = data_subject,
        class_ = data_class,
        role = data_role,
        email = data_email,
        nis = data_nis,
        phone_number = data_phone_number
        )

    session.add_all([data])
    session.commit()