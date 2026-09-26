from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Date, DateTime, UniqueConstraint
from datetime import date, datetime
from zoneinfo import ZoneInfo
from sqlalchemy.orm import relationship
from database import base

class attendance(base):
    __tablename__ = "attendance"
    id = Column(Integer, autoincrement=True, primary_key=True)
    users_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum("hadir", "sakit", "izin", "alpa", name="status_enum"), nullable=False)
    photo_url = Column(String(), nullable=True)
    file_url = Column(String(), nullable=True)
    reason = Column(String(), nullable=True)
    date = Column(Date, nullable=False, default = lambda: datetime.now(ZoneInfo("Asia/Makassar").date()))

    user = relationship("users", backref="attendance")
    __table_args__ = (
        UniqueConstraint("users_id", "date", name="unique_attendance_per_day"),
    )