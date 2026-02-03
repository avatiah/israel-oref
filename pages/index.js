import React, { useState, useEffect } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const sync = () => fetch('/api/data').then(r => r.json()).then(setData).catch(console.error);
    sync();
    const t = setInterval(sync, 180000); 
    return () => clearInterval(t);
  }, []);

  if (!data) return <div className="boot">SYNCING_REAL_TIME_OSINT_NODES...</div>;

  return (
    <div className="admin-page">
      <header className="header">
        <div className="brand">MADAD_HAOREF</div>
        <div className="risk">TOTAL_RISK_INDEX: <span className="red">{data.risk_index}%</span></div>
      </header>

      <div className="market-data">
        <span>EXCHANGE: USD/ILS <b className="green">{data.ils}</b></span>
        <span>GATEWAY: <b className="green">STABLE</b></span>
      </div>

      <main className="content">
        <div className="label">LATEST_INSTITUTIONAL_ANALYSIS</div>
        {data.reports.length > 0 ? data.reports.map((report, i) => (
          <article key={i} className="card">
            <div className="card-header">
              <span className="source">{report.source.toUpperCase()}</span>
              <span className="time">{new Date(report.pubDate).toLocaleTimeString()}</span>
            </div>
            <h2 className="title">{report.title}</h2>
            <p className="text">{report.summary}...</p>
            <div className="link-box">
              <a href={report.link} target="_blank" rel="noreferrer">VIEW_ORIGINAL_ANALYSIS →</a>
            </div>
          </article>
        )) : <div className="error">CONNECTION_ESTABLISHED_AWAITING_DATA_STREAM...</div>}
      </main>

      <footer className="footer">
        REF_TIME: {new Date(data.updated).toLocaleString()} // ASHDOD_NODE
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 10px; }
        .admin-page { max-width: 550px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px; }
        
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; padding: 10px 0; }
        .brand { font-weight: 900; letter-spacing: 2px; }
        .red { color: #f00; text-shadow: 0 0 8px #f00; }
        .green { color: #0f0; }

        .market-data { background: #080808; border: 1px solid #111; padding: 10px; font-size: 0.7rem; display: flex; justify-content: space-between; }
        
        .label { font-size: 0.6rem; color: #444; margin: 10px 0; letter-spacing: 1px; }
        .card { background: #050505; border: 1px solid #1a1a1a; padding: 15px; border-left: 4px solid #f00; margin-bottom: 12px; }
        .card-header { display: flex; justify-content: space-between; font-size: 0.6rem; color: #0f0; margin-bottom: 10px; }
        
        .title { font-size: 1rem; margin: 0 0 10px 0; line-height: 1.3; color: #fff; }
        .text { font-size: 0.8rem; color: #999; line-height: 1.5; margin-bottom: 15px; }
        
        .link-box { text-align: right; }
        .link-box a { color: #f00; font-size: 0.65rem; text-decoration: none; font-weight: bold; border-bottom: 1px solid #400; }
        
        .boot { height: 100vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 0.8rem; letter-spacing: 3px; }
        .footer { font-size: 0.55rem; color: #222; text-align: center; padding: 20px 0; }
      `}</style>
    </div>
  );
}
