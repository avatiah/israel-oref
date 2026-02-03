import React, { useState, useEffect } from 'react';

export default function MadadDirect() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(setData);
    load();
    const t = setInterval(load, 300000); // Обновление раз в 5 минут
    return () => clearInterval(t);
  }, []);

  if (!data) return <div className="loading">ACCESSING_OSINT_DATABASE...</div>;

  return (
    <div className="terminal">
      <header className="top-bar">
        <div className="logo">MADAD_HAOREF // LIVE</div>
        <div className="risk-score">GLOBAL_RISK: {data.safety_index}%</div>
      </header>

      <div className="market-line">
        USD/ILS: <span>{data.ils}</span> | STATUS: <span>CONNECTED</span>
      </div>

      <main className="stream">
        <div className="section-label">INSTITUTIONAL_OSINT_REPORTS</div>
        {data.reports.map((report, i) => (
          <article key={i} className="report-card">
            <div className="meta">
              <span className="agency">{report.agency}</span>
              <span className="date">{new Date(report.date).toLocaleTimeString()}</span>
            </div>
            <h2 className="report-title">{report.title}</h2>
            <p className="report-text">{report.content}...</p>
            <div className="footer">
              <a href={report.link} target="_blank" rel="noreferrer">OPEN_OFFICIAL_SOURCE →</a>
            </div>
          </article>
        ))}
      </main>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 10px; }
        .terminal { max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px; }
        .top-bar { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; padding: 10px 0; font-weight: bold; }
        .risk-score { color: #f00; text-shadow: 0 0 5px #f00; }
        .market-line { font-size: 0.7rem; color: #444; background: #080808; padding: 5px 10px; }
        .market-line span { color: #0f0; }
        .section-label { font-size: 0.6rem; color: #333; margin: 10px 0; letter-spacing: 2px; }
        .report-card { background: #050505; border: 1px solid #111; padding: 15px; border-left: 3px solid #f00; margin-bottom: 12px; }
        .meta { display: flex; justify-content: space-between; font-size: 0.6rem; color: #0f0; margin-bottom: 8px; }
        .report-title { font-size: 0.9rem; margin: 0 0 10px 0; color: #eee; line-height: 1.2; }
        .report-text { font-size: 0.75rem; color: #888; line-height: 1.4; margin-bottom: 12px; }
        .footer { text-align: right; }
        .footer a { color: #f00; font-size: 0.6rem; text-decoration: none; font-weight: bold; border-bottom: 1px solid #400; }
        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 0.7rem; }
      `}</style>
    </div>
  );
}
