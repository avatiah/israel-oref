import React, { useState, useEffect } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const sync = () => fetch('/api/data').then(r => r.json()).then(setData);
    sync();
    const t = setInterval(sync, 120000);
    return () => clearInterval(t);
  }, []);

  if (!data) return <div className="loading">SYNCING_STRATEGIC_CORE...</div>;

  return (
    <div className="terminal-mobile">
      <header className="brand">
        <h1>MADAD_HAOREF</h1>
        <div className="sub">STRATEGIC_OSINT_NODE // V76</div>
      </header>

      {/* ГЛАВНЫЙ ВЫВОД */}
      <section className="safety-node">
        <div className="index-circle">
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="circle" strokeDasharray={`${data.index}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <text x="18" y="20.35" className="percentage">{data.index}</text>
          </svg>
          <div className="index-label">SAFETY_INDEX</div>
        </div>
        <div className="status-box">
          <div className="status-title">CURRENT_STATUS</div>
          <div className="status-val">{data.status}</div>
        </div>
      </section>

      <section className="conclusion-box">
        <div className="box-label">STRATEGIC_CONCLUSION</div>
        <p>{data.conclusion}</p>
      </section>

      <main className="analysis-stack">
        <div className="box-label">EXPERT_DATA_POINTS</div>
        {data.reports.map((r, i) => (
          <div key={i} className="report-card">
            <div className="card-meta">
              <span className="src">{r.source}</span>
              <span className={`impact ${r.impact}`}>{r.impact}_IMPACT</span>
            </div>
            <div className="card-topic">{r.topic}</div>
            <p className="card-text">{r.summary}</p>
          </div>
        ))}
      </main>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 10px; }
        .terminal-mobile { max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px; }
        
        .brand { border-bottom: 2px solid #f00; padding: 10px 0; }
        .brand h1 { margin: 0; font-size: 1.4rem; letter-spacing: 3px; }
        .sub { font-size: 0.6rem; color: #666; }

        .safety-node { background: #080808; border: 1px solid #1a1a1a; padding: 20px; display: flex; align-items: center; gap: 20px; }
        .circular-chart { width: 100px; height: 100px; }
        .circle-bg { fill: none; stroke: #111; stroke-width: 2.5; }
        .circle { fill: none; stroke: #f00; stroke-width: 2.5; stroke-linecap: round; filter: drop-shadow(0 0 5px #f00); }
        .percentage { fill: #fff; font-size: 0.6rem; text-anchor: middle; font-weight: bold; }
        .index-label { font-size: 0.5rem; color: #444; text-align: center; margin-top: 5px; }

        .status-title { font-size: 0.6rem; color: #555; }
        .status-val { color: #f00; font-weight: bold; font-size: 1.1rem; text-shadow: 0 0 10px #f00; }

        .conclusion-box { background: #110000; border-left: 3px solid #f00; padding: 15px; }
        .conclusion-box p { font-size: 0.85rem; line-height: 1.5; color: #ccc; margin: 0; }
        
        .box-label { font-size: 0.6rem; color: #444; margin-bottom: 10px; letter-spacing: 2px; }

        .report-card { background: #050505; border: 1px solid #111; padding: 15px; margin-bottom: 10px; }
        .card-meta { display: flex; justify-content: space-between; font-size: 0.6rem; margin-bottom: 8px; }
        .src { color: #0f0; }
        .impact.HIGH { color: #f00; }
        .card-topic { font-weight: bold; margin-bottom: 5px; font-size: 0.9rem; }
        .card-text { font-size: 0.75rem; color: #888; line-height: 1.4; margin: 0; }

        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 0.8rem; }
      `}</style>
    </div>
  );
}
