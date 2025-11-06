from app.db import base, session
# (DB 모델 파일 임포트 - 3단계에서 생성)
from app.models.result_log import ResultLog 

def init_db():
    """
    DB에 필요한 모든 테이블을 생성합니다.
    (main.py가 시작될 때 호출됩니다)
    """
    try:
        print("Initializing database tables...")
        base.Base.metadata.create_all(bind=session.engine)
        print("Database tables initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise e