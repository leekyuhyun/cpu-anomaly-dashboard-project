import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./RiskGauge.css";

// Register the necessary elements for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// RiskGauge now uses Chart.js for a modern look, consistent with RiskChart.

const getRiskProfile = (score) => {
  const percentage = score * 100;
  if (percentage >= 90) {
    return { level: "매우 위험", color: "#B02A37", className: "status-critical" };
  }
  if (percentage >= 70) {
    return { level: "높음", color: "var(--danger-red)", className: "status-high" };
  }
  if (percentage >= 40) {
    return { level: "보통", color: "#fd7e14", className: "status-medium" }; // Orange
  }
  return { level: "낮음", color: "var(--success-green)", className: "status-low" };
};

const RiskGauge = ({ score }) => {
  const riskProfile = getRiskProfile(score);
  const scorePercentage = score * 100;

  const data = {
    labels: ["Risk", "Remaining"],
    datasets: [
      {
        data: [scorePercentage, 100 - scorePercentage],
        backgroundColor: [riskProfile.color, "rgba(0, 0, 0, 0.05)"],
        borderColor: ["transparent", "transparent"],
        borderWidth: 0,
        circumference: 180,
        rotation: -90,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    cutout: "80%", // Makes it a doughnut
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="risk-gauge-container">
      <div className="gauge-chart-wrapper">
        <Doughnut data={data} options={options} />
        <div className="gauge-text-content">
          <div className={`gauge-level ${riskProfile.className}`}>
            {riskProfile.level}
          </div>
          <div className="gauge-subtitle">위험도 수준</div>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;
