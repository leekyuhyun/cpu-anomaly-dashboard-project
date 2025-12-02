"use client";

import { useState, useRef, useEffect } from "react";
import Header from "../components/Common/Header/Header";
import InputForm from "../components/Manual/InputForm/InputForm";
import PredictButton from "../components/Manual/PredictButton/PredictButton";
import ResultBox from "../components/Manual/ResultBox/ResultBox";
import LoadingIndicator from "../components/Common/LoadingIndicator/LoadingIndicator";
import DashboardControls from "../components/Dashboard/DashboardControls/DashboardControls";
import RealtimeLog from "../components/Dashboard/RealtimeLog/RealtimeLog";
import RiskGauge from "../components/Dashboard/RiskGauge/RiskGauge";
import StaticFraudAlert from "../components/Dashboard/StaticFraudAlert/StaticFraudAlert";
import SystemInfoBox from "../components/Dashboard/SystemInfoBox/SystemInfoBox";
import LogDetailModal from "../components/Dashboard/LogDetailModal/LogDetailModal";
import RiskChart from "../components/Dashboard/RiskChart/RiskChart";
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
        const resultData = { ...response.data, ...currentTransaction };

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
    <div className="main">
      <div className="main-container">
        <Header />

        <div className="mode-toggle">
          <button
            onClick={() => setMode("simulation")}
            className={mode === "simulation" ? "active" : ""}
          >
            분석 대시보드
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

            <div className="dashboard-layout-grid">
              <div className="left-panel">
                {/* ✅ RiskChart 컴포넌트 추가 및 데이터 전달 */}
                <RiskChart data={riskChartData} />
                <RealtimeLog log={simulationLog} onLogClick={handleLogClick} />
              </div>

              <div className="right-panel">
                <RiskGauge score={riskScore} />

                <StaticFraudAlert
                  transaction={alertTransaction}
                  onConfirm={handleCloseStaticAlert}
                />

                <SystemInfoBox />
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
