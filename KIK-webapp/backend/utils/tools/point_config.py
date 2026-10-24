from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Date, UniqueConstraint
from datetime import datetime
from zoneinfo import ZoneInfo
from utils.tools.database import base

class point_config(base):
    __tablename__ = "point_config"
    id = Column(Integer, autoincrement=True, primary_key=True)
    category_master = Column(String(), nullable=False)
    point_weight = Column(Integer, nullable=False)