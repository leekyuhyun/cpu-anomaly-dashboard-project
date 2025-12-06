import React from "react";
import "./SystemInfoBox.css";

const SystemInfoBox = () => {
  const info = [
    { key: "Model:", value: "Random Forest" },
    { key: "Features:", value: "30" },
    { key: "Update Rate:", value: "2 Hz" },
    { key: "Threshold:", value: "0.5" },
  ];

  return (
    <div className="system-info-container">
      <ul className="info-list">
        {info.map((item, index) => (
          <li key={index} className="info-row">
            <span className="info-key">{item.key}</span>
            <span className="info-value">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SystemInfoBox;
