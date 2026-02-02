import { useState, useEffect } from 'react';

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
        .gauge-visual { 
          width: 160px; 
          height: 85px; /* Увеличено, чтобы не срезало верх */
          margin: 0 auto; 
          position: relative; 
          overflow: hidden; 
        }
        .gauge-arc-bg {
          width: 140px; 
          height: 140px; 
          border-radius: 50%;
          border: 12px solid transparent;
          /* Полноценный градиент */
          background: conic-gradient(from 270deg, #00FF00 0%, #FFFF00 25%, #FF0000 50%, transparent 50%);
          -webkit-mask: radial-gradient(farthest-side, transparent 53px, #fff 54px);
          mask: radial-gradient(farthest-side, transparent 53px, #fff 54px);
          position: absolute; 
          top: 5px; /* Отступ сверху, чтобы не резало край */
          left: 10px;
        }
        .gauge-needle { 
          position: absolute; 
          bottom: 5px; 
          left: calc(50% - 1.5px); 
          width: 3px; 
          height: 65px; 
          background: #fff; 
          transform-origin: bottom center; 
          transition: transform 1.5s ease; 
          z-index: 5; 
        }
        .gauge-status { position: absolute; bottom: 5px; left: 0; right: 0; font-size: 0.85rem; font-weight: 900; text-shadow: 1px 1px 2px #000; }
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

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>RESTORING_V38_PLATINUM...</div>;

  return (
    <div className="dashboard">
      <header className="header">
        <h1 className="title">MADAD OREF <span className="v">V38 // PLATINUM</span></h1>
        <div className="sync white">LAST_SYNC: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      {/* TOP SECTION: Gauges and Tracker */}
      <div className="main-layout">
        <section className="gauges-area">
          <Gauge value={data.israel.val} range={data.israel.range} status={data.israel.status} label="ISRAEL INTERNAL" color="#00FF00" />
          <Gauge value={data.us_iran.val} range={data.us_iran.range} status={data.us_iran.status} label="U.S. STRIKE vs IRAN" color="#FF0000" />
        </section>

        <section className="card rationale-box">
          <div className="section-title green">U.S. vs IRAN: HARD SIGNAL TRACKER</div>
          <div className="trigger-list">
            <div className={data.us_iran.triggers.carrier_groups ? 'active' : 'dim'}>[{data.us_iran.triggers.carrier_groups ? 'X' : ' '}] US Carrier Groups position</div>
            <div className={data.us_iran.triggers.ultimatums ? 'active' : 'dim'}>[{data.us_iran.triggers.ultimatums ? 'X' : ' '}] Official Pentagon/State Dept warning</div>
            <div className={data.us_iran.triggers.evacuations ? 'active' : 'dim'}>[{data.us_iran.triggers.evacuations ? 'X' : ' '}] Diplomatic/Personnel evacuations</div>
            <div className={data.us_iran.triggers.airspace ? 'active' : 'dim'}>[{data.us_iran.triggers.airspace ? 'X' : ' '}] Regional Airspace Closure (NOTAM)</div>
          </div>
        </section>
      </div>

      {/* MID SECTION: Timeline and Markets */}
      <div className="secondary-grid">
        <section className="card">
          <div className="section-title white">TIMELINE PROJECTION</div>
          <div className="timeline white">
            <div>NOW: <b>{data.israel.val}%</b></div>
            <div>+24H: <b>~{Math.round(data.israel.val * 1.1)}% ↑</b></div>
            <div>+72H: <b>~{Math.round(data.israel.val * 0.8)}% ↓</b></div>
          </div>
        </section>
        <section className="card">
          <div className="section-title white">MARKET INDICATORS</div>
          <div className="m-row white">Brent Crude: <b>$66.42</b> <span style={{color:'#f00'}}>↓</span></div>
          <div className="m-row white">USD/ILS: <b>3.14</b> <span className="white">→</span></div>
          <div className="m-row white">Polymarket: <b>18%</b> <span className="green">↑</span></div>
        </section>
      </div>

      {/* EXPERT SECTION */}
      <section className="card">
        <div className="section-title green">VERIFIED EXPERT ANALYTICS</div>
        {data.experts.map((e, i) => (
          <div key={i} className="expert-item">
            <span className={`tag ${e.type}`}>{e.type}</span>
            <b className="white">[{e.org}]</b> <span className="white">{e.text}</span>
          </div>
        ))}
      </section>

      {/* LOG SECTION */}
      <section className="card log-card">
        <div className="section-title white">RAW_SIGNAL_FEED (LATEST_DATA)</div>
        {data.logs.map((l, i) => (
          <div key={i} className="log-entry white">[{i+1}] {l}</div>
        ))}
      </section>

      <footer className="footer white">
        <strong>OFFICIAL ANALYTICAL DISCLAIMER:</strong> This is a mathematical OSINT model. Not official military advice. Follow <strong>Pikud HaOref</strong> for life-safety.
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; }
        .dashboard { max-width: 900px; margin: 0 auto; border: 1px solid #333; padding: 15px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #FF0000; margin-bottom: 20px; padding-bottom: 10px; }
        .title { margin: 0; font-size: 1.2rem; font-weight: 900; }
        .v { color: #f00; font-size: 0.7rem; vertical-align: top; }
        .white { color: #FFFFFF !important; }
        .green { color: #00FF00 !important; }
        
        .main-layout { display: flex; flex-direction: column; gap: 15px; margin-bottom: 15px; }
        .gauges-area { display: flex; gap: 10px; background: #080808; border: 1px solid #222; padding: 15px; }
        
        .card { border: 1px solid #333; background: #050505; padding: 12px; margin-bottom: 12px; }
        .section-title { font-size: 0.65rem; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #222; padding-bottom: 5px; }
        .trigger-list { font-size: 0.75rem; line-height: 1.8; }
        .dim { color: #fff; opacity: 0.3; }
        .active { color: #00FF00; font-weight: bold; }

        .secondary-grid { display: flex; flex-direction: column; gap: 15px; }
        .timeline { display: flex; justify-content: space-between; font-size: 0.8rem; }
        .m-row { font-size: 0.8rem; margin-bottom: 6px; }
        
        .expert-item { font-size: 0.75rem; margin-bottom: 10px; border-left: 3px solid #00FF00; padding-left: 10px; }
        .tag { font-size: 0.55rem; padding: 2px 5px; margin-right: 8px; border-radius: 2px; font-weight: bold; }
        .FACT { background: #004400; color: #00FF00; }
        .ANALYSIS { background: #443300; color: #FFA500; }
        
        .log-entry { font-size: 0.65rem; padding: 5px 0; border-bottom: 1px solid #111; }
        .footer { font-size: 0.6rem; border-top: 1px solid #333; margin-top: 20px; padding: 15px 0; line-height: 1.5; }

        @media (min-width: 768px) {
          .main-layout { display: grid; grid-template-columns: 1fr 1.3fr; }
          .secondary-grid { display: grid; grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
