import React from "react";
import InputForm from "../components/Manual/InputForm/InputForm";
import PredictButton from "../components/Manual/PredictButton/PredictButton";
import ResultBox from "../components/Manual/ResultBox/ResultBox";
import LoadingIndicator from "../components/Common/LoadingIndicator/LoadingIndicator";
import { sampleNormalTransaction, sampleFraudTransaction } from "../utils/constants"; // Scenarios for buttons

const ManualAnalysisPage = ({
  formData,
  onFormChange,
  onLoadScenario,
  onPredictClick,
  loading,
  manualResult,
  error,
}) => {
  return (
    <div className="manual-view">
      <div className="card">
        <div className="card-header card-header-controls">
          <h2>
            거래 데이터 입력
          </h2>
          <div className="scenario-buttons">
            <button
              className="scenario-btn normal"
              onClick={() => onLoadScenario(sampleNormalTransaction)}
            >
              정상 데이터 예시
            </button>
            <button
              className="scenario-btn fraud"
              onClick={() => onLoadScenario(sampleFraudTransaction)}
            >
              이상 거래 데이터 예시
            </button>
          </div>
        </div>

        <InputForm
          formData={formData}
          onFormChange={onFormChange}
          // The onLoadScenario is now handled by the buttons above,
          // so we can remove it from being passed to InputForm.
        />
      </div>

      <PredictButton onClick={onPredictClick} loading={loading} />

      {loading && <LoadingIndicator />}

      {/* ResultBox will be displayed below the button */}
      {(manualResult || error) && (
        <div className="card result-card">
          <h2 className="card-header">분석 결과</h2>
          <ResultBox result={manualResult} error={error} formData={formData} />
        </div>
      )}
    </div>
  );
};

export default ManualAnalysisPage;
