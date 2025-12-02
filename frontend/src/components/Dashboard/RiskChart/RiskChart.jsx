import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // for area fill
} from "chart.js";
import "./RiskChart.css";

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RiskChart = ({ data }) => {
  // data는 [{ time: number, score: number, log_id: number }] 형태
  const chartData = {
    // x축 레이블을 로그 ID로 설정
    labels: data.map((item) => `Log ${item.log_id}`),
    datasets: [
      {
        label: "위험도 (%)",
        // 위험도 점수(0~1)를 백분율(0~100)로 변환
        data: data.map((item) => item.score * 100),
        fill: true,
        backgroundColor: "rgba(14, 165, 233, 0.2)", // Sky Blue Area
        borderColor: "#0ea5e9", // Sky Blue Line
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "#0ea5e9",
        tension: 0.4, // 곡선 부드럽게
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2) + "%";
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: { display: true, text: "위험도 (%)", color: "#94a3b8" },
        ticks: { color: "#94a3b8" },
        grid: { color: "#334155" },
      },
      x: {
        title: { display: true, text: "거래 로그 (시간 순)", color: "#94a3b8" },
        ticks: {
          color: "#94a3b8",
          maxRotation: 45,
          minRotation: 45,
          // 데이터 포인트가 많을 경우 레이블 생략
          autoSkip: true,
          maxTicksLimit: 10,
        },
        grid: { color: "#334155" },
      },
    },
  };

  return (
    <div className="risk-chart-container">
      <h3 className="chart-header">
        실시간 위험도 추이 (Risk Score Over Time)
      </h3>
      <div className="chart-area">
        {/* 데이터가 없으면 차트 대신 메시지 표시 */}
        {data.length === 0 ? (
          <div className="chart-note">
            모니터링을 시작하면 실시간 위험도 그래프가 표시됩니다.
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default RiskChart;
