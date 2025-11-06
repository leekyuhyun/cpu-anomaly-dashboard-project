import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL is None:
    print("Error: DATABASE_URL environment variable not set.")
    
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """DB 세션 의존성 주입용 함수"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()