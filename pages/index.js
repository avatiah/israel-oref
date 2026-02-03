import React, { useState, useEffect } from 'react';

export default function MadadTerminal() {
  const [data, setData] = useState(null);

  const sync = async () => {
    try {
      const r = await fetch('/api/data');
      const d = await r.json();
      if (d.reports) setData(d);
    } catch (e) { console.error("SYNC_LOST"); }
  };

  useEffect(() => {
    sync();
    const interval = setInterval(sync, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="loading">RE-INITIALIZING_SYSTEM_V84...</div>;

  return (
    <div className="container">
      <header className="header">
        <div className="title">MADAD_HAOREF</div>
        <div className="risk">TOTAL_RISK: <span className="red">{data.risk_index}%</span></div>
      </header>

      <div className="sub-bar">
        <span>EXCHANGE: USD/ILS <b className="green">{data.ils}</b></span>
        <span>STATUS: <b className="green">DATA_STREAM_SYNCED</b></span>
      </div>

      <main className="content">
        <div className="label">LATEST_VERIFIED_INTEL</div>
        {data.reports.length > 0 ? data.reports.map((item, i) => (
          <article key={i} className="intel-card">
            <div className="meta">
              <span className="src">{item.agency.toUpperCase()}</span>
              <span className="time">{new Date(item.ts).toLocaleTimeString()}</span>
            </div>
            <h3 className="intel-title">{item.title}</h3>
            <a href={item.link} target="_blank" rel="noreferrer" className="link">OPEN_SOURCE_REPORT →</a>
          </article>
        )) : <div className="red">FATAL: NO_INCOMING_DATA</div>}
      </main>

      <footer className="footer">
        LAST_SYNC: {new Date(data.timestamp).toLocaleString()} // NODE_ASHDOD
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 15px; }
        .container { max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; padding-bottom: 10px; }
        .title { font-size: 1.3rem; font-weight: 900; }
        .red { color: #f00; text-shadow: 0 0 10px #f00; }
        .green { color: #0f0; }
        .sub-bar { background: #0a0a0a; padding: 10px; font-size: 0.7rem; display: flex; justify-content: space-between; border: 1px solid #1a1a1a; }
        .label { font-size: 0.6rem; color: #444; letter-spacing: 2px; }
        .intel-card { background: #050505; border: 1px solid #111; padding: 15px; border-left: 4px solid #f00; }
        .meta { display: flex; justify-content: space-between; font-size: 0.6rem; color: #0f0; margin-bottom: 10px; }
        .intel-title { font-size: 0.9rem; margin: 0 0 12px 0; line-height: 1.4; font-weight: normal; }
        .link { color: #f00; font-size: 0.65rem; text-decoration: none; font-weight: bold; border-bottom: 1px solid #300; }
        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 0.8rem; }
        .footer { font-size: 0.55rem; color: #222; text-align: center; margin-top: 20px; }
      `}</style>
    </div>
  );
}
