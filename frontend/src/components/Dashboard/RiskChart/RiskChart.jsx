import React from 'react';
import { Line } from 'react-chartjs-2';
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
} from 'chart.js';
import './RiskChart.css';

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

// --- Z-Score 계산을 위한 통계 헬퍼 함수 ---
const calculateMean = (arr) => {
  if (arr.length === 0) return 0;
  return arr.reduce((acc, val) => acc + val, 0) / arr.length;
};

const calculateStdDev = (arr, mean) => {
  if (arr.length < 2) return 1; // 표준편차가 0이 되는 것을 방지
  const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (arr.length - 1);
  const stdDev = Math.sqrt(variance);
  return stdDev === 0 ? 1 : stdDev; // 0으로 나누는 것을 방지
};
// -----------------------------------------


const RiskChart = ({ data }) => {
  // data는 [{ time, score, log_id, key_features: {V4, V10, V14} }] 형태

  // --- 각 변수별 절대 Z-점수 계산 ---
  let zScores = { V4: [], V10: [], V14: [] };
  if (data.length > 1) {
    const v4_series = data.map(d => d.key_features.V4);
    const v10_series = data.map(d => d.key_features.V10);
    const v14_series = data.map(d => d.key_features.V14);

    const v4_mean = calculateMean(v4_series);
    const v10_mean = calculateMean(v10_series);
    const v14_mean = calculateMean(v14_series);

    const v4_stddev = calculateStdDev(v4_series, v4_mean);
    const v10_stddev = calculateStdDev(v10_series, v10_mean);
    const v14_stddev = calculateStdDev(v14_series, v14_mean);

    zScores.V4 = data.map(d => Math.abs((d.key_features.V4 - v4_mean) / v4_stddev));
    zScores.V10 = data.map(d => Math.abs((d.key_features.V10 - v10_mean) / v10_stddev));
    zScores.V14 = data.map(d => Math.abs((d.key_features.V14 - v14_mean) / v14_stddev));
  }
  // -----------------------------------------

  const chartData = {
    labels: data.map((item) => `ID ${item.log_id}`),
    datasets: [
      {
        type: 'line',
        label: 'V14 편차',
        data: zScores.V14,
        yAxisID: 'yDeviation',
        fill: true,
        stack: 'deviations',
        borderColor: 'transparent',
        backgroundColor: 'rgba(179, 216, 168, 0.55)', // #B3D8A8
        pointRadius: 0,
        tension: 0.4,
        order: 1,
      },
      {
        type: 'line',
        label: 'V10 편차',
        data: zScores.V10,
        yAxisID: 'yDeviation',
        fill: true,
        stack: 'deviations',
        borderColor: 'transparent',
        backgroundColor: 'rgba(251, 255, 228, 0.55)', // #FBFFE4
        pointRadius: 0,
        tension: 0.4,
        order: 2,
      },
      {
        type: 'line',
        label: 'V4 편차',
        data: zScores.V4,
        yAxisID: 'yDeviation',
        fill: true,
        stack: 'deviations',
        borderColor: 'transparent',
        backgroundColor: 'rgba(163, 209, 198, 0.55)', // #A3D1C6
        pointRadius: 0,
        tension: 0.4,
        order: 3,
      },
      {
        type: 'line',
        label: '위험도',
        data: data.map((item) => item.score),
        yAxisID: 'yRisk',
        borderColor: '#3D8D7A',
        borderWidth: 3,
        fill: true,
        backgroundColor: 'rgba(61, 141, 122, 0.2)',
        tension: 0.4,
        pointRadius: 1,
        pointBackgroundColor: '#3D8D7A',
        pointHoverRadius: 5,
        order: 0, 
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
      axis: 'x',
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#6c757d',
          usePointStyle: true,
          padding: 20,
          generateLabels: (chart) => {
            const originalLabels =
              ChartJS.defaults.plugins.legend.labels.generateLabels(chart);
            const riskLabel = originalLabels.find(
              (label) => label.text === '위험도'
            );
            if (riskLabel) {
              const otherLabels = originalLabels.filter(
                (label) => label.text !== '위험도'
              );
              return [riskLabel, ...otherLabels];
            }
            return originalLabels;
          },
        },
      },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            if (!label) return null;

            const value = context.parsed.y;
            if (context.dataset.yAxisID === 'yRisk') {
              return `${label}: ${(value * 100).toFixed(2)}%`;
            }
            // 누적 차트의 경우, 해당 데이터셋의 원본 값을 표시
            if (context.dataset.yAxisID === 'yDeviation') {
                const originalValue = context.dataset.data[context.dataIndex];
                return `${label}: ${originalValue.toFixed(2)}`;
            }
            return null;
          },
        },
      },
    },
    scales: {
      yRisk: {
        type: 'linear',
        display: false,
        position: 'left',
        min: 0,
        max: 1, // 위험도는 0-1 스케일
      },
      yDeviation: {
        type: 'linear',
        display: false,
        position: 'right',
        min: 0,
        max: 15, // Z-score 합산의 최대치를 15 정도로 넉넉하게 고정
        stacked: true,
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        ticks: {
          color: '#6c757d',
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

