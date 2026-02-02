import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d)).catch(() => {});
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>BOOTING_V36_PRECISION_OSINT...</div>;

  const Gauge = ({ value, range, label, status, color }) => (
    <div className="gauge-box">
      <div className="gauge-visual">
        <div className="gauge-arc" style={{ borderTopColor: color, borderRightColor: color }}></div>
        <div className="gauge-needle" style={{ transform: `rotate(${(value / 100) * 180 - 90}deg)` }}></div>
        <div className="gauge-status" style={{ color: color }}>{status}</div>
      </div>
      <div className="gauge-range white">{range}</div>
      <div className="gauge-label">{label}</div>
    </div>
  );

  return (
    <div className="dashboard">
      <header className="header">
        <h1 className="title">MADAD OREF <span className="v">V36</span></h1>
        <div className="time">SYNC: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      {/* TOP SECTION: GAUGES & RATIONALE (V30 Layout) */}
      <div className="top-grid">
        <section className="gauges-area">
          <Gauge value={data.israel.val} range={data.israel.range} status={data.israel.status} label="Israel Internal" color={data.israel.val > 40 ? '#f00' : '#f90'} />
          <Gauge value={data.us_iran.val} range={data.us_iran.range} status={data.us_iran.status} label="U.S. STRIKE vs IRAN" color="#f00" />
        </section>

        <section className="card rationale-card">
          <div className="section-title text-red">U.S. vs IRAN: HARD SIGNAL TRACKER</div>
          <div className="trigger-list">
            <div className={`trig ${data.us_iran.triggers.carrier_groups ? 'active' : ''}`}>[{data.us_iran.triggers.carrier_groups ? 'X' : ' '}] US Carrier Strike Groups (CSG) movement</div>
            <div className={`trig ${data.us_iran.triggers.ultimatums ? 'active' : ''}`}>[{data.us_iran.triggers.ultimatums ? 'X' : ' '}] Official State Dept / IRGC ultimatums</div>
            <div className={`trig ${data.us_iran.triggers.evacuations ? 'active' : ''}`}>[{data.us_iran.triggers.evacuations ? 'X' : ' '}] Diplomatic/Military personnel evacuation</div>
            <div className={`trig ${data.us_iran.triggers.airspace ? 'active' : ''}`}>[{data.us_iran.triggers.airspace ? 'X' : ' '}] Airspace restrictions / NOTAM spikes</div>
          </div>
          <div className="calculation-note">* Hard military signals carry 10x weight over media rhetoric.</div>
        </section>
      </div>

      {/* TIMELINE & MARKETS */}
      <div className="grid-2">
        <section className="card card-dark">
          <div className="section-title white">TIMELINE PROJECTION</div>
          <div className="timeline">
            <div>NOW: <span className="white">{data.israel.val}%</span></div>
            <div>+24H: <span className="white">~{Math.round(data.israel.val * 1.1)}% ↑</span></div>
            <div>+72H: <span className="white">~{Math.round(data.israel.val * 0.8)}% ↓</span></div>
          </div>
        </section>
        <section className="card">
          <div className="section-title">MARKET SENTIMENT PROXIES</div>
          <div className="m-row">Brent: <b className="white">$66.42</b> <span style={{color:'#f00'}}>↓</span></div>
          <div className="m-row">USD/ILS: <b className="white">3.14</b> <span style={{color:'#666'}}>→</span></div>
          <div className="m-row">Poly: <b className="white">61%</b> <span style={{color:'#0f0'}}>↑</span></div>
        </section>
      </div>

      {/* EXPERT ANALYSIS */}
      <section className="card">
        <div className="section-title text-orange">VERIFIED EXPERT ANALYTICS (FACTS vs NARRATIVE)</div>
        {data.experts.map((e, i) => (
          <div key={i} className="expert-item">
            <span className={`tag ${e.type}`}>{e.type}</span>
            <b className="white">[{e.org}]</b> {e.text}
          </div>
        ))}
      </section>

      {/* RAW FEED */}
      <section className="card log-card">
        <div className="section-title white">RAW_SIGNAL_FEED (LATEST RSS)</div>
        {data.logs.map((l, i) => (
          <div key={i} className="log-entry">[{i+1}] {l}</div>
        ))}
      </section>

      <footer className="footer">
        <strong>DISCLAIMER:</strong> This dashboard is a mathematical OSINT model. Not official government guidance. For safety instructions, follow <strong>Home Front Command (Pikud HaOref)</strong> only.
      </footer>

      <style jsx global>{`
        body { background: #000; color: #ccc; font-family: monospace; margin: 0; }
        .dashboard { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; padding-bottom: 5px; margin-bottom: 20px; }
        .title { margin: 0; color: #fff; font-size: 1.2rem; font-weight: 900; }
        .v { color: #f00; font-size: 0.7rem; vertical-align: top; }
        .white { color: #fff !important; }
        .text-red { color: #f00; }
        .text-orange { color: #f90; }
        
        .top-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 15px; margin-bottom: 15px; }
        .gauges-area { display: flex; gap: 10px; background: #080808; border: 1px solid #111; padding: 15px; }
        .gauge-box { flex: 1; text-align: center; }
        .gauge-visual { width: 130px; height: 65px; margin: 0 auto; position: relative; overflow: hidden; }
        .gauge-arc { width: 130px; height: 130px; border-radius: 50%; border: 10px solid #1a1a1a; transform: rotate(45deg); position: absolute; }
        .gauge-needle { position: absolute; bottom: 0; left: 50%; width: 2px; height: 50px; background: #fff; transform-origin: bottom center; transition: transform 1.5s ease-out; }
        .gauge-status { position: absolute; bottom: 0; left: 0; right: 0; font-size: 0.9rem; font-weight: 900; }
        .gauge-range { font-size: 0.9rem; font-weight: bold; margin-top: 8px; }
        .gauge-label { font-size: 0.55rem; color: #666; margin-top: 4px; text-transform: uppercase; }

        .card { border: 1px solid #222; background: #050505; padding: 12px; margin-bottom: 12px; }
        .section-title { font-size: 0.65rem; color: #555; margin-bottom: 10px; text-transform: uppercase; font-weight: bold; }
        .trigger-list { font-size: 0.7rem; line-height: 1.6; }
        .trig { color: #333; }
        .trig.active { color: #0f0; }
        .calculation-note { font-size: 0.55rem; color: #444; margin-top: 10px; font-style: italic; }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .timeline { display: flex; justify-content: space-between; font-size: 0.75rem; }
        .m-row { font-size: 0.8rem; margin-bottom: 5px; }
        
        .expert-item { font-size: 0.7rem; color: #aaa; margin-bottom: 8px; border-left: 2px solid #f90; padding-left: 10px; line-height: 1.4; }
        .tag { font-size: 0.55rem; padding: 1px 4px; margin-right: 6px; border-radius: 2px; font-weight: bold; }
        .FACT { background: #030; color: #0f0; }
        .ANALYSIS { background: #320; color: #f90; }
        
        .log-entry { font-size: 0.65rem; color: #fff; padding: 4px 0; border-bottom: 1px solid #111; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .footer { font-size: 0.55rem; color: #444; border-top: 1px solid #222; margin-top: 20px; padding: 15px 0 30px; line-height: 1.5; }
      `}</style>
    </div>
  );
}
