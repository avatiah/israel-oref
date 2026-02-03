import React, { useState, useEffect } from 'react';

export default function MadadHaOrefRealtime() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const sync = () => fetch('/api/data').then(r => r.json()).then(setData).catch(console.error);
    sync();
    const t = setInterval(sync, 60000);
    return () => clearInterval(t);
  }, []);

  if (!data) return <div className="loading">SYNCING_REAL_TIME_DATA...</div>;

  return (
    <div className="madad-mobile">
      <header className="header">
        <div className="brand">MADAD_HAOREF</div>
        <div className="sync-tag">LIVE_DATA_NODE</div>
      </header>

      {/* РЕАЛЬНЫЙ ИНДЕКС БЕЗОПАСНОСТИ */}
      <section className="index-hero">
        <div className="label">SECURITY_RISK_INDEX</div>
        <div className="value">{data.index}</div>
        <div className="status-bar">
          <div className="progress" style={{width: `${data.index}%`}}></div>
        </div>
        <div className="warning">ПОКАЗАТЕЛЬ ОСНОВАН НА ВОЛАТИЛЬНОСТИ РЫНКА И OSINT-ПОТОКЕ</div>
      </section>

      {/* ЭКОНОМИЧЕСКИЕ ИНДИКАТОРЫ УГРОЗЫ */}
      <div className="market-grid">
        <div className="m-card">
          <label>USD/ILS</label>
          <div className="val">{data.ils}</div>
        </div>
        <div className="m-card">
          <label>BRENT_OIL</label>
          <div className="val">${data.brent}</div>
        </div>
      </div>

      {/* ЖИВАЯ ЛЕНТА СОБЫТИЙ (БЕЗ РЕДАКТУРЫ) */}
      <section className="news-feed">
        <div className="label">RAW_INTELLIGENCE_STREAM</div>
        {data.news.map((item, i) => (
          <div key={i} className="news-item">
            <span className="time">[{item.time}]</span>
            <p className="title">{item.title}</p>
          </div>
        ))}
      </section>

      <footer className="footer">
        REF_TIME: {new Date(data.updated).toLocaleString()}
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 10px; }
        .madad-mobile { max-width: 450px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; padding: 10px 0; }
        .brand { font-weight: bold; letter-spacing: 2px; }
        .sync-tag { font-size: 0.6rem; color: #0f0; border: 1px solid #040; padding: 2px 5px; }
        
        .index-hero { background: #080808; border: 1px solid #1a1a1a; padding: 25px; text-align: center; }
        .index-hero .value { font-size: 4rem; font-weight: bold; color: #f00; margin: 10px 0; }
        .status-bar { height: 4px; background: #111; width: 100%; margin: 15px 0; }
        .progress { height: 100%; background: #f00; box-shadow: 0 0 10px #f00; transition: 1s; }
        .warning { font-size: 0.5rem; color: #444; }

        .market-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .m-card { background: #050505; border: 1px solid #111; padding: 15px; text-align: center; }
        .m-card label { font-size: 0.6rem; color: #555; display: block; margin-bottom: 5px; }
        .m-card .val { font-size: 1.2rem; font-weight: bold; color: #fff; }

        .news-feed { display: flex; flex-direction: column; gap: 10px; }
        .news-item { border-left: 2px solid #f00; padding-left: 10px; margin-bottom: 10px; }
        .time { color: #f00; font-size: 0.7rem; font-weight: bold; }
        .title { margin: 5px 0 0 0; font-size: 0.85rem; color: #ccc; line-height: 1.3; }
        
        .footer { font-size: 0.6rem; color: #222; text-align: center; padding: 20px; }
        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 0.8rem; letter-spacing: 3px; }
      `}</style>
    </div>
  );
}
