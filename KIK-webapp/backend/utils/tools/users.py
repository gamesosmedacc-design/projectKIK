from sqlalchemy import create_engine, select, Column, Integer, String
from utils.tools.database import base

class users(base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=False, unique=True)
    hashed_pw = Column(String(200), nullable=False)
    call_name = Column(String(25), nullable=False)
    subject = Column(String(50), nullable=True)
    class_ = Column(String(10), nullable=True)
    role = Column(String(20), nullable=False)
    email = Column(String(50), nullable=False)
    nis = Column(String(20), nullable=True, unique=True)
    phone_number = Column(String(12), nullable=True)