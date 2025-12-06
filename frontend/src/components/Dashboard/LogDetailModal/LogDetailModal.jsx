import React from "react";
import "./LogDetailModal.css";
import ResultBox from "../../Manual/ResultBox/ResultBox";
import LoadingIndicator from "../../Common/LoadingIndicator/LoadingIndicator";

const LogDetailModal = ({ result, loading, onClose }) => {
  return (
    <div className="log-detail-overlay" onClick={onClose}>
      <div className="log-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="log-detail-header">
          <h3>상세 분석 리포트</h3>
          <button onClick={onClose} className="close-detail-button">
            &times;
          </button>
        </div>
        <div className="log-detail-content">
          {loading && <LoadingIndicator />}
          {result && <ResultBox result={result} />}
        </div>
      </div>
    </div>
  );
};

export default LogDetailModal;

