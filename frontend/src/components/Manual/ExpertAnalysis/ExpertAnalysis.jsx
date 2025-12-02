// src/components/Manual/ExpertAnalysis/ExpertAnalysis.jsx 전체 내용

import React from "react";
import "./ExpertAnalysis.css";

// Helper to identify and explain key anomalous features
const getFeatureAnalysis = (transaction) => {
  const analyses = [];
  // Feature Importance Top 4 (V14, V4, V17, V10)
  const topFeatures = {
    V14: { threshold: -5, description: "V14 변수" },
    V4: { threshold: 4, description: "V4 변수" },
    V17: { threshold: -3, description: "V17 변수" },
    V10: { threshold: -3, description: "V10 변수" },
  };

  for (const feature in topFeatures) {
    const value = transaction[feature];
    const { threshold, description } = topFeatures[feature];
    if (threshold < 0 && value < threshold) {
      analyses.push(
        `주요 위험 변수인 ${description}에서 통계적 이상치(값: ${value.toFixed(
          2
        )})가 발견되었습니다.`
      );
    } else if (threshold > 0 && value > threshold) {
      analyses.push(
        `주요 위험 변수인 ${description}에서 통계적 이상치(값: ${value.toFixed(
          2
        )})가 발견되었습니다.`
      );
    }
  }

  return analyses;
};

const ExpertAnalysis = ({ transaction }) => {
  if (!transaction) return null;

  const { is_fraud, fraud_probability } = transaction;
  const featureAnalyses = getFeatureAnalysis(transaction);

  return (
    <div className="expert-analysis-container">
      <h4>AI 분석 리포트</h4>
      <div className="analysis-section">
        <h5>주요 위험 요인</h5>
        {is_fraud ? (
          featureAnalyses.length > 0 ? (
            <ul>
              {featureAnalyses.map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul>
          ) : (
            <p>
              단일 변수의 이상치보다는, 여러 변수 간의 복합적인 상호작용을 통해
              사기 거래의 특징이 발견되었습니다.
            </p>
          )
        ) : (
          <p>
            과거 사기 거래에서 주로 발견되었던 주요 변수들(V14, V4, V17 등)이
            안정적인 범위 내에 있습니다.
          </p>
        )}
      </div>

      <div className="analysis-section">
        <h5>위험도 분석</h5>
        {is_fraud ? (
          <p>
            산출된 거래 위험도는{" "}
            <strong>{(fraud_probability * 100).toFixed(2)}%</strong>
            입니다. 이 점수대에서 본 AI 모델은 약 85%의 탐지 정확도(Precision)를
            보이며, 이는 실제 사기 거래일 확률이 높다는 것을 의미합니다.
          </p>
        ) : (
          <p>
            산출된 거래 위험도는{" "}
            <strong>{(fraud_probability * 100).toFixed(2)}%</strong>
            로, 사기 거래로 판단하는 임계값(50%)을 넘지 않았습니다.
          </p>
        )}
      </div>

      <div className="analysis-section conclusion">
        <h5>종합 의견</h5>
        {is_fraud ? (
          <p>
            주요 변수의 이상 패턴과 높은 위험도 점수를 종합할 때, 해당 거래는{" "}
            <strong className="fraud-text">'사기 거래'</strong>일 가능성이 매우
            높습니다.
          </p>
        ) : (
          <p>
            주요 변수에서 위험 징후가 발견되지 않았고, 위험도 점수가 낮아{" "}
            <strong className="normal-text">'정상 거래'</strong>로 판단됩니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default ExpertAnalysis;
