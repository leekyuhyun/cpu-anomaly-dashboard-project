import "./PredictButton.css";

export default function PredictButton({ onClick, loading }) {
  return (
    <button onClick={onClick} disabled={loading} className="predict-button">
      {loading ? "모델 탐지 실행 중..." : "🚨 사기 탐지 실행"}
    </button>
  );
}
