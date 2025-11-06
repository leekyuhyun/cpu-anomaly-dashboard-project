from app.db import base, session
# [수정] 정확한 클래스 이름 PredictionLog를 사용합니다.
from app.models import PredictionLog 

def init_db():
    """
    DB에 필요한 모든 테이블을 생성합니다.
    (main.py가 시작될 때 호출됩니다)
    """
    try:
        print("Initializing database tables...")
        # 등록된 모든 모델(PredictionLog)을 기반으로 테이블을 생성합니다.
        base.Base.metadata.create_all(bind=session.engine) 
        print("Database tables initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise e