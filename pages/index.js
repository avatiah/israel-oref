import { useEffect, useState } from "react";
import ThreatIndexSimple from "../components/ThreatIndexSimple";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/data", { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error("Не удалось загрузить API");
        return res.json();
      })
      .then(json => setData(json))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return <div style={{ color: "white", padding: "40px", textAlign: "center" }}>Ошибка: {error}</div>;
  }

  if (!data) {
    return <div style={{ color: "white", padding: "40px", textAlign: "center" }}>Загрузка данных...</div>;
  }

  return (
    <main style={{ background: "#111", minHeight: "100vh", color: "white", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>OSINT Security Radar — Израиль</h1>
      <p style={{ textAlign: "center", color: "#888" }}>
        Последнее обновление: {new Date(data.last_update).toLocaleString()}
      </p>

      <ThreatIndexSimple index={data?.index ?? 0} />

      <section style={{ maxWidth: "900px", margin: "40px auto" }}>
        <h2 style={{ textAlign: "center" }}>Последние аналитические сигналы</h2>
        {data.signals && data.signals.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
            {data.signals.map((s, i) => (
              <a key={i} href={s.link} target="_blank" rel="noopener noreferrer"
                 style={{
                   background: "#1c1c1c",
                   padding: "14px",
                   borderRadius: "8px",
                   textDecoration: "none",
                   color: "white",
                   display: "block"
                 }}
              >
                <div style={{ fontWeight: "bold" }}>{s.title}</div>
                <div style={{ fontSize: "12px", color: "#aaa" }}>
                  {s.source} | {new Date(s.date).toLocaleString()}
                </div>
              </a>
            ))}
          </div>
        ) : <div style={{ color: "#888", marginTop: "10px" }}>Нет сигналов</div>}
      </section>

      <footer style={{ textAlign: "center", padding: "20px", fontSize: "14px", color: "#888" }}>
        © 2026 OSINT Dashboard
      </footer>
    </main>
  );
}
