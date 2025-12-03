"use client";

import { useState, useRef, useEffect } from "react";
// import Header from "../components/Common/Header/Header"; // No longer used directly here
import LoadingIndicator from "../components/Common/LoadingIndicator/LoadingIndicator";
import LogDetailModal from "../components/Dashboard/LogDetailModal/LogDetailModal";
import DashboardPage from "./DashboardPage"; // Import new page component
import ManualAnalysisPage from "./ManualAnalysisPage"; // Import new page component
import Clock from "../components/Common/Clock/Clock"; // Import Clock
import { initialFormData } from "../utils/constants";
import { simulationDataLarge } from "../utils/simulationDataLarge";
import { makeAPIPrediction } from "../utils/api";
import { handleFormChange } from "../utils/formHandlers";
import "./Main.css";

function Main() {
  // --- 공통 상태 ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("simulation"); // 'simulation' vs 'manual'

  // --- 수동 분석 모드 상태 ---
  const [formData, setFormData] = useState(initialFormData);
  const [manualResult, setManualResult] = useState(null);

  // --- 실시간 시뮬레이션 모드 상태 ---
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState([]);
  const [riskScore, setRiskScore] = useState(0);
  const [alertTransaction, setAlertTransaction] = useState(null);
  const [detailedLog, setDetailedLog] = useState(null); // 로그 상세 보기 모달용 상태
  const [riskChartData, setRiskChartData] = useState([]); // ✅ 차트 데이터 상태 추가
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
    setRiskChartData([]); // 시뮬레이션 시작 시 차트 데이터 초기화
    transactionIndexRef.current = 0;

    intervalRef.current = setInterval(async () => {
      const currentTransaction =
        simulationDataLarge[transactionIndexRef.current];
      const response = await makeAPIPrediction(currentTransaction);

      if (response.success) {
        const resultData = {
          ...response.data,
          ...currentTransaction,
          timestamp: new Date(),
        };

        // 1. 로그 업데이트 (최신 50개 유지)
        setSimulationLog((prevLog) => [resultData, ...prevLog].slice(0, 50));

        // 2. 위험도 게이지 업데이트
        setRiskScore(resultData.fraud_probability);

        // 3. 차트 데이터 업데이트 (최신 50개 유지)
        setRiskChartData((prevData) => {
          const newEntry = {
            time: resultData.Time,
            score: resultData.fraud_probability,
            // log_id를 부여하여 x축 레이블로 사용
            log_id: transactionIndexRef.current + 1,
          };
          // 새로운 데이터를 뒤에 추가하고 배열을 슬라이스하여 최대 50개 유지
          return [...prevData, newEntry].slice(-50);
        });

        // 4. 경고창 업데이트
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

  const handleCloseStaticAlert = () => {
    setAlertTransaction(null);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    // The new layout structure begins here.
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1>신용카드 이상 거래 탐지 시스템</h1>
          <p>30개 거래 피처를 이용한 실시간 사기 탐지</p>
        </div>
        <Clock />
      </header>

      <nav className="app-nav">
        <button
          onClick={() => setMode("simulation")}
          className={`nav-button ${mode === "simulation" ? "active" : ""}`}
        >
          실시간 이상 거래 분석
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`nav-button ${mode === "manual" ? "active" : ""}`}
        >
          수동 분석
        </button>
      </nav>

      <main className="app-main">
        {mode === "simulation" ? (
          <DashboardPage
            isSimulating={isSimulating}
            onToggleSimulation={handleToggleSimulation}
            riskChartData={riskChartData}
            simulationLog={simulationLog}
            onLogClick={handleLogClick}
            riskScore={riskScore}
            alertTransaction={alertTransaction}
            onCloseStaticAlert={handleCloseStaticAlert}
          />
        ) : (
          <ManualAnalysisPage
            formData={formData}
            onFormChange={onFormChange}
            onLoadScenario={handleLoadScenario}
            onPredictClick={onPredictClick}
            loading={loading}
            manualResult={manualResult}
            error={error}
          />
        )}
      </main>

      {detailedLog && (
        <LogDetailModal
          transaction={detailedLog}
          onClose={handleCloseDetailModal}
        />
      )}
      {/* The top-level loading indicator might be needed if there are page-level loads.
          For now, loading is handled inside ManualAnalysisPage. */}
    </div>
  );
}

export default Main;
