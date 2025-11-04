import os
import pandas as pd
from sqlalchemy import create_engine
from app.db.session import SessionLocal, engine
from app.db.base import Base

# [수정됨] app.models.cpu 대신 app.models에서 바로 가져옵니다.
from app.models import Server, CPUMetric, Anomaly
# [수정됨] app.crud.crud_cpu에서 함수를 가져옵니다.
from app.crud.crud_cpu import create_server

# (주의!) Kaggle CSV 파일 경로 (Dockerfile WORKDIR /backend 기준)
# (backend/data/cpu_data.csv 파일을 미리 준비해야 합니다!)
KAGGLE_CSV_PATH = "data/cpu_data.csv" # 사용할 CSV 파일명

def init_db():
    db = SessionLocal()
    
    print("Initializing database...")
    
    # --- 1. 테이블 생성 ---
    # app/models/ 에 정의된 모든 테이블 (Base를 상속받은)을
    # engine (PostgreSQL DB)에 실제로 생성합니다.
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

    # --- 2. Kaggle 서버 등록 ---
    kaggle_server = db.query(Server).filter(Server.name == "Kaggle-Test-Server").first()
    if not kaggle_server:
        kaggle_server = create_server(db, server_name="Kaggle-Test-Server")
        print(f"Server '{kaggle_server.name}' created with id {kaggle_server.id}.")
    else:
        print(f"Server '{kaggle_server.name}' already exists with id {kaggle_server.id}.")
        
    # --- 3. Kaggle CSV 데이터 적재 ---
    try:
        df = pd.read_csv(KAGGLE_CSV_PATH)
        print(f"Loaded {len(df)} rows from {KAGGLE_CSV_PATH}.")
        
        # (컬럼명 확인) CSV 컬럼명이 'timestamp', 'value'가 맞는지 확인
        if 'timestamp' not in df.columns or 'value' not in df.columns:
            print("Error: CSV must have 'timestamp' and 'value' columns.")
            return

        df_renamed = df[['timestamp', 'value']]
        df_renamed['server_id'] = kaggle_server.id
        
        print("Inserting data into 'cpu_metrics' table...")
        df_renamed.to_sql(
            'cpu_metrics', 
            con=engine, 
            if_exists='append', # 기존 데이터에 추가 (중복 실행 방지)
            index=False
        )
        print("Kaggle data insertion complete.")
        
    except FileNotFoundError:
        print(f"Warning: Kaggle CSV file not found at {KAGGLE_CSV_PATH}.")
        print("Please place the Kaggle CSV at 'backend/data/cpu_data.csv'")
    except Exception as e:
        print(f"Error loading Kaggle data: {e}")
    
    db.close()

if __name__ == "__main__":
    init_db()