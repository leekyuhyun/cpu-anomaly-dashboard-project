import "./PredictButton.css";

export default function PredictButton({ onClick, loading }) {
  return (
    <div className="predict-button-container">
      <button onClick={onClick} disabled={loading} className="predict-button">
        {loading ? "분석 중..." : "분석하기"}
      </button>
    </div>
  );
}
