import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d)).catch(() => {});
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>V33_IGTI_BOOTING...</div>;

  const Gauge = ({ value, label, color }) => (
    <div className="gauge-container">
      <div className="gauge-visual">
        <div className="gauge-arc" style={{ borderTopColor: color, borderRightColor: color }}></div>
        <div className="gauge-needle" style={{ transform: `rotate(${(value / 100) * 180 - 90}deg)` }}></div>
        <div className="gauge-value" style={{ color: color }}>{value}%</div>
      </div>
      <div className="gauge-label">{label}</div>
      <style jsx>{`
        .gauge-container { flex: 1; text-align: center; }
        .gauge-visual { width: 150px; height: 75px; margin: 0 auto; position: relative; overflow: hidden; }
        .gauge-arc { width: 150px; height: 150px; border-radius: 50%; border: 10px solid #111; transform: rotate(45deg); position: absolute; }
        .gauge-needle { position: absolute; bottom: 0; left: 50%; width: 2px; height: 55px; background: #fff; transform-origin: bottom center; transition: transform 1.5s ease-out; }
        .gauge-value { position: absolute; bottom: 0; left: 0; right: 0; font-size: 1.6rem; font-weight: 900; }
        .gauge-label { font-size: 0.6rem; color: #fff; margin-top: 8px; font-weight: bold; text-transform: uppercase; }
        @media (max-width: 400px) { .gauge-visual { width: 130px; height: 65px; } .gauge-arc { width: 130px; height: 130px; } }
      `}</style>
    </div>
  );

  const Dir = ({ d }) => d === 'up' ? <span style={{color:'#0f0'}}>↑</span> : d === 'down' ? <span style={{color:'#f00'}}>↓</span> : <span style={{color:'#666'}}>→</span>;

  return (
    <div className="dashboard">
      <header className="header">
        <h1 className="title">MADAD OREF <span className="version">V33</span></h1>
        <div className="sync">LIVE_FEED: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      {/* DUAL GAUGES */}
      <section className="gauges-area">
        <Gauge value={data.igti} label="ISRAEL GEN THREAT" color={data.igti > 60 ? '#f00' : data.igti > 40 ? '#f90' : '#0f0'} />
        <Gauge value={data.us_strike} label="U.S. STRIKE PROB" color="#f00" />
      </section>

      {/* TIMELINE PROJECTION */}
      <section className="card card-dark">
        <div className="section-title white">TIMELINE PROJECTION (RISK HORIZON)</div>
        <div className="timeline">
          <div className="tm-item">NOW: <b className="white">{data.igti}%</b></div>
          <div className="tm-sep">|</div>
          <div className="tm-item">+24H: <b className="white">~{Math.round(data.igti * 1.05)}%</b></div>
          <div className="tm-sep">|</div>
          <div className="tm-item">+72H: <b className="white">~{Math.round(data.igti * 0.9)}%</b></div>
        </div>
      </section>

      {/* METHODOLOGY BLOCK */}
      <section className="card card-red">
        <div className="section-title text-red">📐 WHAT DRIVES THE INDEX (IGTI MODEL)</div>
        <div className="drive-grid">
          <div className="drive-item">
            <span className="drive-label">EVENTS (50%)</span>
            <span className="drive-val white">{data.breakdown.events}</span>
          </div>
          <div className="drive-item">
            <span className="drive-label">MEDIA (30%)</span>
            <span className="drive-val white">{data.breakdown.media}</span>
          </div>
          <div className="drive-item">
            <span className="drive-label">MARKETS (20%)</span>
            <span className="drive-val white">{data.breakdown.markets}</span>
          </div>
        </div>
      </section>

      {/* MARKETS WITH ARROWS */}
      <div className="grid-2">
        <section className="card">
          <div className="section-title white">MARKETS</div>
          <div className="market-row">Brent: <span className="white">${data.markets.brent.val}</span> <Dir d={data.markets.brent.dir}/></div>
          <div className="market-row">USD/ILS: <span className="white">{data.markets.ils.val}</span> <Dir d={data.markets.ils.dir}/></div>
          <div className="market-row">Poly: <span className="white">{data.markets.poly.val}</span> <Dir d={data.markets.poly.dir}/></div>
        </section>
        <section className="card">
          <div className="section-title white">STATUS</div>
          <div className="level-box" style={{color: data.igti > 60 ? '#f00' : '#f90'}}>{data.level}</div>
          <div className="trend white">Trend: Active</div>
        </section>
      </div>

      {/* EXPERTS - MAXIMUM Intel */}
      <section className="card">
        <div className="section-title text-orange">EXPERT_INTEL_COMMUNITY (ISW / IISS / SOUFAN)</div>
        {data.experts.map((e, i) => (
          <div key={i} className="expert-item">
            <b className="white">[{e.org}]</b> {e.text}
          </div>
        ))}
      </section>

      {/* RAW LOGS */}
      <section className="card log-card">
        <div className="section-title white">RAW_SIGNAL_LOG (LATEST SATELLITE/RSS)</div>
        {data.logs.map((l, i) => (
          <div key={i} className="log-entry">[{i+1}] {l}</div>
        ))}
      </section>

      {/* FULL COMPLETE DISCLAIMER */}
      <footer className="footer">
        <strong>IGTI METHODOLOGY:</strong> Composite OSINT Threat Index (0–100) based on weighted event signals (50%), narrative intensity (30%), and market stress (20%). <br/><br/>
        <strong>SOURCES:</strong> Institute for the Study of War (ISW), IISS Military Balance, Soufan Center, Reuters, Bloomberg, Polymarket, Bank of Israel. <br/><br/>
        <strong>DISCLAIMER:</strong> This dashboard is a mathematical OSINT model for situational awareness only. It is not official military advice, government guidance, or a substitute for official Home Front Command (Pikud HaOref) instructions.
      </footer>

      <style jsx global>{`
        body { background: #000; color: #ccc; font-family: monospace; margin: 0; }
        .dashboard { max-width: 480px; margin: 0 auto; padding: 15px; }
        .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #f00; padding-bottom: 5px; margin-bottom: 15px; }
        .title { margin: 0; color: #fff; font-size: 1.1rem; font-weight: 900; }
        .version { font-size: 0.6rem; color: #f00; vertical-align: top; }
        .sync { font-size: 0.6rem; color: #fff; }
        .gauges-area { display: flex; gap: 8px; background: #050505; border: 1px solid #111; padding: 15px 0; margin-bottom: 15px; }
        .card { border: 1px solid #222; background: #050505; padding: 10px; margin-bottom: 10px; }
        .card-dark { background: #080808; border-color: #333; }
        .card-red { border-color: #500; background: #0a0000; }
        .section-title { font-size: 0.6rem; font-weight: bold; margin-bottom: 8px; color: #888; }
        .white { color: #fff !important; }
        .text-red { color: #f00; }
        .text-orange { color: #f90; }
        .timeline { display: flex; justify-content: space-between; font-size: 0.65rem; }
        .tm-sep { color: #333; }
        .drive-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; }
        .drive-item { text-align: center; border: 1px solid #111; padding: 5px; }
        .drive-label { font-size: 0.45rem; color: #777; display: block; }
        .drive-val { font-size: 1rem; font-weight: bold; }
        .grid-2 { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 10px; }
        .market-row { font-size: 0.7rem; color: #999; margin-bottom: 4px; }
        .level-box { font-size: 1rem; font-weight: bold; margin-bottom: 2px; }
        .expert-item { font-size: 0.65rem; color: #aaa; margin-bottom: 8px; border-left: 2px solid #f90; padding-left: 8px; line-height: 1.3; }
        .log-entry { font-size: 0.6rem; color: #fff; padding: 3px 0; border-bottom: 1px solid #111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .footer { text-align: center; font-size: 0.55rem; color: #444; margin-top: 15px; padding-bottom: 20px; border-top: 1px solid #222; padding-top: 10px; line-height: 1.4; }
      `}</style>
    </div>
  );
}
