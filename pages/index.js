import { useState, useEffect } from 'react';

const Gauge = ({ value = 0, range = "0%", label = "", status = "---", color = "#fff" }) => {
  const [rotation, setRotation] = useState(-90);
  
  useEffect(() => {
    // Плавная анимация стрелки после загрузки
    const targetRotation = (value / 100) * 180 - 90;
    setRotation(targetRotation);
  }, [value]);

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      try {
        const r = await fetch('/api/data');
        if (r.ok) {
          const d = await r.json();
          setData(d);
        }
      } catch (e) {
        console.error("Data fetch error");
      }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  // Предотвращает ошибку Hydration
  if (!mounted) return null;
  if (!data) return <div className="loading">SYNCING_THREAT_ENGINE_V50...</div>;

  const isAlarm = data.us_iran?.val > 70;

  return (
    <div className={`dashboard ${isAlarm ? 'alarm-active' : ''}`}>
      <header className="header">
        <h1 className="title">MADAD OREF <span className="v">V50 // STABLE</span></h1>
        <div className="sync white">ID: {data.updated?.split('T')[1].split('.')[0]}</div>
      </header>

      {isAlarm && <div className="alarm-banner">⚠️ CRITICAL THREAT LEVEL: WAR FOOTING ⚠️</div>}

      <div className="main-layout">
        <section className="gauges-area card">
          <Gauge 
            value={data.israel?.val} 
            range={data.israel?.range} 
            status={data.israel?.status} 
            label="ISRAEL INTERNAL" 
            color={data.israel?.color} 
          />
          <Gauge 
            value={data.us_iran?.val} 
            range={data.us_iran?.range} 
            status={data.us_iran?.status} 
            label="U.S. STRIKE vs IRAN" 
            color={data.us_iran?.color} 
          />
        </section>

        <section className="card">
          <div className="section-title green">HARD SIGNAL TRIGGER TRACKER</div>
          <div className="trigger-list">
            <div className={data.us_iran?.triggers?.carrier_groups ? 'active' : 'dim'}>[X] US Carrier Groups Position</div>
            <div className={data.us_iran?.triggers?.ultimatums ? 'active' : 'dim'}>[{data.us_iran?.triggers?.ultimatums ? 'X' : ' '}] Official Red-Line Ultimatums</div>
            <div className={data.us_iran?.triggers?.evacuations ? 'active' : 'dim'}>[{data.us_iran?.triggers?.evacuations ? 'X' : ' '}] Diplomatic/Staff Evacuations</div>
            <div className={data.us_iran?.triggers?.airspace ? 'active' : 'dim'}>[{data.us_iran?.triggers?.airspace ? 'X' : ' '}] Regional Airspace Closure</div>
          </div>
        </section>
      </div>

      <div className="secondary-grid">
        <section className="card">
          <div className="section-title white">SECURITY INDEX MATH</div>
          <div className="math-box white">
            <div>P_threat: <b>{data.us_iran?.val}%</b></div>
            <div>Confidence: <b>88.4%</b></div>
            <div className="green" style={{fontSize: '0.6rem', marginTop: '5px'}}>SOURCE: MULTI-VECTOR OSINT</div>
          </div>
        </section>
        <section className="card">
          <div className="section-title white">VOLATILITY MARKETS</div>
          <div className="m-row">Brent: <b className="white">${data.markets?.brent}</b></div>
          <div className="m-row">ILS: <b className="white">{data.markets?.ils}</b></div>
          <div className="m-row">Poly: <b className="green">{data.markets?.poly}%</b></div>
        </section>
      </div>

      <section className="card log-card">
        <div className="section-title white">LIVE_SIGNAL_ANALYSIS</div>
        <div className="feed-box">
          {data.feed?.map((l, i) => (
            <div key={i} className="log-entry white">
              <span className="green">[{new Date().toLocaleTimeString('he-IL')}]</span> {l}
            </div>
          ))}
        </div>
      </section>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; }
        .dashboard { max-width: 900px; margin: 0 auto; border: 1px solid #333; padding: 15px; transition: 0.5s; }
        .alarm-active { border-color: #ff0000; box-shadow: inset 0 0 30px rgba(255,0,0,0.4); }
        .alarm-banner { background: #ff0000; color: #fff; text-align: center; font-weight: 900; padding: 8px; margin-bottom: 10px; animation: blink 1s infinite; }
        @keyframes blink { 0%, 100% {opacity: 1} 50% {opacity: 0.4} }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; margin-bottom: 15px; }
        .card { border: 1px solid #333; background: #050505; padding: 10px; margin-bottom: 10px; }
        .main-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .gauges-area { display: flex; justify-content: space-around; }
        .gauge-visual { width: 150px; height: 85px; position: relative; }
        .gauge-svg { width: 100%; height: auto; }
        .gauge-needle { position: absolute; bottom: 8px; left: calc(50% - 1px); width: 2px; height: 55px; background: #fff; transform-origin: bottom; transition: 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .gauge-status { position: absolute; bottom: 5px; width: 100%; text-align: center; font-weight: 900; font-size: 0.8rem; }
        .white { color: #fff; } .green { color: #0f0; } .dim { opacity: 0.2; } .active { color: #0f0; font-weight: bold; }
        .feed-box { height: 140px; overflow-y: auto; font-size: 0.7rem; border-top: 1px solid #111; padding-top: 5px; }
        .loading { background:#000; color:#0f0; height:100vh; display:flex; align-items:center; justify-content:center; font-family:monospace; }
        @media (max-width: 650px) { .main-layout { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
