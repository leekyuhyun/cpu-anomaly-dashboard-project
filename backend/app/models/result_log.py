from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class ResultLog(Base):
    """OmniAnomaly 예측 실행 결과를 기록하는 로그 테이블"""
    __tablename__ = "result_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String) # 예: "SUCCESS", "ERROR"
    details = Column(String, nullable=True) # 예: "Anomalies found: 5"