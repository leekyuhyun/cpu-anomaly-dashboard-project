import React from "react";
import "./LogDetailModal.css";

// Helper to format values for display
const formatValue = (value) => {
  if (value instanceof Date) {
    return value.toLocaleString("ko-KR");
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (typeof value === "number") {
    // Show up to 4 decimal places for floats
    return Number.isInteger(value) ? value : value.toFixed(4);
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return value;
};

const LogDetailModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  // Filter out some raw data if not needed, or show all
  const transactionEntries = Object.entries(transaction);

  return (
    <div className="log-detail-overlay" onClick={onClose}>
      <div className="log-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="log-detail-header">
          <h3>상세 거래 로그</h3>
          <button onClick={onClose} className="close-detail-button">
            &times;
          </button>
        </div>
        <div className="log-detail-content">
          <ul className="log-detail-list">
            {transactionEntries.map(([key, value]) => (
              <li key={key} className="detail-item-row">
                <span className="detail-key">{key}</span>
                <span className="detail-value">{formatValue(value)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LogDetailModal;
