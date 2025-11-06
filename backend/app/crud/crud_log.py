from sqlalchemy.orm import Session
from app.models.prediction_log import PredictionLog # <- 정확한 클래스 이름으로 임포트
from datetime import datetime

# 기존 ResultLog를 대체하여 PredictionLog를 사용합니다.
def create_prediction_log(db: Session, 
                          status: str, 
                          is_fraud: bool, 
                          probability: float,
                          amount: float, 
                          time: float, 
                          details: str = None) -> PredictionLog:
    """새로운 예측 결과를 DB에 생성합니다."""
    
    db_log = PredictionLog(
        status=status, 
        is_fraud=is_fraud,
        probability=probability,
        amount=amount,
        time=time,
        details=details,
        timestamp=datetime.utcnow()
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log