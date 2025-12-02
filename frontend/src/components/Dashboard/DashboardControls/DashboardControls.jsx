import React from "react";
import "./DashboardControls.css";

const DashboardControls = ({ isSimulating, onToggleSimulation }) => {
  return (
    <div className="dashboard-controls">
      <button
        onClick={onToggleSimulation}
        className={`simulation-toggle-button ${
          isSimulating ? "stop" : "start"
        }`}
      >
        {isSimulating ? "모니터링 중지" : "실시간 모니터링 시작"}
      </button>
    </div>
  );
};

export default DashboardControls;
