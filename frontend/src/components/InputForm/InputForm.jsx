import BaseInputs from "../BaseInputs/BaseInputs";
import PCAFeatures from "../PCAFeatures/PCAFeatures";
import {
  sampleNormalTransaction,
  sampleFraudTransaction,
} from "../../utils/constants";
import "./InputForm.css";

export default function InputForm({
  formData,
  onFormChange,
  onTimeChange,
  onAmountChange,
  onLoadScenario, // 부모로부터 상태 업데이트 함수를 받습니다.
}) {
  return (
    <form className="input-form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-header">
        <h2>거래 정보 입력 (30 Features)</h2>
        {/* --- 시나리오 로더 섹션 --- */}
        <div className="scenario-loader">
          <button
            type="button"
            onClick={() => onLoadScenario(sampleNormalTransaction)}
            className="scenario-button normal"
          >
            정상 거래 불러오기
          </button>
          <button
            type="button"
            onClick={() => onLoadScenario(sampleFraudTransaction)}
            className="scenario-button fraud"
          >
            사기 거래 불러오기
          </button>
        </div>
      </div>
      <BaseInputs
        formData={formData}
        onTimeChange={onTimeChange}
        onAmountChange={onAmountChange}
      />
      <PCAFeatures formData={formData} onChange={onFormChange} />
    </form>
  );
}
