import React from "react";
import "./ResultBox.css";

// Merged ResultBox and ExpertAnalysis into one component for a cleaner design.
export default function ResultBox({ result, error }) {
  if (!result && !error) {
    return null;
  }

  if (error) {
    return (
      <div className="result-box-new error">
        <h4>오류 발생</h4>
        <p>분석 중 문제가 발생했습니다. 다시 시도해주세요.</p>
        <pre>{typeof error === 'object' ? JSON.stringify(error, null, 2) : error}</pre>
      </div>
    );
  }

  const { is_fraud, fraud_probability, top_features } = result;
  const probabilityPercent = (fraud_probability * 100).toFixed(2);
  const resultClass = is_fraud ? "fraud" : "normal";

  return (
    <div className={`result-box-new ${resultClass}`}>
      <div className="result-probability-section">
        <div className="probability-value">{probabilityPercent}%</div>
        <div className="probability-label">이상 거래 확률</div>
      </div>
      <div className="result-details-section">
        <h4>AI 분석 리포트</h4>
        <div className="detail-item">
          <h5>종합 의견</h5>
          <p>
            분석 결과, 본 거래는{" "}
            <strong className={resultClass}>
              '{is_fraud ? "이상 거래 의심" : "정상"}'
            </strong>{" "}
            거래로 판단됩니다.
          </p>
        </div>
        <div className="detail-item">
          <h5>주요 판단 근거</h5>
          {result.explanation ? (
            <>
              <p>{result.explanation}</p>
              {result.top_features && result.top_features.length > 0 && (
                <div className="features-tags">
                  {result.top_features.map((feature, index) => (
                    <span key={index} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p>
              {is_fraud
                ? "복합적인 요인을 통해 분석되었습니다."
                : "정상 거래 패턴에 해당합니다."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
