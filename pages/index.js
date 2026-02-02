import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d)).catch(() => {});
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace', fontWeight:'bold'}}>SYSTEM_BOOT_V37_PRECISION_INTEL...</div>;

  const Gauge = ({ value, range, label, status, color }) => (
    <div className="gauge-box">
      <div className="gauge-visual">
        <div className="gauge-arc" style={{ borderTopColor: color, borderRightColor: color }}></div>
        <div className="gauge-needle" style={{ transform: `rotate(${(value / 100) * 180 - 90}deg)` }}></div>
        <div className="gauge-status" style={{ color: color }}>{status}</div>
      </div>
      <div className="gauge-range white">{range}</div>
      <div className="gauge-label white">{label}</div>
    </div>
  );

  return (
    <div className="dashboard">
      <header className="header">
        <h1 className="title">MADAD OREF <span className="v">V37_PRECISION</span></h1>
        <div className="sync white">LIVE_OSINT: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <div className="top-section">
        <section className="gauges-area">
          <Gauge value={data.israel.val} range={data.israel.range} status={data.israel.status} label="ISRAEL INTERNAL" color={data.israel.val > 40 ? '#FF0000' : '#00FF00'} />
          <Gauge value={data.us_iran.val} range={data.us_iran.range} status={data.us_iran.status} label="U.S. STRIKE vs IRAN" color="#FF0000" />
        </section>

        <section className="card">
          <div className="section-title green">U.S. vs IRAN: HARD SIGNAL TRACKER</div>
          <div className="trigger-list">
            <div className={`trig ${data.us_iran.triggers.carrier_groups ? 'active' : 'inactive'}`}>[{data.us_iran.triggers.carrier_groups ? 'X' : ' '}] Carrier Strike Groups (CSG) movement</div>
            <div className={`trig ${data.us_iran.triggers.ultimatums ? 'active' : 'inactive'}`}>[{data.us_iran.triggers.ultimatums ? 'X' : ' '}] Official Pentagon/State Dept warning</div>
            <div className={`trig ${data.us_iran.triggers.evacuations ? 'active' : 'inactive'}`}>[{data.us_iran.triggers.evacuations ? 'X' : ' '}] Diplomatic/Personnel evacuations</div>
            <div className={`trig ${data.us_iran.triggers.airspace ? 'active' : 'inactive'}`}>[{data.us_iran.triggers.airspace ? 'X' : ' '}] Regional NOTAM / Airspace Closure</div>
          </div>
        </section>
      </div>

      <div className="mid-grid">
        <section className="card card-black">
          <div className="section-title white">TIMELINE PROJECTION</div>
          <div className="timeline white">
            <div>NOW: <b>{data.israel.val}%</b></div>
            <div>+24H: <b>~{Math.round(data.israel.val * 1.1)}% ↑</b></div>
            <div>+72H: <b>~{Math.round(data.israel.val * 0.8)}% ↓</b></div>
          </div>
        </section>
        <section className="card card-black">
          <div className="section-title white">MARKET SENTIMENT</div>
          <div className="m-row white">Brent: <b>$66.42</b> <span className="red">↓</span></div>
          <div className="m-row white">USD/ILS: <b>3.14</b> <span className="white">→</span></div>
          <div className="m-row white">Poly: <b>61%</b> <span className="green">↑</span></div>
        </section>
      </div>

      <section className="card">
        <div className="section-title green">VERIFIED EXPERT ANALYTICS</div>
        {data.experts.map((e, i) => (
          <div key={i} className="expert-item">
            <span className={`tag ${e.type}`}>{e.type}</span>
            <b className="white">[{e.org}]</b> <span className="white">{e.text}</span>
          </div>
        ))}
      </section>

      <section className="card">
        <div className="section-title white">RAW_SIGNAL_FEED (LATEST_DATA)</div>
        {data.logs.map((l, i) => (
          <div key={i} className="log-entry white">[{i+1}] {l}</div>
        ))}
      </section>

      <footer className="footer">
        <strong>OFFICIAL ANALYTICAL DISCLAIMER:</strong> This dashboard is a mathematical OSINT (Open Source Intelligence) model. It is <strong>NOT</strong> an official military forecast. For emergency instructions, follow the <strong>Home Front Command (Pikud HaOref)</strong> only. Data weights prioritize hardware movement over media rhetoric.
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; }
        .dashboard { max-width: 800px; margin: 0 auto; border: 1px solid #333; padding: 15px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #FF0000; padding-bottom: 5px; margin-bottom: 15px; }
        .title { margin: 0; font-size: 1.2rem; font-weight: 900; color: #fff; }
        .v { color: #f00; font-size: 0.7rem; vertical-align: top; }
        .white { color: #FFFFFF !important; }
        .green { color: #00FF00 !important; }
        .red { color: #FF0000 !important; }
        
        .top-section { display: grid; grid-template-columns: 1fr 1.2fr; gap: 15px; margin-bottom: 15px; }
        .gauges-area { display: flex; gap: 10px; background: #080808; border: 1px solid #222; padding: 10px; }
        .gauge-box { flex: 1; text-align: center; }
        .gauge-visual { width: 120px; height: 60px; margin: 0 auto; position: relative; overflow: hidden; }
        .gauge-arc { width: 120px; height: 120px; border-radius: 50%; border: 10px solid #111; transform: rotate(45deg); position: absolute; }
        .gauge-needle { position: absolute; bottom: 0; left: 50%; width: 2px; height: 45px; background: #fff; transform-origin: bottom center; transition: transform 1.5s ease-out; }
        .gauge-status { position: absolute; bottom: 0; left: 0; right: 0; font-size: 0.85rem; font-weight: 900; }
        .gauge-range { font-size: 1rem; font-weight: bold; margin-top: 10px; }
        .gauge-label { font-size: 0.55rem; text-transform: uppercase; margin-top: 5px; }

        .card { border: 1px solid #333; background: #050505; padding: 12px; margin-bottom: 12px; }
        .section-title { font-size: 0.65rem; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
        .trigger-list { font-size: 0.75rem; line-height: 1.8; }
        .trig.inactive { color: #444; }
        .trig.active { color: #00FF00; font-weight: bold; }

        .mid-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .timeline { display: flex; justify-content: space-between; font-size: 0.8rem; }
        .m-row { font-size: 0.8rem; margin-bottom: 5px; }
        
        .expert-item { font-size: 0.75rem; margin-bottom: 10px; border-left: 3px solid #00FF00; padding-left: 10px; line-height: 1.4; }
        .tag { font-size: 0.55rem; padding: 2px 5px; margin-right: 8px; border-radius: 2px; font-weight: bold; }
        .FACT { background: #004400; color: #00FF00; }
        .ANALYSIS { background: #443300; color: #FFA500; }
        
        .log-entry { font-size: 0.65rem; padding: 5px 0; border-bottom: 1px solid #111; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .footer { font-size: 0.6rem; color: #888; border-top: 1px solid #333; margin-top: 20px; padding: 15px 0; line-height: 1.6; }
      `}</style>
    </div>
  );
}
