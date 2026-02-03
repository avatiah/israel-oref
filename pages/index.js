import React, { useState, useEffect } from 'react';

export default function MadadHaOrefFinal() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const sync = () => fetch('/api/data').then(r => r.json()).then(setData).catch(console.error);
    sync();
    const t = setInterval(sync, 300000); // Раз в 5 минут, чтобы беречь лимиты
    return () => clearInterval(t);
  }, []);

  if (!data) return <div className="loader">ESTABLISHING_DIRECT_LINK...</div>;

  return (
    <div className="madad-v79">
      <header className="header">
        <div className="brand">MADAD_HAOREF</div>
        <div className="risk-badge">RISK_LEVEL: {data.markets.index}%</div>
      </header>

      <section className="market-strip">
        <div className="m-item">USD/ILS: <span>{data.markets.ils}</span></div>
        <div className="m-item">SOURCE: <span>DIRECT_STREAM</span></div>
      </section>

      <main className="intel-stream">
        <div className="label">VERIFIED_INSTITUTE_REPORTS (LIVE)</div>
        {data.intel.map((item, i) => (
          <article key={i} className="intel-card">
            <div className="card-meta">
              <span className="agency">{item.agency.toUpperCase()}</span>
              <span className="time">{new Date(item.ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <h2 className="title">{item.title}</h2>
            <p className="summary">{item.summary}...</p>
            <a href={item.link} target="_blank" rel="noreferrer" className="source-link">READ_FULL_OSINT_REPORT →</a>
          </article>
        ))}
      </main>

      <footer className="footer">
        DATA_INTEGRITY: AUTHENTIC // {new Date(data.updated).toLocaleString()}
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 10px; }
        .madad-v79 { max-width: 450px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px; }
        
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f00; padding: 10px 0; }
        .brand { font-size: 1.2rem; font-weight: 900; letter-spacing: 2px; }
        .risk-badge { font-size: 0.7rem; color: #f00; font-weight: bold; }

        .market-strip { display: flex; justify-content: space-between; background: #080808; padding: 8px 15px; font-size: 0.7rem; color: #666; }
        .m-item span { color: #0f0; margin-left: 5px; }

        .label { font-size: 0.6rem; color: #333; margin: 10px 0; border-left: 2px solid #f00; padding-left: 8px; }
        .intel-card { background: #050505; border: 1px solid #111; padding: 15px; margin-bottom: 15px; border-left: 3px solid #333; }
        .card-meta { display: flex; justify-content: space-between; font-size: 0.6rem; color: #0f0; margin-bottom: 10px; }
        .title { font-size: 0.95rem; margin: 0 0 10px 0; line-height: 1.3; color: #eee; }
        .summary { font-size: 0.8rem; color: #888; line-height: 1.4; margin-bottom: 15px; }
        .source-link { font-size: 0.65rem; color: #f00; text-decoration: none; font-weight: bold; display: block; text-align: right; }

        .footer { font-size: 0.55rem; color: #222; text-align: center; padding: 20px; }
        .loader { height: 100vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 0.7rem; letter-spacing: 3px; }
      `}</style>
    </div>
  );
}
