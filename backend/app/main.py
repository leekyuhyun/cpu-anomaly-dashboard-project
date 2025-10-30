from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # CORS 임포트

app = FastAPI()

# --- CORS 미들웨어 설정 ---
# React 앱이 실행되는 http://localhost:3000 의 요청을 허용합니다.
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # 허용할 출처 목록
    allow_credentials=True,    # 쿠키 허용
    allow_methods=["*"],       # 모든 HTTP 메소드 허용
    allow_headers=["*"],       # 모든 HTTP 헤더 허용
)


# --- 기본 API 엔드포인트 ---

@app.get("/")
def read_root():
    return {"Hello": "Backend"}

# 프론트엔드 테스트용 API
@app.get("/api/hello")
def read_hello():
    return {"message": "Hello from FastAPI!"}