from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Server(Base):
    """
    모니터링할 서버 목록 테이블
    """
    __tablename__ = "servers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 관계 설정 (문자열로 참조)
    metrics = relationship("CPUMetric", back_populates="server")
    anomalies = relationship("Anomaly", back_populates="server")