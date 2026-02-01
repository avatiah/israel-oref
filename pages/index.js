import { useEffect, useState } from "react";
import ThreatIndexSimple from "../components/ThreatIndexSimple";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/data.json", { cache: "no-store" })
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Ошибка загрузки data.json:", err));
  }, []);

  if (!data) return <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Загрузка данных...</div>;

  return (
    <main style={{ background: "#111", minHeight: "100vh", color: "white", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>OSINT Security Radar — Израиль</h1>
      <p style={{ textAlign: "center", color: "#888" }}>
        Последнее обновление: {new Date(data.last_update).toLocaleString()}
      </p>

      {/* Передаем реальный индекс */}
      <ThreatIndexSimple index={data.index} />

      <section style={{ maxWidth: "900px", margin: "40px auto" }}>
        <h2 style={{ textAlign: "center" }}>Последние аналитические сигналы</h2>
        {data.signals.map((s, i) => (
          <a key={i} href={s.link} target="_blank" rel="noopener noreferrer"
             style={{ background: "#1c1c1c", padding: "15px", borderRadius: "8px", color: "white", textDecoration: "none", display: "block", marginBottom: "10px" }}>
            <div style={{ fontWeight: "bold" }}>{s.title}</div>
            <div style={{ fontSize: "12px", color: "#aaa" }}>
              {s.source} | {new Date(s.date).toLocaleString()}
            </div>
          </a>
        ))}
      </section>

      <footer style={{ textAlign: "center", padding: "20px", fontSize: "14px", color: "#888" }}>
        © 2026 OSINT Dashboard
      </footer>
    </main>
  );
}
