export default function ThreatIndex({ data }) {
  const weights = {
    military: 0.30,
    rhetoric: 0.15,
    diplomacy: 0.10,
    proxies: 0.20,
    cyber: 0.10,
    alerts: 0.15,
  };

  const score =
    data.military * weights.military +
    data.rhetoric * weights.rhetoric +
    data.diplomacy * weights.diplomacy +
    data.proxies * weights.proxies +
    data.cyber * weights.cyber +
    data.alerts * weights.alerts;

  const percent = Math.round((score / 5) * 100);

  function getColor(p) {
    if (p <= 20) return "#22c55e";
    if (p <= 40) return "#eab308";
    if (p <= 60) return "#f97316";
    if (p <= 80) return "#ef4444";
    return "#7f1d1d";
  }

  function getLabel(p) {
    if (p <= 20) return "Ситуация стабильна";
    if (p <= 40) return "Растущее напряжение";
    if (p <= 60) return "Высокий риск эскалации";
    if (p <= 80) return "Предэскалационная фаза";
    return "Критическая угроза";
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Индекс военной угрозы</h2>
      <div
        style={{
          margin: "20px auto",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: `conic-gradient(${getColor(percent)} ${percent}%, #1f2937 ${percent}%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        {percent}%
      </div>
      <h3 style={{ color: getColor(percent) }}>{getLabel(percent)}</h3>
    </div>
  );
}
