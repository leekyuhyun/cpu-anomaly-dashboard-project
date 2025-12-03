import React from "react";
import "./TopMetrics.css";

// This component now displays the top contributing features for a transaction.
const TopMetrics = ({ transaction, title }) => {
  // DEBUG: Inspect the received transaction prop
  console.log("TopMetrics transaction:", transaction);

  // Mock percentages as the backend doesn't provide them.
  const mockPercentages = [100, 80, 60];

  const features = transaction?.top_features;

  return (
    <div className="top-metrics-container">
      <h2 className="card-header">{title}</h2>
      {!features || features.length === 0 ? (
        <div className="metrics-placeholder">
          모니터링 시작 시 주요 지표가 표시됩니다.
        </div>
      ) : (
        <ul className="metrics-list">
          {features.map((feature, index) => (
            <li key={index} className="metric-item">
              <span className="metric-name">{feature}</span>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${mockPercentages[index] || 30}%` }}
                >
                  <span className="progress-bar-text">
                    영향도 {mockPercentages[index] || 30}%
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopMetrics;
