import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d)).catch(() => {});
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>SYNCING ANALYTICAL MODEL...</div>;

  const MiniGraph = ({ vals }) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '20px', justifyContent: 'center', marginTop: '5px' }}>
      {vals.map((v, i) => (
        <div key={i} style={{ width: '15px', height: `${v}%`, background: i === vals.length - 1 ? '#f00' : '#333' }}></div>
      ))}
    </div>
  );

  const Gauge = ({ value, range, label, status, color }) => (
    <div className="gauge-box">
      <div className="gauge-visual">
        <div className="gauge-arc" style={{ borderTopColor: color, borderRightColor: color }}></div>
        <div className="gauge-needle" style={{ transform: `rotate(${(value / 100) * 180 - 90}deg)` }}></div>
        <div className="gauge-status" style={{ color: color }}>{status}</div>
      </div>
      <div className="gauge-range">{range}</div>
      <div className="gauge-label">{label}</div>
      <MiniGraph vals={data.history} />
      <style jsx>{`
        .gauge-box { flex: 1; text-align: center; background: #080808; padding: 15px 5px; border: 1px solid #111; }
        .gauge-visual { width: 120px; height: 60px; margin: 0 auto; position: relative; overflow: hidden; }
        .gauge-arc { width: 120px; height: 120px; border-radius: 50%; border: 8px solid #111; transform: rotate(45deg); position: absolute; }
        .gauge-needle { position: absolute; bottom: 0; left: 50%; width: 2px; height: 45px; background: #fff; transform-origin: bottom center; transition: transform 1.5s ease-out; }
        .gauge-status { position: absolute; bottom: 0; left: 0; right: 0; font-size: 1rem; font-weight: 900; }
        .gauge-range { font-size: 0.75rem; color: #fff; font-weight: bold; margin-top: 10px; }
        .gauge-label { font-size: 0.5rem; color: #666; letter-spacing: 1px; }
      `}</style>
    </div>
  );

  return (
    <div className="dashboard">
      <header className="header">
        <h1 className="title">MADAD OREF <span className="tag">STRAT-INTEL</span></h1>
        <div className="confidence">Confidence: <span style={{color: '#0f0'}}>{data.confidence}</span></div>
      </header>

      {/* GAUGES AREA */}
      <section className="gauges-area">
        <Gauge value={data.israel.val} range={data.israel.range} status={data.israel.status} label="ISRAEL INTERNAL THREAT" color={data.israel.val > 60 ? '#f00' : '#f90'} />
        <Gauge value={data.us_strike.val} range={data.us_strike.range} status={data.us_strike.status} label="U.S. STRIKE RISK" color="#f00" />
      </section>

      {/* MARKETS SENTIMENT */}
      <section className="card">
        <div className="section-title">MARKET SENTIMENT PROXIES (NOT DIRECT THREAT)</div>
        <div className="market-grid">
          <div className="m-item">Brent: <span className="white">${data.markets.brent.val}</span> {data.markets.brent.dir === 'up' ? '↑' : '↓'}</div>
          <div className="m-item">USD/ILS: <span className="white">{data.markets.ils.val}</span> →</div>
          <div className="m-item">Polymarket: <span className="white">{data.markets.poly.val}</span> ↑</div>
        </div>
      </section>

      {/* EXPERTS - FACTS VS NARRATIVE */}
      <section className="card">
        <div className="section-title">EXPERT_INTEL_ANALYSIS (FACTS vs NARRATIVE)</div>
        {data.experts.map((e, i) => (
          <div key={i} className="expert-line">
            <span className={`e-tag ${e.type}`}>{e.type}</span>
            <b className="white">[{e.org}]</b> {e.text}
          </div>
        ))}
      </section>

      {/* LOGS */}
      <section className="card log-card">
        <div className="section-title white">RAW_SIGNAL_LOG (LATEST SATELLITE/RSS)</div>
        {data.logs.map((l, i) => (
          <div key={i} className="log-entry">[{i+1}] {l}</div>
        ))}
      </section>

      <footer className="footer">
        <strong>METHODOLOGY:</strong> Weighted OSINT Model. Hard Military (x5), Official (x3), Media (x1). <br/>
        Confidence levels and ranges represent analytical uncertainty. Not a direct prediction.
      </footer>

      <style jsx global>{`
        body { background: #000; color: #ccc; font-family: monospace; margin: 0; }
        .dashboard { max-width: 480px; margin: 0 auto; padding: 15px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f00; padding-bottom: 5px; margin-bottom: 15px; }
        .title { margin: 0; color: #fff; font-size: 1.1rem; font-weight: 900; }
        .tag { font-size: 0.5rem; background: #300; color: #f00; padding: 2px 4px; vertical-align: middle; }
        .confidence { font-size: 0.6rem; color: #888; }
        
        .gauges-area { display: flex; gap: 10px; margin-bottom: 15px; }
        .card { border: 1px solid #222; background: #050505; padding: 10px; margin-bottom: 10px; }
        .section-title { font-size: 0.6rem; font-weight: bold; margin-bottom: 8px; color: #555; }
        .white { color: #fff !important; }
        
        .market-grid { display: flex; justify-content: space-between; font-size: 0.7rem; }
        .expert-line { font-size: 0.65rem; margin-bottom: 8px; line-height: 1.3; }
        .e-tag { font-size: 0.5rem; padding: 1px 4px; margin-right: 5px; border-radius: 2px; }
        .FACT { background: #003300; color: #0f0; }
        .ANALYSIS { background: #332200; color: #f90; }
        .NARRATIVE { background: #222; color: #888; }
        
        .log-entry { font-size: 0.6rem; color: #fff; padding: 3px 0; border-bottom: 1px solid #111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .footer { text-align: center; font-size: 0.5rem; color: #444; line-height: 1.4; border-top: 1px solid #222; padding-top: 10px; }
      `}</style>
    </div>
  );
}
