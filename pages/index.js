import { useState, useEffect } from 'react';

const Gauge = ({ value, range, label, status, color }) => {
  const rotation = (value / 100) * 180 - 90;
  return (
    <div className="gauge-box">
      <div className="gauge-visual">
        <svg viewBox="0 0 100 55" className="gauge-svg">
          <path d="M10,50 A40,40 0 0,1 36.6,15.4" fill="none" stroke="#00FF00" strokeWidth="12" />
          <path d="M36.6,15.4 A40,40 0 0,1 63.4,15.4" fill="none" stroke="#FFFF00" strokeWidth="12" />
          <path d="M63.4,15.4 A40,40 0 0,1 90,50" fill="none" stroke="#FF0000" strokeWidth="12" />
        </svg>
        <div className="gauge-needle" style={{ transform: `rotate(${rotation}deg)` }}></div>
        <div className="gauge-status" style={{ color: color }}>{status}</div>
      </div>
      <div className="gauge-range white">{range}</div>
      <div className="gauge-label white">{label}</div>
    </div>
  );
};

export default function Home() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(setData);
    load(); setInterval(load, 30000);
  }, []);

  if (!data) return <div className="loading">INITIALIZING_V49_PRO...</div>;

  const isAlarm = data.us_iran.val > 70;

  return (
    <div className={`dashboard ${isAlarm ? 'alarm-active' : ''}`}>
      <header className="header">
        <h1 className="title">MADAD OREF <span className="v">V49 // PLATINUM_PRO</span></h1>
        <div className="sync white">SYSTEM_TIME: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      {isAlarm && <div className="alarm-banner">⚠️ CRITICAL THREAT LEVEL DETECTED ⚠️</div>}

      <div className="main-layout">
        <section className="gauges-area card">
          <Gauge value={data.israel.val} range={data.israel.range} status={data.israel.status} label="ISRAEL INTERNAL" color={data.israel.color} />
          <Gauge value={data.us_iran.val} range={data.us_iran.range} status={data.us_iran.status} label="U.S. STRIKE vs IRAN" color={data.us_iran.color} />
        </section>

        <section className="card tracker-box">
          <div className="section-title green">HARD SIGNAL TRIGGER TRACKER</div>
          <div className="trigger-list">
            <div className={data.us_iran.triggers.carrier_groups ? 'active' : 'dim'}>[{data.us_iran.triggers.carrier_groups ? 'X' : ' '}] US Carrier Groups Position</div>
            <div className={data.us_iran.triggers.ultimatums ? 'active' : 'dim'}>[{data.us_iran.triggers.ultimatums ? 'X' : ' '}] Official Red-Line Ultimatums</div>
            <div className={data.us_iran.triggers.evacuations ? 'active' : 'dim'}>[{data.us_iran.triggers.evacuations ? 'X' : ' '}] Diplomatic/Staff Evacuations</div>
            <div className={data.us_iran.triggers.airspace ? 'active' : 'dim'}>[{data.us_iran.triggers.airspace ? 'X' : ' '}] Regional NOTAM / Airspace Closure</div>
          </div>
        </section>
      </div>

      <div className="secondary-grid">
        <section className="card">
          <div className="section-title white">MATHEMATICAL PROJECTION (P_threat)</div>
          <div className="timeline white">
            <div>NOW: <b>{data.us_iran.val}%</b></div>
            <div>+24H: <b>~{Math.min(data.us_iran.val + 8, 99)}%</b></div>
            <div>CONFIDENCE: <b>88.4%</b></div>
          </div>
        </section>
        <section className="card">
          <div className="section-title white">MARKET VOLATILITY INDEX</div>
          <div className="m-row">Brent Crude: <b className="white">${data.markets.brent}</b></div>
          <div className="m-row">USD/ILS: <b className="white">{data.markets.ils}</b></div>
          <div className="m-row">Polymarket: <b className="green">{data.markets.poly}%</b></div>
        </section>
      </div>

      <section className="card log-card">
        <div className="section-title white">LIVE_SIGNAL_ANALYSIS</div>
        <div className="feed-box">
          {data.feed.map((l, i) => (
            <div key={i} className="log-entry white">
              <span className="green">[{new Date().toLocaleTimeString()}]</span> {l}
            </div>
          ))}
        </div>
      </section>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; }
        .dashboard { max-width: 900px; margin: 0 auto; border: 1px solid #333; padding: 15px; transition: 0.5s; }
        .alarm-active { border-color: #ff0000; box-shadow: inset 0 0 20px #ff0000; }
        .alarm-banner { background: #ff0000; color: #fff; text-align: center; font-weight: 900; padding: 5px; margin-bottom: 10px; animation: blink 1s infinite; }
        @keyframes blink { 0% {opacity: 1} 50% {opacity: 0.3} 100% {opacity: 1} }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; margin-bottom: 15px; }
        .card { border: 1px solid #333; background: #050505; padding: 10px; margin-bottom: 10px; }
        .main-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .gauges-area { display: flex; justify-content: space-around; }
        .gauge-visual { width: 150px; height: 85px; position: relative; overflow: hidden; }
        .gauge-svg { width: 100%; height: auto; }
        .gauge-needle { position: absolute; bottom: 5px; left: 50%; width: 2px; height: 60px; background: #fff; transform-origin: bottom; transition: 1s; }
        .gauge-status { position: absolute; bottom: 5px; width: 100%; text-align: center; font-weight: 900; font-size: 0.8rem; }
        .white { color: #fff; } .green { color: #0f0; } .dim { opacity: 0.3; } .active { color: #0f0; font-weight: bold; }
        .feed-box { height: 120px; overflow-y: auto; font-size: 0.7rem; }
        @media (max-width: 600px) { .main-layout { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
