import { useState, useEffect } from 'react';

// Компонент Gauge вынесен за пределы основного Home для стабильности билда
const Gauge = ({ value, range, label, status, color }) => {
  const rotation = (value / 100) * 180 - 90;

  return (
    <div className="gauge-box">
      <div className="gauge-visual">
        <div className="gauge-arc-bg"></div>
        <div className="gauge-needle" style={{ transform: `rotate(${rotation}deg)` }}></div>
        <div className="gauge-status" style={{ color: color }}>{status}</div>
      </div>
      <div className="gauge-range white">{range}</div>
      <div className="gauge-label white">{label}</div>
      <style jsx>{`
        .gauge-box { text-align: center; flex: 1; display: flex; flex-direction: column; align-items: center; }
        .gauge-visual { width: 140px; height: 70px; margin: 0 auto; position: relative; overflow: hidden; }
        .gauge-arc-bg {
          width: 140px; height: 140px; border-radius: 50%;
          border: 12px solid transparent;
          background: conic-gradient(from 270deg, #00FF00 0%, #FFFF00 25%, #FF0000 50%, transparent 50%);
          -webkit-mask: radial-gradient(farthest-side, transparent 52px, #fff 53px);
          mask: radial-gradient(farthest-side, transparent 52px, #fff 53px);
          position: absolute; top: 0; left: 0;
        }
        .gauge-needle { 
          position: absolute; bottom: 0; left: calc(50% - 1.5px); 
          width: 3px; height: 55px; background: #fff; 
          transform-origin: bottom center; transition: transform 1.5s ease; z-index: 5; 
        }
        .gauge-status { position: absolute; bottom: 0; left: 0; right: 0; font-size: 0.8rem; font-weight: 900; text-shadow: 1px 1px 1px #000; }
        .gauge-range { font-size: 1.1rem; font-weight: bold; margin-top: 10px; color: #fff; }
        .gauge-label { font-size: 0.6rem; text-transform: uppercase; margin-top: 5px; color: #fff; }
        .white { color: #fff !important; }
      `}</style>
    </div>
  );
};

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(d => setData(d)).catch(() => {});
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>V38_STABILIZING...</div>;

  return (
    <div className="dashboard">
      <header className="header">
        <h1 className="title">MADAD OREF <span className="v">V38_PL</span></h1>
        <div className="sync white">SYNC: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <div className="main-layout">
        <section className="gauges-area">
          <Gauge value={data.israel.val} range={data.israel.range} status={data.israel.status} label="ISRAEL INTERNAL" color="#0f0" />
          <Gauge value={data.us_iran.val} range={data.us_iran.range} status={data.us_iran.status} label="U.S. vs IRAN" color="#f00" />
        </section>

        <section className="card">
          <div className="section-title green">HARD SIGNAL TRACKER</div>
          <div className="trigger-list">
            <div className={data.us_iran.triggers.carrier_groups ? 'active' : 'dim'}>[{data.us_iran.triggers.carrier_groups ? 'X' : ' '}] US Carrier Groups position</div>
            <div className={data.us_iran.triggers.ultimatums ? 'active' : 'dim'}>[{data.us_iran.triggers.ultimatums ? 'X' : ' '}] Final official ultimatums</div>
            <div className={data.us_iran.triggers.evacuations ? 'active' : 'dim'}>[{data.us_iran.triggers.evacuations ? 'X' : ' '}] Personnel evacuation</div>
            <div className={data.us_iran.triggers.airspace ? 'active' : 'dim'}>[{data.us_iran.triggers.airspace ? 'X' : ' '}] Airspace Closure (NOTAM)</div>
          </div>
        </section>
      </div>

      <div className="secondary-grid">
        <section className="card">
          <div className="section-title white">TIMELINE</div>
          <div className="timeline white">
            <div>NOW: <b>{data.israel.val}%</b></div>
            <div>+24H: <b>~{Math.round(data.israel.val * 1.1)}% ↑</b></div>
            <div>+72H: <b>~{Math.round(data.israel.val * 0.8)}% ↓</b></div>
          </div>
        </section>
        <section className="card">
          <div className="section-title white">MARKETS</div>
          <div className="m-row white">Brent: <b>$66.42</b> <span style={{color:'#f00'}}>↓</span></div>
          <div className="m-row white">USD/ILS: <b>3.14</b> <span>→</span></div>
          <div className="m-row white">Poly: <b>18%</b> <span style={{color:'#0f0'}}>↑</span></div>
        </section>
      </div>

      <section className="card">
        <div className="section-title green">EXPERT ANALYTICS</div>
        {data.experts.map((e, i) => (
          <div key={i} className="expert-item">
            <span className={`tag ${e.type}`}>{e.type}</span>
            <b className="white">[{e.org}]</b> <span className="white">{e.text}</span>
          </div>
        ))}
      </section>

      <footer className="footer white">
        <strong>DISCLAIMER:</strong> OSINT model. Not official advice. Follow <strong>Pikud HaOref</strong> for life-safety.
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; }
        .dashboard { max-width: 900px; margin: 0 auto; border: 1px solid #333; padding: 15px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; margin-bottom: 15px; padding-bottom: 8px; }
        .title { margin: 0; font-size: 1.1rem; color: #fff; }
        .v { color: #f00; font-size: 0.6rem; vertical-align: top; }
        .white { color: #fff !important; }
        .green { color: #0f0 !important; }
        .main-layout, .secondary-grid { display: flex; flex-direction: column; gap: 15px; margin-bottom: 15px; }
        .gauges-area { display: flex; gap: 10px; background: #080808; border: 1px solid #222; padding: 12px; }
        .card { border: 1px solid #333; background: #050505; padding: 12px; }
        .section-title { font-size: 0.65rem; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #222; }
        .trigger-list { font-size: 0.75rem; line-height: 1.8; }
        .dim { color: #fff; opacity: 0.3; }
        .active { color: #0f0; font-weight: bold; }
        .timeline { display: flex; justify-content: space-between; font-size: 0.8rem; }
        .m-row { font-size: 0.85rem; margin-bottom: 6px; }
        .expert-item { font-size: 0.75rem; margin-bottom: 10px; border-left: 3px solid #0f0; padding-left: 10px; }
        .tag { font-size: 0.55rem; padding: 2px 5px; margin-right: 8px; border-radius: 2px; font-weight: bold; }
        .FACT { background: #004400; color: #0f0; }
        .ANALYSIS { background: #443300; color: #f90; }
        .footer { font-size: 0.6rem; border-top: 1px solid #333; margin-top: 20px; padding: 15px 0; }
        @media (min-width: 768px) {
          .main-layout { display: grid; grid-template-columns: 1fr 1.3fr; }
          .secondary-grid { display: grid; grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
