import React from "react";
import RealtimeLog from "../components/Dashboard/RealtimeLog/RealtimeLog";
import RiskGauge from "../components/Dashboard/RiskGauge/RiskGauge";
import TopMetrics from "../components/Dashboard/TopMetrics/TopMetrics";
import SystemInfoBox from "../components/Dashboard/SystemInfoBox/SystemInfoBox";
import RiskChart from "../components/Dashboard/RiskChart/RiskChart";

const DashboardPage = ({
  riskChartData,
  simulationLog,
  onLogClick,
  riskScore,
  isSimulating,
  onToggleSimulation,
  // alertTransaction, // No longer used for TopMetrics
  // onCloseStaticAlert, // No longer used for TopMetrics
}) => {
  const latestLog = simulationLog?.[0];
  const topMetricsTitle = latestLog?.is_fraud
    ? "주요 이상 거래 요소"
    : "주요 영향 지표";

  return (
    <div className="dashboard-layout-grid">
      <div className="left-panel">
        <div className="card">
          <div className="card-header card-header-controls">
            <h2>실시간 거래 분석</h2>
            <button
              onClick={onToggleSimulation}
              className={`monitor-btn ${isSimulating ? "stop" : "start"}`}
            >
              {isSimulating ? "모니터링 중지" : "모니터링 시작"}
            </button>
          </div>
          <RiskChart data={riskChartData} />
        </div>
        <div className="card">
          <h2 className="card-header">실시간 거래 로그</h2>
          <RealtimeLog log={simulationLog} onLogClick={onLogClick} />
        </div>
      </div>
      <div className="right-panel">
        <div className="card">
          <h2 className="card-header">위험도 분석</h2>
          <RiskGauge score={riskScore} />
        </div>
        <div className="card">
          {/* h2 is removed from here and passed into the component */}
          <TopMetrics transaction={latestLog} title={topMetricsTitle} />
        </div>
        <div className="card">
          <h2 className="card-header">SYSTEM INFO</h2>
          <SystemInfoBox />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
