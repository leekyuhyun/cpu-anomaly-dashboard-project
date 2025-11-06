from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean
from sqlalchemy.sql import func
from app.db.base import Base

class PredictionLog(Base):
    """신용카드 사기 탐지 모델의 예측 결과를 기록하는 로그 테이블"""
    __tablename__ = "prediction_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # 예측 결과
    status = Column(String, index=True)      # 'NORMAL', 'FRAUD', 'ERROR'
    is_fraud = Column(Boolean, default=False) # 사기 여부 (True/False)
    probability = Column(Float)              # 사기 확률 (0.0 ~ 1.0)
    
    # 주요 입력 데이터 (Audit 목적)
    amount = Column(Float)                   # 원본 거래 금액
    time = Column(Float)                     # 원본 거래 시간 (초)
    
    # 로그 정보
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    details = Column(String, nullable=True)  # 상세 오류 정보 또는 메타데이터