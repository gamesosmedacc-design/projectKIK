from sqlalchemy import create_engine, select, Column, Integer, String
from sqlalchemy.orm import declarative_base, Session
from dotenv import load_dotenv
import os

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
with Session(engine) as session:
    def check_user_data(username_data):
        data_username = username_data

        data = session.scalars(select(users).where(users.username == username_data)).first()
        if data:
            print(f"data user found ID = {data.id} | USERNAME = {data.username} \nclass = {data.class_} | role = {data.role}")

        else :
            print("none data")

        return data

# check_user_data("Xenozone")