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
STATS_PATH = os.getenv("STATS_PATH") # 통계 파일 경로 추가

# --- 모델과 스케일러, 통계치를 메모리에 미리 로드 ---
FINAL_MODEL = None
AMOUNT_SCALER = None
TIME_SCALER = None
FEATURE_STATS = None # 통계치 저장 변수
PREDICTION_THRESHOLD = 0.5

try:
    FINAL_MODEL = joblib.load(MODEL_PATH)
    AMOUNT_SCALER = joblib.load(AMOUNT_SCALER_PATH)
    TIME_SCALER = joblib.load(TIME_SCALER_PATH)
    FEATURE_STATS = joblib.load(STATS_PATH) # 통계 파일 로드
    print("✅ 모델, 스케일러 및 통계 파일 로드 성공!")
except Exception as e:
    print(f"❌ 모델/스케일러/통계 파일 로드 실패! 경로 확인 필요: {e}")

# --- Pydantic 모델 정의 (입력 스키마) ---
# 신용카드 데이터셋의 30개 피처를 그대로 사용합니다.
class TransactionInput(BaseModel):
    Time: float
    V1: float; V2: float; V3: float; V4: float; V5: float
    V6: float; V7: float; V8: float; V9: float; V10: float
    V11: float; V12: float; V13: float; V14: float; V15: float
    V16: float; V17: float; V18: float; V19: float; V20: float
    V21: float; V22: float; V23: float; V24: float; V25: float
    V26: float; V27: float; V28: float
    Amount: float # 원본 Amount

# --- 설명 생성 헬퍼 함수 ---
def generate_explanation(input_data: TransactionInput, stats: dict) -> (str, list):
    v_features = [f'V{i}' for i in range(1, 29)]
    means = stats['means']
    stddevs = stats['stddevs']
    
    z_scores = []
    for feature in v_features:
        value = getattr(input_data, feature)
        mean = means.get(feature, 0)
        std = stddevs.get(feature, 1)
        if std != 0:
            z_score = (value - mean) / std
            z_scores.append({'feature': feature, 'z_score': abs(z_score)})
    
    # Z-score가 높은 순으로 정렬
    z_scores.sort(key=lambda x: x['z_score'], reverse=True)
    
    top_3_features = z_scores[:3]
    top_feature = top_3_features[0]

    # 사용자 제안에 따른 동적 멘트 생성 로직
    if top_feature['z_score'] >= 3.0:
        # Case A: 특정 변수 하나가 극단적으로 튈 때
        explanation = (
            f"핵심 변수({top_feature['feature']})의 이상 징후 포착! "
            f"{top_feature['feature']} 데이터가 정상 패턴에서 가장 크게 이탈(Z-score {top_feature['z_score']:.2f})하여 "
            "이상 거래로 판단될 확률이 높습니다."
        )
        top_features_list = [f"{f['feature']} (Z: {f['z_score']:.2f})" for f in top_3_features]
    else:
        # Case B: 여러 변수가 조금씩 이상할 때 (복합적일 때)
        feature_names = ", ".join([f['feature'] for f in top_3_features])
        explanation = (
            f"다수 변수({feature_names} 등)의 동시다발적 패턴 변화 감지. "
            "특정 변수가 압도적이지는 않으나, 여러 지표가 동시에 허용 오차 범위를 벗어났습니다."
        )
        top_features_list = [f"{f['feature']}" for f in top_3_features]
        
    return explanation, top_features_list


# --- API 라우터 정의 ---
api_router = APIRouter(prefix="/api")

@api_router.post("/test", tags=["test"])
def test_communication(db: Session = Depends(get_db)):
    return {"message": "API 통신 성공"}


# 금융 사기 탐지 핵심 엔드포인트
@api_router.post("/predict", tags=["Prediction"])
def predict_transaction(input_data: TransactionInput, db: Session = Depends(get_db)):
    if FINAL_MODEL is None or FEATURE_STATS is None:
        raise HTTPException(status_code=503, detail="모델 또는 통계 파일 로드 실패. 서버 상태를 확인하세요.")

    try:
        # 1. 입력 데이터를 DataFrame으로 변환
        input_df = pd.DataFrame([input_data.model_dump()])
        
        # 2. Time, Amount 스케일링
        time_data = input_df['Time'].values.reshape(-1, 1)
        amount_data = input_df['Amount'].values.reshape(-1, 1)
        input_df['Scaled_Time'] = TIME_SCALER.transform(time_data)[:, 0]
        input_df['Scaled_Amount'] = AMOUNT_SCALER.transform(amount_data)[:, 0]

        # 3. 모델 입력 피처 준비
        feature_columns = [f'V{i}' for i in range(1, 29)] + ['Scaled_Amount', 'Scaled_Time']
        X_predict = input_df[feature_columns]

        # 4. RandomForest 예측 (확률 사용)
        prediction_proba = FINAL_MODEL.predict_proba(X_predict.values)[0]
        fraud_probability = prediction_proba[1]
        is_fraud = fraud_probability >= PREDICTION_THRESHOLD
        status_label = "FRAUD" if is_fraud else "NORMAL"
        
        # 5. DB 로깅
        log_entry = create_prediction_log(
            db=db, status=status_label, is_fraud=is_fraud, probability=float(fraud_probability),
            amount=input_data.Amount, time=input_data.Time,
            details=f"V1={input_data.V1:.2f}, V2={input_data.V2:.2f}"
        )
        
        # 6. 프론트엔드에 결과 반환
        response = {
            "prediction": status_label,
            "is_fraud": bool(is_fraud),
            "fraud_probability": float(fraud_probability),
            "log_id": log_entry.id,
            "key_features": { "V14": input_data.V14, "V10": input_data.V10, "V4": input_data.V4 }
        }

        # 7. 사기 거래일 경우, 설명 및 주요 피처 추가
        if is_fraud:
            explanation, top_features = generate_explanation(input_data, FEATURE_STATS)
            response["explanation"] = explanation
            response["top_features"] = top_features
        
        return response
    
    except Exception as e:
        # ... (기존 에러 핸들링)
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")