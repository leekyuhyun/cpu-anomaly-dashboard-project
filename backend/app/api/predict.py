from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import joblib
import os
import pandas as pd
import numpy as np
from app.db.session import get_db
# [수정] DB 로깅을 위해 'PredictionLog' 모델과 'create_prediction_log' 함수를 임포트
from app.crud.crud_log import create_prediction_log 
from app.models.prediction_log import PredictionLog

# --- 환경 변수에서 경로 로드 ---
MODEL_PATH = os.getenv("MODEL_PATH")
AMOUNT_SCALER_PATH = os.getenv("AMOUNT_SCALER_PATH")
TIME_SCALER_PATH = os.getenv("TIME_SCALER_PATH")

# --- 모델과 스케일러를 메모리에 미리 로드 ---
FINAL_MODEL = None
AMOUNT_SCALER = None
TIME_SCALER = None
PREDICTION_THRESHOLD = 0.5 # RandomForest 예측 임계값 (0.5)

try:
    FINAL_MODEL = joblib.load(MODEL_PATH)
    AMOUNT_SCALER = joblib.load(AMOUNT_SCALER_PATH)
    TIME_SCALER = joblib.load(TIME_SCALER_PATH)
    print("✅ 모델 및 스케일러 로드 성공!")
except Exception as e:
    print(f"❌ 모델/스케일러 로드 실패! 경로 확인 필요: {e}")
    

# --- Pydantic 모델 정의 (입력 스키마) ---
# 신용카드 데이터셋의 30개 피처를 그대로 사용합니다.
class TransactionInput(BaseModel):
    Time: float
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Amount: float # 원본 Amount


# --- API 라우터 정의 ---
# [수정] main.py가 찾는 'api_router'로 변수 이름을 변경합니다.
api_router = APIRouter(prefix="/api")

# [통합] /test 엔드포인트를 이 파일에 포함시킵니다.
@api_router.post("/test", tags=["test"])
def test_communication(db: Session = Depends(get_db)):
    """
    프론트엔드 통신 테스트 및 DB 연결 테스트용 엔드포인트.
    """
    return {
        "message": "API 통신 및 DB 연결 테스트 성공!",
        "endpoint": "/api/test", 
        "db_status": "Connected & Session OK",
        "status": "Ready"
    }

# 금융 사기 탐지 핵심 엔드포인트
@api_router.post("/predict", tags=["Prediction"])
def predict_transaction(input_data: TransactionInput, db: Session = Depends(get_db)):
    """
    신용카드 거래 정보를 받아 사기 여부를 탐지하고 결과를 DB에 저장합니다.
    """
    
    if FINAL_MODEL is None:
        raise HTTPException(status_code=503, detail="모델 로드 실패. 서버 상태를 확인하세요.")

    try:
        # 1. 입력 데이터를 DataFrame으로 변환
        input_df = pd.DataFrame([input_data.model_dump()])
        
        # 2. Time, Amount 스케일링 (2개의 스케일러 사용)
        time_data = input_df['Time'].values.reshape(-1, 1)
        amount_data = input_df['Amount'].values.reshape(-1, 1)
        
        input_df['Scaled_Time'] = TIME_SCALER.transform(time_data)[:, 0]
        input_df['Scaled_Amount'] = AMOUNT_SCALER.transform(amount_data)[:, 0]

        # 3. 모델 입력 피처 준비 (Notebook 순서에 맞춘 30개 피처)
        feature_columns = [f'V{i}' for i in range(1, 29)] + ['Scaled_Amount', 'Scaled_Time']
        X_predict = input_df[feature_columns]

        # 4. RandomForest 예측 (확률 사용)
        prediction_proba = FINAL_MODEL.predict_proba(X_predict.values)[0]
        fraud_probability = prediction_proba[1] # 사기(Class 1) 확률
        
        is_fraud = fraud_probability >= PREDICTION_THRESHOLD
        status_label = "FRAUD" if is_fraud else "NORMAL"
        
        # 5. DB 로깅
        # [수정] create_log_entry -> create_prediction_log 함수 사용
        log_entry = create_prediction_log(
            db=db, 
            status=status_label, 
            is_fraud=is_fraud,
            probability=float(fraud_probability),
            amount=input_data.Amount,
            time=input_data.Time,
            details=f"V1={input_data.V1:.2f}, V2={input_data.V2:.2f}" # 샘플 로그
        )
        
        # 6. 프론트엔드에 결과 반환
        # [추가] 차트 시각화를 위한 주요 변수 값
        key_features = {
            "V14": input_data.V14,
            "V10": input_data.V10,
            "V4": input_data.V4,
        }

        return {
            "prediction": status_label,
            # [수정] numpy.bool_ 타입을 bool()로 감싸서 파이썬 기본 타입으로 변환
            "is_fraud": bool(is_fraud), 
            "fraud_probability": float(fraud_probability),
            "log_id": log_entry.id,
            "key_features": key_features # 주요 변수 추가
        }
    
    except Exception as e:
        try:
            # 오류 발생 시 DB에 ERROR 로그 남기기
            create_prediction_log(db=db, status="ERROR", is_fraud=False, probability=0.0, amount=input_data.Amount, time=input_data.Time, details=f"Model error: {e}")
        except:
             pass 
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")