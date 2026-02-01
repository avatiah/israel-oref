import { useEffect, useState } from "react";
import ThreatIndexSimple from "../components/ThreatIndexSimple";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/data/data.json", { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error("Не удалось загрузить data.json");
        return res.json();
      })
      .then(json => setData(json))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return (
      <div style={{ color: "white", padding: "40px", textAlign: "center" }}>
        Ошибка: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ color: "white", padding: "40px", textAlign: "center" }}>
        Загрузка данных...
      </div>
    );
  }

  return (
    <main style={{ background: "#111", minHeight: "100vh", color: "white", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>OSINT Security Radar — Израиль</h1>
      <p style={{ textAlign: "center", color: "#888" }}>
        Последнее обновление: {new Date(data.last_update).toLocaleString()}
      </p>

      <ThreatIndexSimple index={data.index} />

      <section style={{ marginTop: "20px", textAlign: "center" }}>
        <h2>Последние сигналы</h2>
        {data.signals && data.signals.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
            {data.signals.map((s, i) => (
              <a
                key={i}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#1c1c1c",
                  padding: "14px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "white"
                }}
              >
                <div style={{ fontWeight: "bold" }}>{s.title}</div>
                <div style={{ fontSize: "12px", color: "#aaa" }}>
                  {s.source} | {new Date(s.date).toLocaleString()}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div style={{ color: "#888", marginTop: "10px" }}>Нет сигналов</div>
        )}
      </section>

      <footer style={{ marginTop: "30px", fontSize: "14px", color: "#777", textAlign: "center" }}>
        © 2026 OSINT Dashboard
      </footer>
    </main>
  );
}
