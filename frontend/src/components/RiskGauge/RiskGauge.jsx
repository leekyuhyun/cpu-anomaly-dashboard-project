import React from "react";
import "./RiskGauge.css";

const RiskGauge = ({ score }) => {
  const scorePercentage = score * 100;
  const clampedScore = Math.min(Math.max(scorePercentage, 0), 100);
  const rotation = (clampedScore / 100) * 180 - 90; // -90 to 90 degrees

  const getRiskColor = (s) => {
    if (s > 80) return "#ef4444"; // Red
    if (s > 50) return "#f97316"; // Orange
    if (s > 20) return "#eab308"; // Yellow
    return "#22c55e"; // Green
  };

  const color = getRiskColor(clampedScore);

  return (
    <div className="risk-gauge-container">
      <h3>위험도 분석</h3>
      <div className="gauge-wrapper">
        <div className="gauge">
          <div className="gauge-background"></div>
          <div
            className="gauge-needle"
            style={{ transform: `rotate(${rotation}deg)` }}
          ></div>
          <div className="gauge-center-circle"></div>
        </div>
        <div className="gauge-value" style={{ color: color }}>
          {clampedScore.toFixed(2)}%
        </div>
        <div className="gauge-labels">
          <span>안전</span>
          <span>위험</span>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;
