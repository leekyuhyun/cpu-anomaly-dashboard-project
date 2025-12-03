import InputGroup from "../../Common/InputGroup/InputGroup";
import { V_FIELD_DESCRIPTIONS } from "../../../utils/constants";
import "./InputForm.css";

// This component is now a self-contained form for all 30 transaction features.
export default function InputForm({ formData, onFormChange }) {
  const V_FIELDS = Object.keys(V_FIELD_DESCRIPTIONS);

  return (
    <form className="input-form-grid" onSubmit={(e) => e.preventDefault()}>
      <div className="form-section">
        <h3 className="form-section-title">기본 정보</h3>
        <div className="base-inputs-grid">
          <InputGroup
            label="Time"
            name="Time"
            placeholder="Time"
            value={formData.Time}
            onChange={onFormChange}
          />
          <InputGroup
            label="Amount"
            name="Amount"
            placeholder="Amount ($)"
            value={formData.Amount}
            onChange={onFormChange}
          />
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">PCA 값 (V1 - V28)</h3>
        <div className="pca-inputs-grid">
          {V_FIELDS.map((name) => (
            <InputGroup
              key={name}
              label={name}
              name={name}
              placeholder={name}
              value={formData[name]}
              onChange={onFormChange}
            />
          ))}
        </div>
      </div>
    </form>
  );
}
