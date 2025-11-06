import BaseInputs from "../BaseInputs/BaseInputs";
import PCAFeatures from "../PCAFeatures/PCAFeatures";
import "./InputForm.css";

export default function InputForm({
  formData,
  onFormChange,
  onTimeChange,
  onAmountChange,
}) {
  return (
    <form className="input-form">
      <h2>거래 정보 입력 (30 Features)</h2>
      <BaseInputs
        formData={formData}
        onTimeChange={onTimeChange}
        onAmountChange={onAmountChange}
      />
      <PCAFeatures formData={formData} onChange={onFormChange} />
    </form>
  );
}
