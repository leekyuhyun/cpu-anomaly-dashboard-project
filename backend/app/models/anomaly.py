from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Anomaly(Base):
    """
    탐지된 이상 징후 결과 테이블
    """
    __tablename__ = "anomalies"
    
    id = Column(Integer, primary_key=True, index=True)
    server_id = Column(Integer, ForeignKey("servers.id"))
    timestamp = Column(DateTime(timezone=True), index=True)
    value = Column(Float)
    model_used = Column(String, default="default_model") # 어떤 모델이 탐지했는지
    
    # 관계 설정
    server = relationship("Server", back_populates="anomalies")