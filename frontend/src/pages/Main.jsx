"use client";

import { useState, useRef, useEffect } from "react";
import Header from "../components/Header/Header";
import InputForm from "../components/InputForm/InputForm";
import PredictButton from "../components/PredictButton/PredictButton";
import LoadingIndicator from "../components/LoadingIndicator/LoadingIndicator";
import ResultBox from "../components/ResultBox/ResultBox";
import DashboardControls from "../components/DashboardControls/DashboardControls";
import RealtimeLog from "../components/RealtimeLog/RealtimeLog";
import RiskGauge from "../components/RiskGauge/RiskGauge";
import FraudAlert from "../components/FraudAlert/FraudAlert";
import LogDetailModal from "../components/LogDetailModal/LogDetailModal";
import { initialFormData } from "../utils/constants";
import { simulationDataLarge } from "../utils/simulationDataLarge";
import { makeAPIPrediction } from "../utils/api";
import { handleFormChange } from "../utils/formHandlers";
import "./Main.css";

function Main() {
  // --- 공통 상태 ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("simulation"); // 'manual' vs 'simulation'

  // --- 수동 분석 모드 상태 ---
  const [formData, setFormData] = useState(initialFormData);
  const [manualResult, setManualResult] = useState(null);

  // --- 실시간 시뮬레이션 모드 상태 ---
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState([]);
  const [riskScore, setRiskScore] = useState(0);
  const [alertTransaction, setAlertTransaction] = useState(null);
  const [detailedLog, setDetailedLog] = useState(null); // 로그 상세 보기 모달용 상태
  const intervalRef = useRef(null);
  const transactionIndexRef = useRef(0);

  // --- 핸들러 ---
  const onFormChange = (e) => handleFormChange(e, setFormData);
  const handleLoadScenario = (scenarioData) => {
    setFormData(scenarioData);
    setManualResult(null);
    setError(null);
  };
  const onPredictClick = async () => {
    setLoading(true);
    setManualResult(null);
    setError(null);
    const response = await makeAPIPrediction(formData);
    if (response.success) {
      setManualResult(response.data);
    } else {
      setError(response.error);
    }
    setLoading(false);
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationLog([]);
    setDetailedLog(null);
    transactionIndexRef.current = 0;

    intervalRef.current = setInterval(async () => {
      const currentTransaction =
        simulationDataLarge[transactionIndexRef.current];
      const response = await makeAPIPrediction(currentTransaction);

      if (response.success) {
        const resultData = { ...response.data, ...currentTransaction };
        setSimulationLog((prevLog) => [resultData, ...prevLog].slice(0, 50));
        setRiskScore(resultData.fraud_probability);
        if (resultData.is_fraud) {
          setAlertTransaction(resultData);
        }
      } else {
        console.error("Simulation API Error:", response.error);
      }
      transactionIndexRef.current =
        (transactionIndexRef.current + 1) % simulationDataLarge.length;
    }, 1500);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const handleToggleSimulation = () => {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };

  const handleLogClick = (logEntry) => {
    setDetailedLog(logEntry);
  };
  
  const handleCloseDetailModal = () => {
    setDetailedLog(null);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="main">
      <div className="main-container">
        <Header />

        <div className="mode-toggle">
          <button
            onClick={() => setMode("simulation")}
            className={mode === "simulation" ? "active" : ""}
          >
            실시간 대시보드
          </button>
          <button
            onClick={() => setMode("manual")}
            className={mode === "manual" ? "active" : ""}
          >
            수동 분석
          </button>
        </div>

        {mode === "simulation" && (
          <div className="dashboard-view">
            <DashboardControls
              isSimulating={isSimulating}
              onToggleSimulation={handleToggleSimulation}
            />
            <div className="dashboard-layout">
              <div className="gauge-column">
                <RiskGauge score={riskScore} />
              </div>
              <div className="log-column">
                <RealtimeLog log={simulationLog} onLogClick={handleLogClick} />
              </div>
            </div>
          </div>
        )}

        {mode === "manual" && (
          <div className="manual-view">
            <InputForm
              formData={formData}
              onFormChange={onFormChange}
              onTimeChange={onFormChange}
              onAmountChange={onFormChange}
              onLoadScenario={handleLoadScenario}
            />
            <PredictButton onClick={onPredictClick} loading={loading} />
            {loading && <LoadingIndicator />}
            <ResultBox
              result={manualResult}
              error={error}
              formData={formData}
            />
          </div>
        )}

        {alertTransaction && (
          <FraudAlert
            transaction={alertTransaction}
            onClose={() => setAlertTransaction(null)}
          />
        )}

        {detailedLog && (
          <LogDetailModal
            transaction={detailedLog}
            onClose={handleCloseDetailModal}
          />
        )}
      </div>
    </div>
  );
}

export default Main;
