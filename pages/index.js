import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d)).catch(() => {});
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>BOOTING V32_STRATCOM...</div>;

  const Gauge = ({ value, label, color }) => (
    <div className="gauge-container">
      <div className="gauge-visual">
        <div className="gauge-arc" style={{ borderTopColor: color, borderRightColor: color }}></div>
        <div className="gauge-needle" style={{ transform: `rotate(${(value / 100) * 180 - 90}deg)` }}></div>
        <div className="gauge-value" style={{ color: color }}>{value}%</div>
      </div>
      <div className="gauge-label">{label}</div>
      <style jsx>{`
        .gauge-container { flex: 1; text-align: center; min-width: 140px; }
        .gauge-visual { 
          width: 160px; height: 80px; margin: 0 auto; position: relative; overflow: hidden; 
        }
        .gauge-arc { 
          width: 160px; height: 160px; border-radius: 50%; border: 10px solid #222; 
          transform: rotate(45deg); position: absolute; 
        }
        .gauge-needle { 
          position: absolute; bottom: 0; left: 50%; width: 2px; height: 65px; 
          background: #fff; transform-origin: bottom center; transition: transform 1s ease-out; 
        }
        .gauge-value { position: absolute; bottom: 0; left: 0; right: 0; font-size: 1.8rem; font-weight: 900; }
        .gauge-label { font-size: 0.65rem; color: #eee; mt: 8px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; }
        
        @media (max-width: 480px) {
          .gauge-visual { width: 130px; height: 65px; }
          .gauge-arc { width: 130px; height: 130px; border-width: 8px; }
          .gauge-needle { height: 50px; }
          .gauge-value { font-size: 1.4rem; }
          .gauge-label { font-size: 0.55rem; }
          .gauge-container { min-width: 120px; }
        }
      `}</style>
    </div>
  );

  return (
    <div className="dashboard-root">
      <header className="header">
        <div className="header-main">
          <h1 className="title">MADAD OREF</h1>
          <span className="badge">V32_STRATCOM</span>
        </div>
        <div className="sync-info">
          SYNC: {new Date(data.updated).toLocaleTimeString()}
        </div>
      </header>

      {/* GAUGES */}
      <section className="gauges-section">
        <Gauge value={data.index} label="GENERAL RISK" color={data.index > 70 ? '#f00' : '#f90'} />
        <Gauge value={data.us_iran.val} label="U.S. STRIKE" color="#f00" />
      </section>

      {/* TIMELINE */}
      <section className="card card-dark">
        <div className="section-title text-dim">PROJECTED EVOLUTION (24-72H)</div>
        <div className="timeline">
          <div className="tm-item">NOW: <b>{data.index}%</b></div>
          <div className="tm-sep">|</div>
          <div className="tm-item">+24H: <b>~{Math.round(data.index * 1.05)}%</b></div>
          <div className="tm-sep">|</div>
          <div className="tm-item">+72H: <b>~{Math.round(data.index * 0.9)}%</b></div>
        </div>
      </section>

      {/* RATIONALE */}
      <section className="card card-red">
        <div className="section-title text-red">ANALYSIS RATIONALE</div>
        {data.us_iran.breakdown.map((item, i) => (
          <div key={i} className="data-row">
            <span className="label text-silver">{item.label}</span>
            <span className="val-red">{item.val}</span>
          </div>
        ))}
      </section>

      {/* MARKETS */}
      <div className="market-grid">
        <div className="card card-small">
          <span className="label text-dim">BRENT</span>
          <span className="market-val">${data.markets.brent}</span>
        </div>
        <div className="card card-small">
          <span className="label text-dim">USD/ILS</span>
          <span className="market-val">{data.markets.ils}</span>
        </div>
      </div>

      {/* EXPERTS */}
      <section className="card">
        <div className="section-title text-orange">EXPERT INTELLIGENCE</div>
        {data.experts.map((e, i) => (
          <div key={i} className="expert-item">
            <span className="expert-org">{e.org}</span>
            <span className="expert-text">{e.text}</span>
          </div>
        ))}
      </section>

      {/* LOGS */}
      <section className="card log-container">
        <div className="section-title text-silver">RAW SIGNAL FEED (RSS/SATELLITE)</div>
        {data.logs.map((l, i) => (
          <div key={i} className="log-entry">
            <span className="log-index">[{i+1}]</span> {l}
          </div>
        ))}
      </section>

      <footer className="footer">
        SOURCES: ISW, IISS, SOUFAN CENTER, POLYMARKET. <br/>
        OSINT DATA // FOR AWARENESS ONLY.
      </footer>

      <style jsx global>{`
        body { margin: 0; background: #000; color: #ccc; font-family: monospace; }
        .dashboard-root { max-width: 500px; margin: 0 auto; padding: 15px; }
        .header { border-bottom: 2px solid #f00; padding-bottom: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
        .title { margin: 0; font-size: 1.3rem; color: #fff; font-weight: 900; }
        .badge { font-size: 0.6rem; background: #300; color: #f00; padding: 2px 5px; margin-left: 8px; }
        .sync-info { font-size: 0.6rem; color: #888; }
        
        .gauges-section { display: flex; gap: 10px; margin-bottom: 25px; padding: 15px 0; background: #050505; border: 1px solid #111; justify-content: center; }
        
        .card { border: 1px solid #222; padding: 12px; background: #050505; margin-bottom: 15px; }
        .card-dark { background: #080808; }
        .card-red { border-color: #500; background: #0a0000; }
        .card-small { padding: 8px 12px; }
        
        .section-title { font-size: 0.7rem; font-weight: bold; margin-bottom: 10px; letter-spacing: 1px; }
        .text-dim { color: #666; }
        .text-silver { color: #aaa; }
        .text-red { color: #f00; }
        .text-orange { color: #f90; }
        
        .timeline { display: flex; justify-content: space-between; font-size: 0.65rem; color: #fff; }
        .tm-sep { color: #333; }
        
        .data-row { display: flex; justify-content: space-between; font-size: 0.7rem; margin-bottom: 6px; border-bottom: 1px solid #150000; padding-bottom: 2px; }
        .label { font-size: 0.65rem; }
        .val-red { color: #f00; font-weight: bold; }
        
        .market-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
        .market-val { color: #fff; font-size: 1rem; display: block; margin-top: 4px; }
        
        .expert-item { font-size: 0.65rem; margin-bottom: 10px; border-left: 2px solid #f90; padding-left: 8px; line-height: 1.3; }
        .expert-org { color: #fff; font-weight: bold; display: block; margin-bottom: 2px; }
        .expert-text { color: #bbb; }
        
        .log-container { background: #050505; }
        .log-entry { font-size: 0.6rem; color: #888; padding: 4px 0; border-bottom: 1px solid #111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .log-index { color: #555; margin-right: 5px; }
        
        .footer { font-size: 0.55rem; color: #555; text-align: center; margin-top: 20px; line-height: 1.4; padding-bottom: 20px; }
      `}</style>
    </div>
  );
}
