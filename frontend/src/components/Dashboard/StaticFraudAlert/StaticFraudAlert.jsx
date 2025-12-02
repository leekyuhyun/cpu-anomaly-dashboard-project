import React from "react";
import "./StaticFraudAlert.css"; // 정적 스타일에 대한 오버라이딩

const StaticFraudAlert = ({ transaction, onConfirm }) => {
  // transaction이 없으면 렌더링하지 않습니다.
  if (!transaction) return null;

  // 기존 FraudAlert의 UI를 활용하여 정적 박스 형태로 재구성
  return (
    // 기존 fraud-alert-modal 클래스에 static-alert 클래스를 추가하여 정적 스타일 적용
    <div className="fraud-alert-modal static-alert">
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
        <h2 style={{ fontSize: "1.2rem" }}>사기 거래 경고</h2>
      </div>
      <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
        위험도 높은 거래가 탐지되었습니다! 즉시 확인이 필요합니다.
      </p>
      <div className="transaction-details" style={{ padding: "0.5rem" }}>
        <div>
          <strong style={{ fontSize: "0.9rem" }}>위험도:</strong>
          <span className="detail-value fraud" style={{ fontSize: "0.9rem" }}>
            {(transaction.fraud_probability * 100).toFixed(2)}%
          </span>
        </div>
        <div>
          <strong style={{ fontSize: "0.9rem" }}>거래 금액:</strong>
          <span className="detail-value" style={{ fontSize: "0.9rem" }}>
            ${transaction.Amount.toFixed(2)}
          </span>
        </div>
        <div>
          <strong style={{ fontSize: "0.9rem" }}>거래 시간:</strong>
          <span className="detail-value" style={{ fontSize: "0.9rem" }}>
            {transaction.Time}
          </span>
        </div>
      </div>
      {/* onConfirm으로 경고를 해제하는 버튼 */}
      <button
        onClick={onConfirm}
        className="close-alert-button"
        style={{ fontSize: "0.9rem", padding: "0.5rem" }}
      >
        확인 및 닫기
      </button>
    </div>
  );
};

export default StaticFraudAlert;
