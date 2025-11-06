from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
# [수정 전]: from app.api.router import api_router 
from app.api.router import api_router
# from app.db.init_db import init_db 

app = FastAPI(
    title="Frontend Communication Test API",
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

# --- API 라우터 연결 ---
app.include_router(api_router)

# --- 기본 엔드포인트 ---
@app.get("/")
def read_root():
    return {"Hello": "API Gateway Ready for Frontend Test"}