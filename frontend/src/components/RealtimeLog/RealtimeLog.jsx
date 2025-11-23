import React from "react";
import "./RealtimeLog.css";

const RealtimeLog = ({ log }) => {
  return (
    <div className="realtime-log-container">
      <h3>실시간 거래 로그</h3>
      <div className="log-box">
        {log.length === 0 && (
          <p className="empty-log-message">모니터링 시작 대기 중...</p>
        )}
        {log.map((entry, index) => (
          <div
            key={index}
            className={`log-entry ${
              entry.is_fraud ? "fraud" : "normal"
            }`}
          >
            <span className="log-status">{entry.prediction}</span>
            <span className="log-probability">
              위험도: {(entry.fraud_probability * 100).toFixed(2)}%
            </span>
            <span className="log-info">
              (Log ID: {entry.log_id})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealtimeLog;
