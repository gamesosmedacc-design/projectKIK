from sqlalchemy import create_engine, select, Column, Integer, String
from sqlalchemy.orm import declarative_base, Session
from dotenv import load_dotenv
import os
import bcrypt

load_dotenv()
db_path = f'postgresql://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PW')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}'
if db_path:
    print('db path is defined engine created')

else :
    print('db path is not defined')

base = declarative_base()
class users(base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=False)
    hashed_pw = Column(String(200), nullable=False)
    class_ = Column(String(10), nullable=False)
    role = Column(String(20), nullable=False)
    email = Column(String(50), nullable=False)
    nis = Column(String(20), nullable=True)
    phone_number = Column(String(12), nullable=True)

engine = create_engine(db_path)
with Session(engine) as session :
    def insert_user_data(data_username, hash_password, data_class, data_role, data_email, data_nis, data_phone_number):
        data = users(
            username = data_username,
            hashed_pw = hash_password,
            class_ = data_class,
            role = data_role,
            email = data_email,
            nis = data_nis,
            phone_number = data_phone_number
        )

        session.add_all([data])
        session.commit()

# insert_user_data("Hady lamar", hashed_pw_str, "X TKJ", "murid", "hadylamarKDG@gmail.com", "0813", "081234567890")
