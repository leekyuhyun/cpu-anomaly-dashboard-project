import "./ResultBox.css";

export default function ResultBox({ result, error }) {
  if (!result && !error) return null;

  if (error) {
    return (
      <div className="result-box error">
        <h3>❌ 오류 발생</h3>
        <pre>{error}</pre>
      </div>
    );
  }

  return (
    <div className={`result-box ${result.is_fraud ? "fraud" : "normal"}`}>
      <h3>
        {result.is_fraud
          ? "🚨 탐지 결과: 사기(FRAUD) 의심!"
          : "✅ 탐지 결과: 정상(NORMAL) 거래"}
      </h3>
      <div className="result-details">
        <p>
          <strong>탐지 상태:</strong> {result.prediction}
        </p>
        <p>
          <strong>사기 확률:</strong>{" "}
          {(result.fraud_probability * 100).toFixed(2)}%
        </p>
        {result.log_id && (
          <p>
            <strong>로그 ID:</strong> {result.log_id}
          </p>
        )}
      </div>
    </div>
  );
}
