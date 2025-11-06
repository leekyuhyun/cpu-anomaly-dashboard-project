import "./InputGroup.css";

export default function InputGroup({
  label,
  name,
  value,
  onChange,
  description,
  step = "any",
}) {
  return (
    <div className="input-group">
      <label htmlFor={name}>
        {label}{" "}
        {description && <span className="description">{description}</span>}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        step={step}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
