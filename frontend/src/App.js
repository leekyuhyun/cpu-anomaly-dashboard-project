import React, { useState } from "react";
import axios from "axios";
import "./App.css";

// 신용카드 데이터셋의 기본값 (정상 거래의 평균적인 값으로 초기화)
const initialFormData = {
  Time: 100000.0,
  Amount: 50.0,
  V1: 0.0,
  V2: 0.0,
  V3: 0.0,
  V4: 0.0,
  V5: 0.0,
  V6: 0.0,
  V7: 0.0,
  V8: 0.0,
  V9: 0.0,
  V10: 0.0,
  V11: 0.0,
  V12: 0.0,
  V13: 0.0,
  V14: 0.0,
  V15: 0.0,
  V16: 0.0,
  V17: 0.0,
  V18: 0.0,
  V19: 0.0,
  V20: 0.0,
  V21: 0.0,
  V22: 0.0,
  V23: 0.0,
  V24: 0.0,
  V25: 0.0,
  V26: 0.0,
  V27: 0.0,
  V28: 0.0,
};

// V1~V28에 대한 설명 (노트북의 df.describe() min/max 값 기준)
const V_FIELD_DESCRIPTIONS = {
  V1: "(e.g., -56.4 ~ 2.5)",
  V2: "(e.g., -72.7 ~ 22.1)",
  V3: "(e.g., -48.3 ~ 9.4)",
  V4: "(e.g., -5.7 ~ 16.9)",
  V5: "(e.g., -113.7 ~ 34.8)",
  V6: "(e.g., -26.2 ~ 73.3)",
  V7: "(e.g., -43.6 ~ 120.5)",
  V8: "(e.g., -73.2 ~ 20.0)",
  V9: "(e.g., -13.4 ~ 15.6)",
  V10: "(e.g., -24.6 ~ 23.7)",
  V11: "(e.g., -4.8 ~ 12.0)",
  V12: "(e.g., -18.7 ~ 7.8)",
  V13: "(e.g., -5.8 ~ 7.1)",
  V14: "(e.g., -19.2 ~ 10.5)",
  V15: "(e.g., -4.5 ~ 8.8)",
  V16: "(e.g., -14.1 ~ 17.3)",
  V17: "(e.g., -25.2 ~ 9.3)",
  V18: "(e.g., -9.5 ~ 5.0)",
  V19: "(e.g., -7.2 ~ 5.6)",
  V20: "(e.g., -54.5 ~ 39.4)",
  V21: "(e.g., -34.8 ~ 27.2)",
  V22: "(e.g., -10.9 ~ 10.5)",
  V23: "(e.g., -44.8 ~ 22.5)",
  V24: "(e.g., -2.8 ~ 4.6)",
  V25: "(e.g., -10.3 ~ 7.5)",
  V26: "(e.g., -2.6 ~ 3.5)",
  V27: "(e.g., -22.6 ~ 31.6)",
  V28: "(e.g., -15.4 ~ 33.8)",
};

function App() {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // 백엔드 API 주소: /api/predict 엔드포인트 사용
  const API_URL = `http://127.0.0.1:${process.env.REACT_APP_BACKEND_PORT}/api/predict`;

  // 입력 필드 변경 시 상태 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    // 모든 값을 숫자로 변환하여 저장
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0,
    });
  };

  // "탐지 실행" 버튼 클릭 시 호출
  const handlePredictClick = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    // 백엔드로 전송할 데이터 (모든 필드를 포함)
    const payload = { ...formData };

    try {
      // 1. FastAPI 백엔드에 /api/predict로 POST 요청
      const response = await axios.post(API_URL, payload);

      setResult(response.data);
    } catch (err) {
      console.error("API Error:", err);
      if (err.response) {
        setError(
          err.response.data.detail ||
            `HTTP Error: ${err.response.status} - ${
              err.response.statusText || "No Detail"
            }`
        );
      } else {
        setError(
          "Failed to connect to the backend server (Check Docker status and Port 8800)."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // V1~V28 필드 이름 배열
  const V_FIELDS = Object.keys(V_FIELD_DESCRIPTIONS);

  return (
    <div className="App">
      <header className="App-header">
        <h1>💳 신용카드 사기 탐지 시스템</h1>
        <p>30개의 거래 피처를 입력하여 사기(Fraud) 여부를 탐지합니다.</p>

        <div className="input-form">
          <h2>거래 정보 입력 (30 Features)</h2>

          {/* Time & Amount 입력 */}
          <div className="base-inputs">
            <div className="input-group large-input">
              <label htmlFor="Time">Time (e.g., 0 ~ 172792 초)</label>
              <input
                id="Time"
                name="Time"
                type="number"
                step="any"
                value={formData.Time}
                onChange={handleChange}
              />
            </div>
            <div className="input-group large-input">
              <label htmlFor="Amount">Amount (e.g., 0 ~ 25691)</label>
              <input
                id="Amount"
                name="Amount"
                type="number"
                step="any"
                value={formData.Amount}
                onChange={handleChange}
              />
            </div>
          </div>

          <h3 className="pca-header">PCA 압축 피처 (V1 ~ V28)</h3>

          {/* V1 ~ V28 PCA Features 입력 */}
          <div className="input-grid">
            {V_FIELDS.map((name) => (
              <div className="input-group" key={name}>
                <label htmlFor={name}>
                  {name} {V_FIELD_DESCRIPTIONS[name]}
                </label>
                <input
                  id={name}
                  name={name}
                  type="number"
                  step="any"
                  value={formData[name]}
                  onChange={handleChange}
                  className="v-input"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handlePredictClick}
          disabled={loading}
          className="predict-button"
        >
          {loading
            ? "모델 탐지 실행 중..."
            : "🚨 사기 탐지 실행 (POST /api/predict)"}
        </button>

        {/* 로딩 인디케이터 */}
        {loading && (
          <div className="loading">
            ⏳ 백엔드 모델로 데이터를 전송하고 있습니다...
          </div>
        )}

        {/* 결과 표시 */}
        {result && (
          <div
            className={`result-box ${
              result.is_fraud ? "error-box" : "success-box"
            }`}
          >
            <strong>
              {result.is_fraud
                ? "🚨 탐지 결과: 사기(FRAUD) 의심!"
                : "✅ 탐지 결과: 정상 (NORMAL) 거래"}
            </strong>
            <pre>
              {`탐지 상태: ${result.prediction}`}
              {`\n사기 확률: ${(result.fraud_probability * 100).toFixed(2)}%`}
              {`\n로그 ID: ${result.log_id || "N/A"}`}
            </pre>
          </div>
        )}

        {/* 오류 메시지 표시 */}
        {error && (
          <div className="result-box error-box">
            <strong>❌ 오류 발생:</strong>
            <pre>{error}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
