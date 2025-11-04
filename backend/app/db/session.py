import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 1. docker-compose.yml에서 주입된 DATABASE_URL 환경 변수를 가져옵니다.
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None:
    print("Error: DATABASE_URL environment variable not set.")
    # (개발 편의를 위해 기본값을 설정할 수도 있습니다)
    # DATABASE_URL = "postgresql+psycopg2://user:password@db:5432/db"
    
# 2. SQLAlchemy 엔진 생성
engine = create_engine(DATABASE_URL)

# 3. DB 세션(SessionLocal) 생성
#    init_db.py나 API 엔드포인트에서 이 SessionLocal을 사용하여
#    DB와 통신합니다.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)