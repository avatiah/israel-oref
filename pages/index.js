import React, { useState, useEffect } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const sync = async () => {
      try {
        const res = await fetch('/api/data');
        if (!res.ok) throw new Error('API_OFFLINE');
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Critical Sync Failure");
      }
    };
    sync();
    const t = setInterval(sync, 60000);
    return () => clearInterval(t);
  }, []);

  // Если данных нет, показываем терминальную загрузку
  if (!data || !data.fronts) {
    return (
      <div className="sys-loading">
        CONNECTING_TO_STRATEGIC_NODES...
        <style jsx>{`
          .sys-loading { 
            height: 100vh; background: #000; color: #f00; 
            display: flex; align-items: center; justify-content: center; 
            font-family: monospace; font-size: 0.8rem; letter-spacing: 2px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="madad-root">
      <header className="main-nav">
        <div className="brand">MADAD_HAOREF</div>
        <div className="total-idx">
          TOTAL_RISK: <span className="red-glow">{data.total_index}</span>
        </div>
      </header>

      {/* Исправленный блок: теги теперь симметричны */}
      <section className="summary-box">
        <div className="tag">STRATEGIC_SUMMARY</div>
        <p>{data.strategic_summary}</p>
      </section>

      <main className="fronts-container">
        {Object.entries(data.fronts).map(([id, front]) => (
          <article key={id} className="front-card">
            <div className="front-header">
              <span className="front-name">{id.replace('_', ' ').toUpperCase()}</span>
              <span className="front-score">{front.score}%</span>
            </div>
            
            <div className="front-body">
              <div className="info-bit">
                <label>ЗАДЕЙСТВОВАННЫЕ СИЛЫ:</label>
                <span>{front.forces}</span>
              </div>
              <div className="info-bit">
                <label>ХАРАКТЕР УГРОЗЫ:</label>
                <span className="threat-highlight">{front.threat}</span>
              </div>
              <div className="analyst-box">
                <label>ВЫВОДЫ OSINT-ГРУППЫ:</label>
                <p>{front.analyst_view}</p>
              </div>
            </div>
          </article>
        ))}
      </main>

      <footer className="footer-info">
        LAST_SYNC: {new Date(data.updated).toLocaleTimeString()} // ASHDOD_NODE
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 10px; }
        .madad-root { max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px; }
        
        .main-nav { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding: 15px 0; }
        .red-glow { color: #f00; text-shadow: 0 0 10px #f00; font-weight: bold; }

        .summary-box { background: #0a0000; border: 1px solid #200; padding: 15px; border-left: 4px solid #f00; }
        .tag { font-size: 0.6rem; color: #555; margin-bottom: 8px; letter-spacing: 2px; }
        .summary-box p { font-size: 0.85rem; line-height: 1.5; margin: 0; color: #d1d1d1; }

        .front-card { background: #050505; border: 1px solid #1a1a1a; margin-bottom: 12px; border-left: 4px solid #333; }
        .front-header { display: flex; justify-content: space-between; padding: 10px 15px; background: #0f0f0f; }
        .front-name { font-weight: bold; font-size: 0.75rem; color: #999; }
        .front-score { color: #f00; font-weight: bold; }

        .front-body { padding: 15px; }
        .info-bit { margin-bottom: 12px; }
        .info-bit label { display: block; color: #444; font-size: 0.6rem; margin-bottom: 4px; }
        .info-bit span { font-size: 0.8rem; }
        .threat-highlight { color: #ff4d4d; font-weight: bold; }

        .analyst-box { background: #000; padding: 10px; border: 1px solid #111; margin-top: 10px; }
        .analyst-box label { color: #0f0; font-size: 0.55rem; margin-bottom: 5px; display: block; }
        .analyst-box p { font-size: 0.75rem; color: #999; margin: 0; line-height: 1.4; }

        .footer-info { text-align: center; font-size: 0.6rem; color: #222; padding: 20px 0; }
      `}</style>
    </div>
  );
}
