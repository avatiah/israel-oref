import React, { useState, useEffect } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const sync = async () => {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        setData(json);
      } catch (e) { console.error("SYNC_ERROR"); }
    };
    sync();
    const t = setInterval(sync, 120000);
    return () => clearInterval(t);
  }, []);

  // ЗАЩИТА ОТ CLIENT-SIDE EXCEPTION
  if (!data || !data.fronts) return (
    <div className="sys-loading">
      <div className="blink">INITIALIZING_SECURE_PROTOCOLS...</div>
      <style jsx>{`.sys-loading { height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; color: #f00; font-family: monospace; font-size: 0.8rem; } .blink { animation: b 1s infinite; } @keyframes b { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </div>
  );

  return (
    <div className="madad-root">
      <header className="main-nav">
        <div className="brand">MADAD_HAOREF</div>
        <div className="total-idx">TOTAL_RISK: <span className="red">{data.total_index}</span></div>
      </header>

      <section className="summary-box">
        <div className="tag">STRATEGIC_SUMMARY</div>
        <p>{data.strategic_summary}</p>
      </section>

      <main className="fronts-container">
        {Object.entries(data.fronts).map(([id, front]) => (
          <div key={id} className="front-card">
            <div className="front-header">
              <span className="front-name">{id.replace('_', ' ').toUpperCase()}</span>
              <span className="front-score">{front.score}%</span>
            </div>
            <div className="front-body">
              <div className="info-bit">
                <label>ВОЙСКА:</label>
                <span>{front.forces}</span>
              </div>
              <div className="info-bit">
                <label>УГРОЗА:</label>
                <span className="threat-text">{front.threat}</span>
              </div>
              <div className="analyst-box">
                <label>АНАЛИЗ СПЕЦИАЛИСТОВ:</label>
                <p>{front.analyst_view}</p>
              </div>
            </div>
          </div>
        ))}
      </main>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 10px; }
        .madad-root { max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px; }
        .main-nav { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding: 10px 0; font-weight: bold; }
        .summary-box { background: #110000; border: 1px solid #300; padding: 15px; border-left: 3px solid #f00; }
        .tag { font-size: 0.6rem; color: #666; margin-bottom: 8px; letter-spacing: 2px; }
        .summary-box p { font-size: 0.85rem; line-height: 1.4; margin: 0; color: #ccc; }
        .front-card { background: #080808; border: 1px solid #1a1a1a; margin-bottom: 10px; border-left: 4px solid #f00; }
        .front-header { display: flex; justify-content: space-between; padding: 10px 15px; background: #111; }
        .front-name { font-weight: bold; font-size: 0.8rem; color: #888; }
        .front-score { color: #f00; font-weight: bold; }
        .front-body { padding: 15px; }
        .info-bit { margin-bottom: 12px; font-size: 0.75rem; }
        .info-bit label { display: block; color: #444; font-size: 0.6rem; margin-bottom: 4px; }
        .threat-text { color: #ff4d4d; font-weight: bold; }
        .analyst-box { background: #000; padding: 10px; border: 1px solid #111; margin-top: 10px; }
        .analyst-box label { color: #0f0; font-size: 0.6rem; margin-bottom: 5px; display: block; }
        .analyst-box p { font-size: 0.75rem; color: #888; margin: 0; line-height: 1.4; }
        .red { color: #f00; }
      `}</style>
    </div>
  );
}
