import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d)).catch(() => {});
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>V33_IGTI_COMMAND_BOOT...</div>;

  const Gauge = ({ value, label, color, size = "150px" }) => (
    <div className="gauge-container">
      <div className="gauge-visual" style={{ width: size, height: `calc(${size} / 2)` }}>
        <div className="gauge-arc" style={{ width: size, height: size, borderTopColor: color, borderRightColor: color }}></div>
        <div className="gauge-needle" style={{ transform: `rotate(${(value / 100) * 180 - 90}deg)` }}></div>
        <div className="gauge-value" style={{ color: color }}>{value}%</div>
      </div>
      <div className="gauge-label">{label}</div>
      <style jsx>{`
        .gauge-container { flex: 1; text-align: center; }
        .gauge-visual { margin: 0 auto; position: relative; overflow: hidden; }
        .gauge-arc { border-radius: 50%; border: 10px solid #1a1a1a; transform: rotate(45deg); position: absolute; }
        .gauge-needle { position: absolute; bottom: 0; left: 50%; width: 2px; height: 60px; background: #fff; transform-origin: bottom center; transition: transform 1.5s ease-out; }
        .gauge-value { position: absolute; bottom: 0; left: 0; right: 0; font-size: 1.8rem; font-weight: 900; }
        .gauge-label { font-size: 0.6rem; color: #fff; margin-top: 8px; font-weight: bold; letter-spacing: 1px; }
      `}</style>
    </div>
  );

  return (
    <div className="dashboard">
      <header className="header">
        <h1 className="title">MADAD OREF <span className="version">V33</span></h1>
        <div className="sync">LIVE // {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      {/* DUAL GAUGES */}
      <section className="gauges-area">
        <Gauge value={data.igti} label="ISRAEL GEN THREAT" color={data.igti > 60 ? '#f00' : '#f90'} />
        <Gauge value={data.us_strike} label="U.S. STRIKE PROB" color="#f00" />
      </section>

      {/* WHAT DRIVES THE INDEX */}
      <section className="card card-red">
        <div className="section-title text-red">📐 METHODOLOGY: WHAT DRIVES THE INDEX</div>
        <div className="drive-grid">
          <div className="drive-item">
            <span className="drive-label">EVENTS (50%)</span>
            <span className="drive-val">{data.breakdown.events}</span>
          </div>
          <div className="drive-item">
            <span className="drive-label">MEDIA (30%)</span>
            <span className="drive-val">{data.breakdown.media}</span>
          </div>
          <div className="drive-item">
            <span className="drive-label">MARKETS (20%)</span>
            <span className="drive-val">{data.breakdown.markets}</span>
          </div>
        </div>
      </section>

      {/* MARKETS */}
      <div className="grid-2">
        <section className="card">
          <div className="section-title">MARKETS</div>
          <div className="market-row">Brent: <span className="white">${data.markets.brent}</span></div>
          <div className="market-row">USD/ILS: <span className="white">{data.markets.ils}</span></div>
          <div className="market-row">Poly: <span className="white">{data.markets.poly}</span></div>
        </section>
        <section className="card">
          <div className="section-title">STATUS</div>
          <div className="level-box" style={{color: data.igti > 60 ? '#f00' : '#f90'}}>{data.level}</div>
          <div className="trend">Trend: Escalating</div>
        </section>
      </div>

      {/* EXPERTS */}
      <section className="card">
        <div className="section-title text-orange">EXPERT INTELLIGENCE</div>
        {data.experts.map((e, i) => (
          <div key={i} className="expert-item">
            <b className="white">[{e.org}]</b> {e.text}
          </div>
        ))}
      </section>

      {/* RAW LOGS */}
      <section className="card log-card">
        <div className="section-title white">RAW SIGNAL LOG (LATEST)</div>
        {data.logs.map((l, i) => (
          <div key={i} className="log-entry">[{i+1}] {l}</div>
        ))}
      </section>

      <footer className="footer">
        IGTI MODEL V1.0 // COMPOSITE OSINT ANALYTICS <br/>
        SOURCES: ISW, IISS, POLYMARKET, REUTERS
      </footer>

      <style jsx global>{`
        body { background: #000; color: #ccc; font-family: monospace; margin: 0; }
        .dashboard { max-width: 480px; margin: 0 auto; padding: 15px; }
        .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #f00; padding-bottom: 5px; margin-bottom: 20px; }
        .title { margin: 0; color: #fff; font-size: 1.2rem; font-weight: 900; }
        .version { font-size: 0.6rem; color: #f00; vertical-align: top; }
        .sync { font-size: 0.6rem; color: #fff; }
        
        .gauges-area { display: flex; gap: 10px; background: #050505; border: 1px solid #111; padding: 15px 5px; margin-bottom: 20px; }
        
        .card { border: 1px solid #222; background: #050505; padding: 12px; margin-bottom: 12px; }
        .card-red { border-color: #400; background: #0a0000; }
        .section-title { font-size: 0.65rem; font-weight: bold; margin-bottom: 10px; color: #888; }
        .text-red { color: #f00; }
        .text-orange { color: #f90; }
        .white { color: #fff !important; }
        
        .drive-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        .drive-item { text-align: center; border: 1px solid #222; padding: 5px; }
        .drive-label { font-size: 0.45rem; color: #aaa; display: block; }
        .drive-val { font-size: 1rem; color: #fff; font-weight: bold; }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .market-row { font-size: 0.7rem; color: #888; margin-bottom: 4px; }
        .level-box { font-size: 1.1rem; font-weight: bold; margin: 5px 0; }
        .trend { font-size: 0.55rem; color: #666; }

        .expert-item { font-size: 0.65rem; color: #bbb; margin-bottom: 8px; border-left: 2px solid #f90; padding-left: 8px; }
        .log-card { opacity: 0.9; }
        .log-entry { font-size: 0.6rem; color: #fff; padding: 4px 0; border-bottom: 1px solid #111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .footer { text-align: center; font-size: 0.55rem; color: #444; margin-top: 20px; padding-bottom: 20px; }
      `}</style>
    </div>
  );
}
