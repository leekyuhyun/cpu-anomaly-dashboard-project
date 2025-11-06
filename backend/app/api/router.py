from fastapi import APIRouter
from typing import Dict, Any

# [확인 완료]: 라우터 접두사를 /api 로 설정 (최종 경로의 /api 부분을 담당)
api_router = APIRouter(prefix="/api")

# [수정 완료]: 엔드포인트를 /test 로 설정 (최종 경로의 /test 부분을 담당)
# 최종 경로는: {FastAPI URL}/api/test
@api_router.post("/test", tags=["test"])
def test_communication():
    """
    프론트엔드 통신 테스트용 엔드포인트.
    """
    
    return {
        "message": "API 통신 테스트 성공! (Backend에서 응답)",
        "endpoint": "/api/test",
        "timestamp": "Timestamp Placeholder",
        "status": "Ready"
    }