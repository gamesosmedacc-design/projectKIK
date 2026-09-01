from sqlalchemy import create_engine, Column, Integer, String, DateTime, select, ForeignKey, Float, Boolean
from sqlalchemy.orm import declarative_base, Session
from datetime import datetime
from zoneinfo import ZoneInfo
from dotenv import load_dotenv
import os

load_dotenv()
base = declarative_base()
db_path = f'postgresql://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PW')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}'
if db_path:
    print("path is defined, engine created \n")

else :
    print('path is not defined')

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
    data = session.scalars(select(users).where(users.id == 2)).first()
    session.delete(data)
    session.commit()
    print('data dihapus')