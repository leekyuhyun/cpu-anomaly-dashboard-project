import React from "react";
import "./FraudAlert.css";

const FraudAlert = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fraud-alert-overlay">
      <div className="fraud-alert-modal">
        <div className="alert-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="alert-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1.75-4.25a.75.75 0 00-1.5 0v.5c0 .414.336.75.75.75h2.5c.414 0 .75-.336.75-.75v-.5a.75.75 0 00-1.5 0v.5H8.25v-.5z"
              clipRule="evenodd"
            />
          </svg>
          <h2>사기 거래 경고</h2>
        </div>
        <p>
          위험도 높은 거래가 탐지되었습니다! 즉시 확인이 필요합니다.
        </p>
        <div className="transaction-details">
          <div>
            <strong>위험도:</strong>
            <span className="detail-value fraud">
              {(transaction.fraud_probability * 100).toFixed(2)}%
            </span>
          </div>
          <div>
            <strong>거래 금액:</strong>
            <span className="detail-value">${transaction.Amount.toFixed(2)}</span>
          </div>
          <div>
            <strong>거래 시간:</strong>
            <span className="detail-value">{transaction.Time}</span>
          </div>
        </div>
        <button onClick={onClose} className="close-alert-button">
          확인 및 닫기
        </button>
      </div>
    </div>
  );
};

export default FraudAlert;
