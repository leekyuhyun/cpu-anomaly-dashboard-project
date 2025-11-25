import React, { useState } from "react";
import ExpertAnalysis from "../ExpertAnalysis/ExpertAnalysis";
import "./ResultBox.css";

export default function ResultBox({ result, error, formData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!result && !error) return null;

  if (error) {
    return (
      <div className="result-box error">
        <h3>❌ 오류 발생</h3>
        <pre>{error}</pre>
      </div>
    );
  }

  // 예측 결과와 원본 입력 데이터를 합쳐서 ExpertAnalysis로 전달
  const transactionData = { ...result, ...formData };

  return (
    // React.Fragment를 사용하여 여러 컴포넌트를 그룹화
    <React.Fragment>
      <div
        className={`result-box ${result.is_fraud ? "fraud" : "normal"}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>
          {result.is_fraud
            ? "🚨 탐지 결과: 사기(FRAUD) 의심!"
            : "✅ 탐지 결과: 정상(NORMAL) 거래"}
        </h3>
        <div className="result-summary">
          <p>
            <strong>탐지 상태:</strong> {result.prediction}
          </p>
          <p>
            <strong>사기 확률:</strong>{" "}
            {(result.fraud_probability * 100).toFixed(2)}%
          </p>
          <span
            className={`result-toggle-icon ${isExpanded ? "expanded" : ""}`}
          >
            ▼
          </span>
        </div>
        <div className="result-tip">
          (자세한 분석을 보려면 클릭하세요)
        </div>
      </div>
      {isExpanded && <ExpertAnalysis transaction={transactionData} />}
    </React.Fragment>
  );
}
