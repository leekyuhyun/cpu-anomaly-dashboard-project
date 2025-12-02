import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <h1 className="header-title">💳 신용카드 이상 거래 탐지 시스템</h1>
      <p className="header-description">
        데이터셋 분석 및 30개의 거래 피처를 직접 입력하여 이상 거래 여부를
        탐지합니다
      </p>
    </header>
  );
}
