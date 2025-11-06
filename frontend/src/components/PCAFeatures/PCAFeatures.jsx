import InputGroup from "../InputGroup/InputGroup";
import { V_FIELD_DESCRIPTIONS } from "../../utils/constants";
import "./PCAFeatures.css";

export default function PCAFeatures({ formData, onChange }) {
  const V_FIELDS = Object.keys(V_FIELD_DESCRIPTIONS);

  return (
    <div className="pca-features">
      <h3 className="pca-header">PCA 압축 피처 (V1 ~ V28)</h3>
      <div className="pca-grid">
        {V_FIELDS.map((name) => (
          <InputGroup
            key={name}
            label={name}
            name={name}
            value={formData[name]}
            onChange={onChange}
            description={V_FIELD_DESCRIPTIONS[name]}
          />
        ))}
      </div>
    </div>
  );
}
