import React from "react";
import ExpertAnalysis from "../../Manual/ExpertAnalysis/ExpertAnalysis";
import "./LogDetailModal.css";

const LogDetailModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="log-detail-overlay" onClick={onClose}>
      <div className="log-detail-modal" onClick={(e) => e.stopPropagation()}>
        <ExpertAnalysis transaction={transaction} />
        <button onClick={onClose} className="close-detail-button">
          닫기
        </button>
      </div>
    </div>
  );
};

export default LogDetailModal;
