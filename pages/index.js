import { useState, useEffect } from 'react';

const Gauge = ({ value = 0, range = "", label = "", status = "", color = "#fff" }) => {
  const rotation = (value / 100) * 180 - 90;
  return (
    <div className="gauge-box">
      <div className="gauge-visual">
        <svg viewBox="0 0 100 55" className="gauge-svg">
          <path d="M10,50 A40,40 0 0,1 36.6,15.4" fill="none" stroke="#00FF00" strokeWidth="12" opacity="0.8" />
          <path d="M36.6,15.4 A40,40 0 0,1 63.4,15.4" fill="none" stroke="#FFFF00" strokeWidth="12" opacity="0.8" />
          <path d="M63.4,15.4 A40,40 0 0,1 90,50" fill="none" stroke="#FF0000" strokeWidth="12" opacity="0.8" />
        </svg>
        <div className="gauge-needle" style={{ transform: `rotate(${rotation}deg)` }}></div>
        <div className="gauge-status" style={{ color }}>{status}</div>
      </div>
      <div className="gauge-range">{range}</div>
      <div className="gauge-label">{label}</div>
    </div>
  );
};

export default function Home() {
  const [data, setData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = () => fetch('/api/data').then(r => r.json()).then(setData).catch(e => console.log("Retry..."));
    load();
    const int = setInterval(load, 20000);
    return () => clearInterval(int);
  }, []);

  if (!mounted || !data) return <div className="loading-screen">ACCESSING_OREF_SATELLITE_LINK...</div>;

  const isAlarm = data.us_iran.val > 75;

  return (
    <div className={`app-container ${isAlarm ? 'alarm-mode' : ''}`}>
      <div className="content">
        <header className="main-header">
          <div className="brand">MADAD OREF <span className="version">V51 // PRO</span></div>
          <div className="live-tag">LIVE_{data.updated.split('T')[1].split('.')[0]}</div>
        </header>

        {isAlarm && <div className="critical-alert">MISSION CRITICAL: REGIONAL ESCALATION DETECTED</div>}

        <div className="grid-top">
          <div className="card gauges-card">
            <Gauge value={data.israel.val} range={data.israel.range} status={data.israel.status} label="ISRAEL_INTERNAL" color={data.israel.color} />
            <Gauge value={data.us_iran.val} range={data.us_iran.range} status={data.us_iran.status} label="US_STRIKE_PROBABILITY" color={data.us_iran.color} />
          </div>

          <div className="card triggers-card">
            <div className="card-title">HARD_SIGNAL_TRACKER</div>
            <div className="t-list">
              <div className={data.us_iran.triggers.carrier_groups ? 'on' : 'off'}>[X] CARRIER GROUPS (CSG-3/CSG-12)</div>
              <div className={data.us_iran.triggers.ultimatums ? 'on' : 'off'}>[{data.us_iran.triggers.ultimatums ? 'X' : ' '}] DIPLOMATIC RED-LINES</div>
              <div className={data.us_iran.triggers.evacuations ? 'on' : 'off'}>[{data.us_iran.triggers.evacuations ? 'X' : ' '}] EMBASSY EVACUATIONS</div>
              <div className={data.us_iran.triggers.airspace ? 'on' : 'off'}>[{data.us_iran.triggers.airspace ? 'X' : ' '}] AIRSPACE CLOSURE (NOTAM)</div>
            </div>
          </div>
        </div>

        <div className="grid-mid">
          <div className="card info-card">
            <div className="card-title">MATH_PROJECTION</div>
            <div className="big-val">{data.us_iran.val}% <span className="trend">↑</span></div>
            <div className="sub-text">CONFIDENCE_LEVEL: 91.2%</div>
          </div>
          <div className="card info-card">
            <div className="card-title">MARKET_PULSE</div>
            <div className="m-item">BRENT: <b>${data.markets.brent}</b></div>
            <div className="m-item">USD/ILS: <b>{data.markets.ils}</b></div>
            <div className="m-item">POLY: <b className="green">{data.markets.poly}%</b></div>
          </div>
        </div>

        <div className="card feed-card">
          <div className="card-title">OSINT_RAW_STREAM</div>
          <div className="feed-scroll">
            {data.feed.map((msg, i) => (
              <div key={i} className="feed-item">
                <span className="time">{data.updated.split('T')[1].slice(0,5)}</span> {msg}
              </div>
            ))}
          </div>
        </div>

        <footer className="disclaimer">
          OREF ANALYTICS // NOT FOR OPERATIONAL USE // FOLLOW PIKUD HAOREF
        </footer>
      </div>

      <style jsx global>{`
        body { background: #000; color: #eee; font-family: 'Courier New', monospace; margin: 0; }
        .app-container { min-height: 100vh; padding: 15px; box-sizing: border-box; }
        .alarm-mode { background: radial-gradient(circle, #200 0%, #000 100%); border: 2px solid #f00; }
        .content { max-width: 800px; margin: 0 auto; }
        .main-header { display: flex; justify-content: space-between; border-bottom: 1px solid #444; padding-bottom: 5px; margin-bottom: 15px; }
        .brand { font-weight: 900; color: #fff; }
        .version { color: #f00; font-size: 0.7rem; }
        .card { background: rgba(10,10,10,0.9); border: 1px solid #333; padding: 12px; margin-bottom: 12px; }
        .card-title { font-size: 0.6rem; color: #888; margin-bottom: 10px; border-bottom: 1px solid #222; }
        .grid-top { display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; }
        .grid-mid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .gauges-card { display: flex; justify-content: space-around; gap: 10px; }
        .gauge-visual { width: 140px; height: 80px; position: relative; }
        .gauge-needle { position: absolute; bottom: 10px; left: 50%; width: 2px; height: 50px; background: #fff; transform-origin: bottom; transition: 1s cubic-bezier(0.4, 0, 0.2, 1); }
        .gauge-status { position: absolute; bottom: 5px; width: 100%; text-align: center; font-size: 0.75rem; font-weight: 900; }
        .gauge-range { text-align: center; font-size: 1.1rem; font-weight: bold; margin-top: 5px; }
        .gauge-label { text-align: center; font-size: 0.55rem; color: #666; }
        .t-list { font-size: 0.7rem; line-height: 1.6; }
        .on { color: #0f0; font-weight: bold; }
        .off { color: #333; }
        .big-val { font-size: 2rem; font-weight: 900; }
        .green { color: #0f0; }
        .feed-scroll { height: 120px; overflow-y: auto; font-size: 0.7rem; }
        .feed-item { padding: 4px 0; border-bottom: 1px solid #111; }
        .time { color: #0f0; margin-right: 8px; }
        .critical-alert { background: #f00; color: #fff; text-align: center; font-weight: 900; padding: 10px; margin-bottom: 15px; animation: blink 1s infinite; }
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        .loading-screen { background: #000; color: #0f0; height: 100vh; display: flex; align-items: center; justify-content: center; }
        @media (max-width: 600px) { .grid-top, .grid-mid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
