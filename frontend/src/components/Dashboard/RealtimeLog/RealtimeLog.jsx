import React from "react";
import "./RealtimeLog.css";

const RealtimeLog = ({ log, onLogClick }) => {
  return (
    <div className="realtime-log-container">
      {log.length === 0 ? (
        <p className="empty-log-message">모니터링 시작 대기 중...</p>
      ) : (
        <ul className="log-list">
          {log.map((entry, index) => (
            <li
              key={index}
              className="log-item"
              onClick={() => onLogClick(entry)}
            >
              <div className="log-details">
                <span
                  className={`log-tag ${
                    entry.is_fraud ? "fraud" : "normal"
                  }`}
                >
                  {entry.is_fraud ? "이상" : "정상"}
                </span>
                <span className="log-time">
                  {entry.timestamp.toLocaleTimeString("ko-KR")}
                </span>
              </div>
              <span className="log-amount">
                {`$${entry.Amount.toFixed(2)}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RealtimeLog;
