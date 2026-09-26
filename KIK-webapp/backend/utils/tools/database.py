from sqlalchemy import create_engine, select, Column, Integer, String
from sqlalchemy.orm import declarative_base, Session, sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
db_path = f"{os.getenv('FULL_URL_DB')}"
if db_path:
    print('db path is defined engine created')

else :
    print('db path is not defined')

base = declarative_base()

engine = create_engine(db_path)

Session_local = sessionmaker(bind=engine)