from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Date, UniqueConstraint
from datetime import datetime
from zoneinfo import ZoneInfo
from sqlalchemy.orm import relationship
from utils.tools.users import users
from utils.tools.database import base

class attendance(base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True)
    users_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum("Hadir", "Sakit", "Izin", "Alpa", "Terlambat", name="status_enum"), nullable=False )
    photo_url = Column(String(), nullable=True) 
    user_latitude = Column(String(), nullable=True)
    user_longitude = Column(String(), nullable=True)
    file_url = Column(String(), nullable=True)
    reason = Column(String(), nullable=True)
    date_insert = Column(Date, nullable=False, default = lambda: datetime.now(ZoneInfo("Asia/Makassar")).date())

    user = relationship("users", backref="attendance")
    __table_args__ = (
        UniqueConstraint("users_id", "date_insert", name="unique_attendance_per_day"),
    )