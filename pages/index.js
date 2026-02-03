import React, { useState, useEffect } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const sync = () => fetch('/api/data').then(r => r.json()).then(setData);
    sync();
    const t = setInterval(sync, 300000); // Обновление раз в 5 минут (аналитика не требует чаще)
    return () => clearInterval(t);
  }, []);

  if (!data) return <div className="loading">LOADING_STRATEGIC_INTEL...</div>;

  return (
    <div className="mobile-terminal">
      <header className="brand-header">
        <h1>MADAD_HAOREF</h1>
        <div className="status-line">
          <span className="blink">●</span> STRATEGIC_ANALYSIS_V74
        </div>
      </header>

      <div className="risk-indicator">
        <div className="risk-label">CURRENT_THREAT_VECTOR</div>
        <div className="risk-val">{data.risk_assessment}</div>
      </div>

      <main className="intel-stack">
        {data.reports.map((report, i) => (
          <article key={i} className="intel-card">
            <div className="card-meta">
              <span className="agency">{report.agency}</span>
              <span className="date">{report.date}</span>
            </div>
            <h2 className="card-title">{report.title}</h2>
            <p className="card-summary">{report.summary}</p>
            <a href={report.link} target="_blank" rel="noreferrer" className="read-more">
              OPEN_FULL_ANALYSIS →
            </a>
          </article>
        ))}
      </main>

      <footer className="footer">
        REF: {new Date(data.updated).toLocaleTimeString()} // OSINT_CONSOLIDATED
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 0; }
        .mobile-terminal { display: flex; flex-direction: column; min-height: 100vh; padding: 15px; max-width: 500px; margin: 0 auto; }
        
        .brand-header { border-bottom: 2px solid #f00; padding-bottom: 10px; margin-bottom: 20px; }
        .brand-header h1 { font-size: 1.5rem; margin: 0; letter-spacing: 3px; }
        .status-line { font-size: 0.7rem; color: #666; margin-top: 5px; }
        .blink { color: #f00; margin-right: 5px; animation: pulse 1.5s infinite; }

        .risk-indicator { background: #0a0a0a; border: 1px solid #222; padding: 15px; margin-bottom: 20px; text-align: center; }
        .risk-label { font-size: 0.6rem; color: #444; margin-bottom: 5px; }
        .risk-val { font-size: 1.2rem; font-weight: bold; color: #f00; text-shadow: 0 0 10px #f00; }

        .intel-stack { display: flex; flex-direction: column; gap: 15px; }
        .intel-card { background: #050505; border: 1px solid #1a1a1a; padding: 15px; border-left: 3px solid #333; }
        .intel-card:active { background: #111; }
        
        .card-meta { display: flex; justify-content: space-between; font-size: 0.6rem; margin-bottom: 10px; color: #0f0; }
        .card-title { font-size: 0.95rem; margin: 0 0 10px 0; line-height: 1.3; }
        .card-summary { font-size: 0.8rem; color: #888; line-height: 1.5; margin-bottom: 15px; }
        
        .read-more { display: block; text-align: right; font-size: 0.7rem; color: #f00; text-decoration: none; font-weight: bold; }
        
        .footer { margin-top: auto; padding: 20px 0; font-size: 0.6rem; color: #222; text-align: center; }
        
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 1rem; }
      `}</style>
    </div>
  );
}
