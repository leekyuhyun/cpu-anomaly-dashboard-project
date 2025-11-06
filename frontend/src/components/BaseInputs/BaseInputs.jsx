import InputGroup from "../InputGroup/InputGroup";
import "./BaseInputs.css";

export default function BaseInputs({ formData, onTimeChange, onAmountChange }) {
  return (
    <div className="base-inputs">
      <InputGroup
        label="Time"
        name="Time"
        value={formData.Time}
        onChange={onTimeChange}
        description="(0 ~ 172792 초)"
      />
      <InputGroup
        label="Amount"
        name="Amount"
        value={formData.Amount}
        onChange={onAmountChange}
        description="(0 ~ 25691)"
      />
    </div>
  );
}
