from sqlalchemy import create_engine, select, Column, Integer, String
from sqlalchemy.orm import declarative_base, Session, sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
db_path = f'postgresql://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PW')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}'
if db_path:
    print('db path is defined engine created')

else :
    print('db path is not defined')

base = declarative_base()

engine = create_engine(db_path)

Session_local = sessionmaker(bind=engine)