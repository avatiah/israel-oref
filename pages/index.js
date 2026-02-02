import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d)).catch(() => {});
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>V33_IGTI_MODEL_SYNCING...</div>;

  const Gauge = ({ value, label, color }) => (
    <div className="gauge-container">
      <div className="gauge-visual">
        <div className="gauge-arc" style={{ borderTopColor: color, borderRightColor: color }}></div>
        <div className="gauge-needle" style={{ transform: `rotate(${(value / 100) * 180 - 90}deg)` }}></div>
        <div className="gauge-value" style={{ color: color }}>{value}</div>
      </div>
      <div className="gauge-label">{label}</div>
      <style jsx>{`
        .gauge-container { flex: 1; text-align: center; }
        .gauge-visual { width: 160px; height: 80px; margin: 0 auto; position: relative; overflow: hidden; }
        .gauge-arc { width: 160px; height: 160px; border-radius: 50%; border: 12px solid #1a1a1a; transform: rotate(45deg); position: absolute; }
        .gauge-needle { position: absolute; bottom: 0; left: 50%; width: 2px; height: 65px; background: #fff; transform-origin: bottom center; transition: transform 1.5s cubic-bezier(0.17, 0.67, 0.83, 0.67); }
        .gauge-value { position: absolute; bottom: 0; left: 0; right: 0; font-size: 2.2rem; font-weight: 900; }
        .gauge-label { font-size: 0.65rem; color: #fff; margin-top: 10px; font-weight: bold; letter-spacing: 1px; }
        @media (max-width: 480px) {
          .gauge-visual { width: 140px; height: 70px; }
          .gauge-arc { width: 140px; height: 140px; }
          .gauge-value { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1 className="title">MADAD OREF</h1>
          <div className="subtitle">ISRAEL GENERAL THREAT INDEX (IGTI)</div>
        </div>
        <div className="sync">
          <span className="live-dot"></span> LIVE // {new Date(data.updated).toLocaleTimeString()}
        </div>
      </header>

      {/* MAIN GAUGE */}
      <section className="main-gauge-area">
        <Gauge value={data.igti} label={data.level} color={data.igti > 60 ? '#f00' : data.igti > 40 ? '#f90' : '#0f0'} />
        <div className="methodology-tag">Composite OSINT Threat Index (0–100)</div>
      </section>

      {/* WHAT DRIVES THE INDEX */}
      <section className="card card-dark">
        <div className="section-header">
          <span className="section-title">WHAT DRIVES THE INDEX</span>
          <span className="confidence">Confidence: {data.confidence}</span>
        </div>
        <div className="drive-grid">
          <div className="drive-item">
            <span className="drive-label">EVENT SIGNALS (50%)</span>
            <span className="drive-val">{data.breakdown.events}</span>
          </div>
          <div className="drive-item">
            <span className="drive-label">MEDIA SIGNALS (30%)</span>
            <span className="drive-val">{data.breakdown.media}</span>
          </div>
          <div className="drive-item">
            <span className="drive-label">MARKET SIGNALS (20%)</span>
            <span className="drive-val">{data.breakdown.markets}</span>
          </div>
        </div>
      </section>

      {/* MARKETS & DYNAMICS */}
      <div className="grid-2">
        <section className="card">
          <div className="section-title">MARKET EXPECTATIONS</div>
          <div className="market-row">Brent Oil: <span className="val-white">${data.markets.brent} ↓</span></div>
          <div className="market-row">USD/ILS: <span className="val-white">{data.markets.ils} →</span></div>
          <div className="market-row">Polymarket: <span className="val-white">{data.markets.poly} ↑</span></div>
        </section>
        
        <section className="card">
          <div className="section-title">INDEX DYNAMICS</div>
          <div className="dynamic-val">Δ24h: <span className="text-red">{data.delta}%</span></div>
          <div className="dynamic-desc">Trend: Upward Escalation</div>
        </section>
      </div>

      {/* EXPERT INTELLIGENCE */}
      <section className="card">
        <div className="section-title text-orange">&gt; EXPERT_INTEL_COMMUNITY</div>
        {data.experts.map((e, i) => (
          <div key={i} className="expert-block">
            <span className="expert-org">[{e.org}]</span> {e.text}
          </div>
        ))}
      </section>

      {/* RAW SIGNAL FEED */}
      <section className="card muted">
        <div className="section-title text-silver">RAW SIGNAL FEED (LATEST SATELLITE/RSS)</div>
        <div className="log-list">
          {data.logs.map((l, i) => (
            <div key={i} className="log-entry">[{i+1}] {l}</div>
          ))}
        </div>
      </section>

      <footer className="footer">
        📐 METHODOLOGY: IGTI V.1.0 // SOURCES: ISW, IISS, POLYMARKET, REUTERS <br/>
        NOT AN OFFICIAL MILITARY GUIDANCE.
      </footer>

      <style jsx global>{`
        body { background: #000; color: #ccc; font-family: 'Courier New', monospace; margin: 0; }
        .dashboard { max-width: 500px; margin: 0 auto; padding: 15px; }
        
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .title { font-size: 1.4rem; color: #fff; margin: 0; font-weight: 900; }
        .subtitle { font-size: 0.55rem; color: #f00; letter-spacing: 1px; }
        .sync { font-size: 0.6rem; color: #666; display: flex; align-items: center; }
        .live-dot { width: 6px; height: 6px; background: #f00; border-radius: 50%; margin-right: 6px; animation: blink 1s infinite; }
        
        .main-gauge-area { padding: 20px 0; background: #050505; border: 1px solid #111; margin-bottom: 20px; text-align: center; }
        .methodology-tag { font-size: 0.55rem; color: #444; margin-top: 15px; }

        .card { border: 1px solid #222; background: #050505; padding: 12px; margin-bottom: 15px; }
        .card-dark { background: #080808; border-color: #333; }
        .section-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .section-title { font-size: 0.65rem; font-weight: bold; color: #888; }
        .confidence { font-size: 0.6rem; color: #0f0; }
        
        .drive-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; }
        .drive-item { text-align: center; border: 1px solid #111; padding: 5px; }
        .drive-label { display: block; font-size: 0.45rem; color: #555; }
        .drive-val { font-size: 1rem; color: #fff; font-weight: bold; }

        .grid-2 { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 15px; }
        .market-row { font-size: 0.7rem; margin-top: 5px; color: #666; }
        .val-white { color: #fff; }
        .dynamic-val { font-size: 1.2rem; margin-top: 5px; }
        .dynamic-desc { font-size: 0.55rem; color: #444; }

        .expert-block { font-size: 0.65rem; margin-bottom: 8px; border-left: 2px solid #f90; padding-left: 8px; color: #bbb; }
        .expert-org { color: #fff; font-weight: bold; }
        
        .muted { opacity: 0.7; }
        .text-silver { color: #aaa; }
        .text-orange { color: #f90; }
        .log-list { margin-top: 8px; }
        .log-entry { font-size: 0.55rem; color: #666; padding: 3px 0; border-bottom: 1px solid #111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .footer { text-align: center; font-size: 0.5rem; color: #333; margin-top: 20px; padding-bottom: 30px; line-height: 1.5; }
        
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}
