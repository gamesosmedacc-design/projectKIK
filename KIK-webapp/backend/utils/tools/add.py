
from database import base, engine
from users import users
from attendance import attendance

base.metadata.create_all(bind=engine)
print('tabel dibuat')