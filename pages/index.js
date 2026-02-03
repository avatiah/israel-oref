import React, { useState, useEffect } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  const update = async () => {
    try {
      const res = await fetch('/api/data');
      const json = await res.json();
      if (json.intel) setData(json);
    } catch (e) { console.error("LINK_LOST"); }
  };

  useEffect(() => {
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div className="loading">RE-ESTABLISHING_SECURE_CONNECTION...</div>;

  return (
    <div className="terminal">
      <header className="header">
        <div className="brand">MADAD_HAOREF</div>
        <div className="risk-tag">TOTAL_RISK: <span className="red-glow">{data.risk}%</span></div>
      </header>

      <div className="status-strip">
        <span>CURRENCY: USD/ILS <b className="green">{data.ils}</b></span>
        <span>GATEWAY: <b className="green">ACTIVE</b></span>
      </div>

      <main className="content">
        <div className="label">VERIFIED_INSTITUTIONAL_INTEL (LIVE)</div>
        {data.intel.map((item, i) => (
          <article key={i} className="intel-card">
            <div className="meta">
              <span className="source">{item.source.toUpperCase()}</span>
              <span className="time">{new Date(item.pubDate).toLocaleTimeString()}</span>
            </div>
            <h2 className="title">{item.title}</h2>
            <div className="footer">
              <a href={item.link} target="_blank" rel="noreferrer">OPEN_OFFICIAL_REPORT →</a>
            </div>
          </article>
        ))}
      </main>

      <footer className="footer-info">
        SYNC: {new Date(data.updated).toLocaleString()} // NODE: ASHDOD_DISTRICT
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 10px; }
        .terminal { max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; padding: 15px 0; }
        .brand { font-weight: 900; letter-spacing: 2px; font-size: 1.2rem; }
        .red-glow { color: #f00; text-shadow: 0 0 10px #f00; }
        .green { color: #0f0; }
        .status-strip { background: #080808; border: 1px solid #111; padding: 10px; font-size: 0.65rem; display: flex; justify-content: space-between; }
        .label { font-size: 0.55rem; color: #444; margin: 10px 0; letter-spacing: 2px; font-weight: bold; }
        .intel-card { background: #050505; border: 1px solid #1a1a1a; padding: 15px; border-left: 4px solid #f00; margin-bottom: 12px; }
        .meta { display: flex; justify-content: space-between; font-size: 0.55rem; color: #0f0; margin-bottom: 8px; }
        .title { font-size: 0.9rem; margin: 0 0 12px 0; line-height: 1.4; color: #eee; }
        .footer a { color: #f00; font-size: 0.6rem; text-decoration: none; font-weight: bold; border-bottom: 1px solid #400; }
        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 0.7rem; }
        .footer-info { font-size: 0.5rem; color: #222; text-align: center; padding: 20px; }
      `}</style>
    </div>
  );
}
