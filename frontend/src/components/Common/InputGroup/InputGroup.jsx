import "./InputGroup.css";

export default function InputGroup({
  label,
  name,
  value,
  onChange,
  placeholder,
  ...props
}) {
  return (
    <div className="input-group-new">
      <label htmlFor={name} className="visually-hidden">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        {...props}
      />
    </div>
  );
}
