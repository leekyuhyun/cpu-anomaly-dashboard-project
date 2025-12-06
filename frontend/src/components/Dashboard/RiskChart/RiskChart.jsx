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
  Filler,
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

// 데이터 정규화 함수 (Min-Max Scaling)
// 값의 범위를 0.2 ~ 0.8 사이로 조정하여 차트에서 겹침을 최소화
const normalize = (value, min, max) => {
  if (max === min) return 0.5; // 모든 값이 같을 경우 중간값 반환
  return 0.2 + ((value - min) / (max - min)) * 0.6;
};

const RiskChart = ({ data }) => {
  // data는 [{ time, score, log_id, key_features: {V4, V10, V14} }] 형태
  
  // 주요 변수들의 min/max 값 동적 계산
  const featureValues = {
    V4: data.map(item => item.key_features.V4),
    V10: data.map(item => item.key_features.V10),
    V14: data.map(item => item.key_features.V14),
  };

  const featureRange = {
    V4: { min: Math.min(...featureValues.V4), max: Math.max(...featureValues.V4) },
    V10: { min: Math.min(...featureValues.V10), max: Math.max(...featureValues.V10) },
    V14: { min: Math.min(...featureValues.V14), max: Math.max(...featureValues.V14) },
  };

  const chartData = {
    labels: data.map((item) => `ID ${item.log_id}`),
    datasets: [
      {
        label: "위험도",
        data: data.map((item) => item.score), // 위험도는 0-1 범위 그대로 사용
        fill: "start",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(54, 162, 235, 0.5)");
          gradient.addColorStop(1, "rgba(54, 162, 235, 0)");
          return gradient;
        },
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2.5,
        pointRadius: 2,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: "V14",
        data: data.map(item => normalize(item.key_features.V14, featureRange.V14.min, featureRange.V14.max)),
        borderColor: "rgba(255, 99, 132, 0.6)",
        borderWidth: 1.5,
        pointRadius: 1,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: "V10",
        data: data.map(item => normalize(item.key_features.V10, featureRange.V10.min, featureRange.V10.max)),
        borderColor: "rgba(75, 192, 192, 0.6)",
        borderWidth: 1.5,
        pointRadius: 1,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: "V4",
        data: data.map(item => normalize(item.key_features.V4, featureRange.V4.min, featureRange.V4.max)),
        borderColor: "rgba(255, 206, 86, 0.6)",
        borderWidth: 1.5,
        pointRadius: 1,
        tension: 0.4,
        yAxisID: 'y',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#6c757d",
          usePointStyle: true,
          padding: 20
        }
      },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const index = context.dataIndex;
            
            if (!label) return null;

            if (context.dataset.label === "위험도") {
              const value = context.parsed.y * 100;
              return `${label}: ${value.toFixed(2)}%`;
            }
            
            // 보조 지표들은 원본 값을 보여줌
            const originalValue = data[index]?.key_features?.[label];
            if (originalValue !== undefined) {
              return `${label}: ${originalValue.toFixed(4)}`;
            }
            
            return null;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 1,
        display: false, // Y축 숨기기
      },
      x: {
        ticks: {
          color: "#6c757d",
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="risk-chart-container">
      <h4>실시간 위험도 및 주요 변수</h4>
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
