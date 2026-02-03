import React, { useState, useEffect } from 'react';

export default function MadadLive() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchIntel = () => fetch('/api/data').then(r => r.json()).then(setData);
    fetchIntel();
    const interval = setInterval(fetchIntel, 300000); // Обновление каждые 5 минут
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="boot">ACCESSING_DIRECT_INTEL_STREAM...</div>;

  return (
    <div className="terminal-v81">
      <header className="header">
        <div className="node-id">NODE: ASHDOD_DISTRICT // LIVE_V81</div>
        <div className="global-risk">GLOBAL_RISK_INDEX: <span className="red">{data.risk_index}%</span></div>
      </header>

      <div className="market-strip">
        <span>USD/ILS: <b className="green">{data.ils}</b></span>
        <span>STATUS: <b className="green">ONLINE</b></span>
        <span>LAST_UPDATE: {new Date(data.updated).toLocaleTimeString()}</span>
      </div>

      <main className="intel-stream">
        <div className="label">VERIFIED_INSTITUTIONAL_REPORTS</div>
        {data.intel.length > 0 ? data.intel.map((report, i) => (
          <article key={i} className="intel-card">
            <div className="card-top">
              <span className="agency">{report.agency}</span>
              <span className="ts">{new Date(report.pubDate).toLocaleString()}</span>
            </div>
            <h2 className="title">{report.title}</h2>
            <p className="summary">{report.summary}...</p>
            <div className="actions">
              <a href={report.link} target="_blank" rel="noreferrer">OPEN_SOURCE_INTEL →</a>
            </div>
          </article>
        )) : <div className="error">AWAITING_INCOMING_PACKETS...</div>}
      </main>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 10px; }
        .terminal-v81 { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px; }
        
        .header { display: flex; justify-content: space-between; border-bottom: 1px solid #333; padding: 10px 0; font-size: 0.8rem; }
        .red { color: #f00; font-weight: bold; text-shadow: 0 0 5px #f00; }
        .green { color: #0f0; }

        .market-strip { background: #080808; padding: 8px 15px; font-size: 0.7rem; display: flex; justify-content: space-between; border: 1px solid #111; }
        
        .label { font-size: 0.6rem; color: #444; margin-top: 10px; letter-spacing: 2px; }
        .intel-card { background: #050505; border: 1px solid #1a1a1a; padding: 15px; border-left: 3px solid #f00; transition: 0.3s; }
        .intel-card:hover { border-color: #333; }
        
        .card-top { display: flex; justify-content: space-between; font-size: 0.6rem; color: #0f0; margin-bottom: 10px; }
        .title { font-size: 1rem; margin: 0 0 10px 0; line-height: 1.3; color: #eee; }
        .summary { font-size: 0.8rem; color: #888; line-height: 1.5; margin-bottom: 15px; text-align: justify; }
        
        .actions { text-align: right; }
        .actions a { color: #f00; font-size: 0.65rem; text-decoration: none; font-weight: bold; border-bottom: 1px solid #400; }
        
        .boot { height: 100vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 0.8rem; }
      `}</style>
    </div>
  );
}
