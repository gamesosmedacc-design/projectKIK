from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Date, UniqueConstraint
from datetime import datetime
from zoneinfo import ZoneInfo
from sqlalchemy.orm import relationship
from utils.tools.users import User
from utils.tools.database import base

class Point(base):
    __tablename__ = "point"
    id = Column(Integer, autoincrement=True, primary_key=True, unique=True)
    users_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    point_increment = Column(Integer, default=0, nullable=False)
    category = Column(String(50), nullable=False)
    date_log = Column(Date, nullable=True, default = lambda: datetime.now(ZoneInfo("Asia/Makassar")).date())

    user = relationship("User", backref="point")