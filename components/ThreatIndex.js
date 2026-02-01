import React, { useEffect, useState } from "react";

// Простой круговой индикатор
export default function ThreatIndex({ data }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!data) return;
    console.log("ThreatIndex data:", data);

    // Суммируем все значения компонентов (0-5) и переводим в процент
    const sum =
      (data.military || 0) +
      (data.rhetoric || 0) +
      (data.diplomacy || 0) +
      (data.proxies || 0) +
      (data.cyber || 0) +
      (data.alerts || 0);

    const maxSum = 5 * 6; // максимальное значение = 5*6 компонентов
    setTotal(Math.round((sum / maxSum) * 100));
  }, [data]);

  // Цвет по проценту угрозы
  const getColor = (percent) => {
    if (percent < 30) return "#4CAF50"; // зелёный
    if (percent < 60) return "#FFC107"; // жёлтый
    if (percent < 80) return "#FF9800"; // оранжевый
    return "#F44336"; // красный
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "40px 0",
      }}
    >
      <svg width="200" height="200">
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke="#333"
          strokeWidth="20"
          fill="none"
        />
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke={getColor(total)}
          strokeWidth="20"
          fill="none"
          strokeDasharray={`${(total * 565) / 100}, 565`} // 2*π*r ≈ 565
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
        />
        <text
          x="100"
          y="110"
          textAnchor="middle"
          fontSize="36"
          fill={getColor(total)}
          fontWeight="bold"
        >
          {total}%
        </text>
      </svg>
      <div style={{ marginTop: "10px", color: "#aaa" }}>
        Threat Index
      </div>
    </div>
  );
}
