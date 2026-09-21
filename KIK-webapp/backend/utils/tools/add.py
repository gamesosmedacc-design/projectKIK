from database import base, engine
from users import users

base.metadata.create_all(bind=engine)
print('tabel dibuat')