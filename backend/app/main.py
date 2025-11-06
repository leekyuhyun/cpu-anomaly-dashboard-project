from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
# [수정] router.py 대신 predict.py에서 api_router를 가져옵니다.
from app.api.predict import api_router 
from app.db.init_db import init_db 

app = FastAPI(
    title="Financial Fraud Detection API", # 제목 수정
    version="1.0.0" 
)

# --- CORS 설정 ---
origins = os.getenv("ORIGINS", "[]").strip("[]").replace("\"", "").split(",")
origins = [origin.strip() for origin in origins if origin.strip()]
if not origins:
    origins = ["http://localhost:3300", "http://127.0.0.1:3300"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 앱 시작 시 DB 테이블 생성 ---
@app.on_event("startup")
def on_startup():
    init_db()

# --- API 라우터 연결 ---
# 이제 /api/test와 /api/predict가 모두 포함된 라우터를 로드합니다.
app.include_router(api_router)

# --- 기본 엔드포인트 ---
@app.get("/")
def read_root():
    return {"Hello": "API Gateway Ready for Frontend Test"}