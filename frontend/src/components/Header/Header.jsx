import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <h1 className="header-title">💳 신용카드 사기 탐지 시스템</h1>
      <p className="header-description">
        30개의 거래 피처를 입력하여 사기(Fraud) 여부를 탐지합니다
      </p>
    </header>
  );
}
