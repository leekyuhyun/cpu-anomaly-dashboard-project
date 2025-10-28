// /frontend/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // axios 임포트
import logo from './logo.svg';
import './App.css';

function App() {
  // 백엔드에서 받은 메시지를 저장할 state
  const [message, setMessage] = useState("Loading...");

  // 컴포넌트가 처음 렌더링될 때 백엔드 API 호출
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/hello') // FastAPI 엔드포인트
      .then(response => {
        setMessage(response.data.message); // 성공 시 메시지 저장
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setMessage("Failed to load data from backend."); // 실패 시 에러 메시지
      });
  }, []); // 빈 배열: 마운트 시 1회만 실행

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>CPU Anomaly Dashboard</h1>

        {/* 백엔드에서 받은 메시지 출력 */}
        <p>
          <strong>{message}</strong>
        </p>

      </header>
    </div>
  );
}

export default App;