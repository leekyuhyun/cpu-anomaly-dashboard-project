import "./LoadingIndicator.css";

export default function LoadingIndicator() {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>⏳ 백엔드 모델로 데이터를 전송하고 있습니다...</p>
    </div>
  );
}
