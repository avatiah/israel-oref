import React, { useState, useEffect } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const sync = () => fetch('/api/data').then(r => r.json()).then(setData).catch(console.error);
    sync();
    const t = setInterval(sync, 120000); 
    return () => clearInterval(t);
  }, []);

  if (!data) return <div className="boot">ESTABLISHING_ENCRYPTED_LINK...</div>;

  return (
    <div className="terminal">
      <header className="top">
        <div className="brand">MADAD_HAOREF</div>
        <div className="risk">TOTAL_RISK_INDEX: <span className="red">{data.risk}%</span></div>
      </header>

      <div className="stats">
        <span>EXCHANGE: USD/ILS <b className="green">{data.ils}</b></span>
        <span>STATUS: <b className="green">DIRECT_FEED_ACTIVE</b></span>
      </div>

      <main className="feed">
        <div className="label">ACTUAL_INSTITUTIONAL_ANALYSIS</div>
        {data.intel.length > 0 ? data.intel.map((item, i) => (
          <article key={i} className="card">
            <div className="meta">
              <span className="source">{item.agency}</span>
              <span className="ts">{new Date(item.time).toLocaleTimeString()}</span>
            </div>
            <h2 className="title">{item.title}</h2>
            <p className="summary">{item.content}...</p>
            <div className="action">
              <a href={item.link} target="_blank" rel="noreferrer">OPEN_SOURCE_REPORT →</a>
            </div>
          </article>
        )) : <div className="err">DATA_STREAM_EMPTY_CHECK_BACKEND</div>}
      </main>

      <footer className="footer">
        REF_TIME: {new Date(data.updated).toLocaleString()} // NODE: ASHDOD
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 10px; }
        .terminal { max-width: 550px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px; }
        .top { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; padding: 15px 0; }
        .brand { font-weight: 900; letter-spacing: 2px; font-size: 1.2rem; }
        .red { color: #f00; text-shadow: 0 0 10px #f00; }
        .green { color: #0f0; }
        .stats { background: #080808; border: 1px solid #111; padding: 10px; font-size: 0.7rem; display: flex; justify-content: space-between; }
        .label { font-size: 0.6rem; color: #444; margin: 10px 0; letter-spacing: 1px; }
        .card { background: #050505; border: 1px solid #1a1a1a; padding: 15px; border-left: 4px solid #f00; margin-bottom: 12px; }
        .meta { display: flex; justify-content: space-between; font-size: 0.6rem; color: #0f0; margin-bottom: 10px; }
        .title { font-size: 1rem; margin: 0 0 10px 0; line-height: 1.3; }
        .summary { font-size: 0.8rem; color: #999; line-height: 1.5; margin-bottom: 15px; }
        .action a { color: #f00; font-size: 0.65rem; text-decoration: none; font-weight: bold; border-bottom: 1px solid #400; }
        .boot { height: 100vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 0.8rem; }
        .footer { font-size: 0.55rem; color: #222; text-align: center; padding: 20px; }
      `}</style>
    </div>
  );
}
