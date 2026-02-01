import Head from "next/head";
import ThreatIndex from "../components/ThreatIndex";

export default function Home() {
  // 🔹 Тестовые данные для Threat Index
  const mockData = {
    military: 3,    // Военная активность (0-5)
    rhetoric: 4,    // Риторика лидеров (0-5)
    diplomacy: 2,   // Дипломатические сигналы (0-5)
    proxies: 3,     // Прокси-группы (0-5)
    cyber: 1,       // Кибер-атаки (0-5)
    alerts: 2       // Экстренные предупреждения (0-5)
  };

  return (
    <>
      <Head>
        <title>Israel Security OSINT Dashboard</title>
        <meta name="description" content="OSINT Dashboard: текущий уровень напряжённости в регионе Израиля" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={{ background: "#111", minHeight: "100vh", color: "white", fontFamily: "Arial, sans-serif" }}>
        <header style={{ textAlign: "center", padding: "40px 20px" }}>
          <h1>OSINT Security Radar — Израиль</h1>
          <p>Индекс текущей военной угрозы в регионе на основе открытых аналитических источников</p>
        </header>

        {/* 🔹 Визуальный компонент индекса угрозы */}
        <ThreatIndex data={mockData} />

        <section style={{ maxWidth: "800px", margin: "40px auto", textAlign: "center" }}>
          <h2>Что это показывает</h2>
          <p>
            Индекс отражает динамику открытых аналитических источников:
            военные обсуждения, официальную риторику, активность OSINT-аналитиков и региональные сигналы.
            Это индикатор информационной напряжённости, а не прогноз событий.
          </p>
        </section>

        <footer style={{ textAlign: "center", padding: "20px", fontSize: "14px", color: "#888" }}>
          © 2026 OSINT Dashboard | Данные обновляются автоматически
        </footer>
      </main>
    </>
  );
}
