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
    // x축 레이블을 로그 ID로 단순화
    labels: data.map((item) => item.log_id),
    datasets: [
      {
        label: "위험도 (%)",
        data: data.map((item) => item.score * 100),
        fill: true,
        backgroundColor: "rgba(13, 110, 253, 0.2)", // New primary blue, semi-transparent
        borderColor: "rgba(13, 110, 253, 1)",      // New primary blue
        borderWidth: 2,
        pointRadius: 2,
        pointBackgroundColor: "rgba(13, 110, 253, 1)",
        tension: 0.4,
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
        ticks: { color: "#6c757d" }, // var(--text-light)
        grid: {
          display: false, // Hide grid lines
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          color: "#6c757d", // var(--text-light)
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
        grid: {
          display: false, // Hide grid lines
        },
      },
    },
  };

  return (
    <div className="risk-chart-container">
      <div className="chart-area">
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
