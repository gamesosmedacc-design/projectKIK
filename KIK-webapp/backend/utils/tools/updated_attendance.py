# from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Date, UniqueConstraint
# from datetime import datetime
# from zoneinfo import ZoneInfo
# from sqlalchemy.orm import relationship
# from utils.tools.attendance import Attendance
# from utils.tools.users import User
# from utils.tools.database import base

# class attendance_updated(base):
#     __tablename__ = 'attendance_updated'
#     id = Column(Integer, autoincrement=True, primary_key=True)
#     attendance_id =Column(Integer, ForeignKey("attendance.id"), nullable=False)
#     old_status = Column(String(), nullable=False)
#     new_status = Column(String(), nullable=False)
#     description = Column(String(), nullable=False)
#     updated_by = Column(Integer, ForeignKey("users.id"), nullable=False)
#     timestamp = Column(Date, nullable=True, default = lambda: datetime.now(ZoneInfo("Asia/Makassar")).date())

#     user = relationship("User", backref="attendance")
#     __table_args__ = (
#         UniqueConstraint("users_id", "date_insert", name="unique_attendance_per_day"),
#     )

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint
from datetime import datetime
from zoneinfo import ZoneInfo
from sqlalchemy.orm import relationship
from utils.tools.attendance import Attendance
from utils.tools.users import User
from utils.tools.database import base

class attendance_updated(base):
    __tablename__ = 'attendance_updated'
    
    id = Column(Integer, autoincrement=True, primary_key=True)
    attendance_id = Column(Integer, ForeignKey("attendance.id"), nullable=False)
    old_status = Column(String(), nullable=False)
    new_status = Column(String(), nullable=False)
    description = Column(String(), nullable=False) # Bisa juga dipakai untuk nyimpen 'reason'
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Pakai DateTime supaya jam, menit, dan detiknya ikut tercatat
    timestamp = Column(DateTime, nullable=False, default=lambda: datetime.now(ZoneInfo("Asia/Makassar")))

    # Relasi ke User & Attendance
    user = relationship("User", backref="attendance_updates")
    attendance = relationship("Attendance", backref="history_logs")