from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class CPUMetric(Base):
    """
    모든 CPU 측정값 (Raw Data) 테이블
    """
    __tablename__ = "cpu_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    server_id = Column(Integer, ForeignKey("servers.id")) # servers.id와 연결
    timestamp = Column(DateTime(timezone=True), index=True, server_default=func.now())
    value = Column(Float, nullable=False)
    
    # 관계 설정
    server = relationship("Server", back_populates="metrics")