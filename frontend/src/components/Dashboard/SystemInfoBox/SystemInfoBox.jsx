import React from "react";
import "./SystemInfoBox.css";

const SystemInfoBox = () => {
  // 이미지에서 보이는 정보를 기반으로 하드코딩된 값
  const info = {
    model: "Model: RandomForest + SMOTE",
    input_dims: "Input Dims: 30 metrics",
    update_rate: "Update Rate: 1Hz",
    threshold: "Threshold: 0.5",
  };

  return (
    <div className="system-info-container">
      <h4>SYSTEM INFO</h4>
      <div className="info-item">
        <p>
          <strong>{info.model}</strong>
        </p>
      </div>
      <div className="info-item">
        <p>{info.input_dims}</p>
      </div>
      <div className="info-item">
        <p>{info.update_rate}</p>
      </div>
      <div className="info-item">
        <p>{info.threshold}</p>
      </div>
    </div>
  );
};

export default SystemInfoBox;
