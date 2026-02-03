import React, { useState, useEffect } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const sync = () => fetch('/api/data').then(r => r.json()).then(setData);
    sync();
    const t = setInterval(sync, 120000); 
    return () => clearInterval(t);
  }, []);

  if (!data) return <div className="sys-boot">INITIALIZING_MADAD_CORE...</div>;

  return (
    <div className="mobile-interface">
      <header className="main-header">
        <div className="logo">MADAD_HAOREF</div>
        <div className="ver">ST_ANALYSIS_V75</div>
      </header>

      {/* ГЛАВНЫЙ ИНДЕКС БЕЗОПАСНОСТИ */}
      <section className="safety-index">
        <div className="label">STRATEGIC_SAFETY_INDEX</div>
        <div className="index-value" style={{color: data.index_score > 70 ? '#f00' : '#0f0'}}>
          {data.index_score}
        </div>
        <div className="index-bar">
          <div className="fill" style={{width: `${data.index_score}%`, background: '#f00'}}></div>
        </div>
        <div className="index-status">STATUS: {data.status}</div>
      </section>

      {/* СТЕК АНАЛИТИКИ */}
      <main className="report-stack">
        <div className="panel-label">VERIFIED_EXPERT_INSIGHTS</div>
        {data.reports.map((report, i) => (
          <div key={i} className="report-card">
            <div className="card-top">
              <span className="agency-tag">{report.agency}</span>
              <span className={`level-dot ${report.level}`}></span>
            </div>
            <h2 className="title">{report.title}</h2>
            <p className="summary">{report.summary}</p>
            <div className="card-footer">
              <a href={report.link} target="_blank" rel="noreferrer">ПОЛНЫЙ ОТЧЕТ_ID: {i+102}</a>
            </div>
          </div>
        ))}
      </main>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 10px; }
        .mobile-interface { max-width: 450px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
        
        .main-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222; padding-bottom: 10px; }
        .logo { font-weight: 900; letter-spacing: 2px; font-size: 1.2rem; }
        .ver { font-size: 0.6rem; color: #444; }

        .safety-index { background: #080808; border: 1px solid #1a1a1a; padding: 20px; text-align: center; }
        .label { font-size: 0.7rem; color: #555; margin-bottom: 10px; letter-spacing: 1px; }
        .index-value { font-size: 3.5rem; font-weight: bold; line-height: 1; margin-bottom: 10px; }
        .index-bar { width: 100%; height: 3px; background: #111; margin-bottom: 10px; }
        .fill { height: 100%; transition: 1s ease; }
        .index-status { font-size: 0.7rem; font-weight: bold; letter-spacing: 2px; }

        .panel-label { font-size: 0.65rem; color: #333; margin-bottom: 15px; border-left: 2px solid #f00; padding-left: 8px; }
        .report-stack { display: flex; flex-direction: column; gap: 12px; }
        .report-card { background: #050505; border: 1px solid #111; padding: 15px; }
        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .agency-tag { font-size: 0.6rem; color: #0f0; border: 1px solid #040; padding: 1px 5px; }
        .level-dot { width: 8px; height: 8px; border-radius: 50%; }
        .CRITICAL { background: #f00; box-shadow: 0 0 8px #f00; }
        .ELEVATED { background: #ff0; }
        
        .title { font-size: 1rem; margin: 0 0 10px 0; color: #eee; }
        .summary { font-size: 0.8rem; color: #666; line-height: 1.4; margin-bottom: 15px; text-align: justify; }
        .card-footer a { color: #f00; font-size: 0.65rem; text-decoration: none; font-weight: bold; border-bottom: 1px solid #300; }

        .sys-boot { height: 100vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 0.8rem; letter-spacing: 3px; }
      `}</style>
    </div>
  );
}
