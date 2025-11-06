import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // 백엔드 API 주소 (REACT_APP_BACKEND_PORT는 .env 파일에서 8800으로 설정됨)
  const API_URL = `http://127.0.0.1:${process.env.REACT_APP_BACKEND_PORT}/api/test`;

  // "예측 실행" 버튼 클릭 시 호출될 함수
  const handlePredictClick = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // 1. 백엔드(FastAPI)에 /api/v1/predict로 POST 요청
      const response = await axios.post(API_URL);

      // 2. 백엔드로부터 받은 최종 결과를 state에 저장
      console.log("API Response:", response.data);
      setResult(response.data);
    } catch (err) {
      // 3. 오류 발생 시
      console.error("API Error:", err);
      if (err.response) {
        setError(
          err.response.data.detail || `HTTP Error: ${err.response.status}`
        );
      } else {
        setError(
          "Failed to connect to the backend server (Check Docker status)."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>FastAPI-React 통신 테스트</h1>

        <button
          onClick={handlePredictClick}
          disabled={loading}
          className="predict-button"
        >
          {loading ? "API 요청 중..." : "API 요청 보내기 (POST /test)"}
        </button>

        {/* 로딩 인디케이터 */}
        {loading && (
          <div className="loading">⏳ 백엔드와 통신 시도 중입니다...</div>
        )}

        {/* 오류 메시지 표시 */}
        {error && (
          <div className="result-box error-box">
            <strong>❌ 오류 발생:</strong>
            <pre>{error}</pre>
          </div>
        )}

        {/* 성공 결과 표시 */}
        {result && (
          <div className="result-box success-box">
            <strong>✅ 통신 성공! 백엔드 응답 내용:</strong>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
