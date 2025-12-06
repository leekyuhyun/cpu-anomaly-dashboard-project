import React from 'react';
import './TopMetrics.css';

// Helper to format timestamp
const formatTimestamp = (date) => {
  if (!date) return '';
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const TopMetrics = ({ highestRisk }) => {
  // 주요 변수와 현실적인 고정 영향도
  const topFeatures = [
    { name: 'V14', influence: 45 },
    { name: 'V4', influence: 30 },
    { name: 'V10', influence: 15 },
    { name: 'V17', influence: 10 },
  ];

  return (
    <div className="top-metrics-container">
      <h2 className="card-header">
        <span className="icon-spark">⚡</span> 주요 영향 지표
      </h2>
      <p className="metrics-description">
        모델이 이상 거래를 탐지할 때 중요하게 고려하는 변수들의 상대적 영향도입니다.
      </p>
      <ul className="metrics-list">
        {topFeatures.map((feature) => (
          <li key={feature.name} className="metric-item">
            <span className="metric-name">{feature.name}</span>
            <div className="metric-bar">
              <div
                className="metric-fill"
                style={{ width: `${feature.influence}%` }}
              />
              <span className="metric-percent">영향도 {feature.influence}%</span>
            </div>
          </li>
        ))}
      </ul>
      
      <hr className="metric-separator" />

      <div className="highest-risk-section">
        <h3 className="highest-risk-title">최고 위험도 거래</h3>
        {highestRisk ? (
          <div className="highest-risk-box fraud">
            <span className="timestamp">
              {formatTimestamp(highestRisk.timestamp)}
            </span>
            <span className="amount">
              위험도 {(highestRisk.fraud_probability * 100).toFixed(2)}%
            </span>
          </div>
        ) : (
          <div className="highest-risk-box normal">
            <span>진행된 이상 거래가 없습니다.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopMetrics;
