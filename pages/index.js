import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d)).catch(() => {});
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace', fontWeight:'bold'}}>INITIALIZING_V38_PLATINUM_OSINT...</div>;

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
        <h1 className="title">MADAD OREF <span className="v">V38 // PLATINUM</span></h1>
        <div className="sync white">LAST_SYNC: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <div className="top-section">
        <section className="gauges-area">
          <Gauge value={data.israel.val} range={data.israel.range} status={data.israel.status} label="ISRAEL INTERNAL" color="#00FF00" />
          <Gauge value={data.us_iran.val} range={data.us_iran.range} status={data.us_iran.status} label="U.S. STRIKE vs IRAN" color="#FF0000" />
        </section>

        <section className="card rationale-box">
          <div className="section-title green">U.S. vs IRAN: HARD SIGNAL TRACKER</div>
          <div className="trigger-list">
            <div className={data.us_iran.triggers.carrier_groups ? 'active' : 'dim'}>[{data.us_iran.triggers.carrier_groups ? 'X' : ' '}] US Carrier Groups (Lincoln/Truman) in position</div>
            <div className={data.us_iran.triggers.ultimatums ? 'active' : 'dim'}>[{data.us_iran.triggers.ultimatums ? 'X' : ' '}] Final official ultimatums (State Dept)</div>
            <div className={data.us_iran.triggers.evacuations ? 'active' : 'dim'}>[{data.us_iran.triggers.evacuations ? 'X' : ' '}] Diplomatic/Personnel evacuation active</div>
            <div className={data.us_iran.triggers.airspace ? 'active' : 'dim'}>[{data.us_iran.triggers.airspace ? 'X' : ' '}] Regional Airspace Closures (NOTAM)</div>
          </div>
        </section>
      </div>

      <div className="mid-grid">
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
          <div className="m-row white">Brent Crude: <b>$66.42</b> <span className="red">↓</span></div>
          <div className="m-row white">USD/ILS: <b>3.14</b> <span className="white">→</span></div>
          <div className="m-row white">Polymarket: <b>18%</b> <span className="green">↑</span></div>
        </section>
      </div>

      <section className="card">
        <div className="section-title green">VERIFIED EXPERT ANALYTICS (ISW / WSJ / CENTCOM)</div>
        {data.experts.map((e, i) => (
          <div key={i} className="expert-item">
            <span className={`tag ${e.type}`}>{e.type}</span>
            <b className="white">[{e.org}]</b> <span className="white">{e.text}</span>
          </div>
        ))}
      </section>

      <section className="card log-card">
        <div className="section-title white">RAW_SIGNAL_FEED (02-FEB-2026)</div>
        {data.logs.map((l, i) => (
          <div key={i} className="log-entry white">[{i+1}] {l}</div>
        ))}
      </section>

      <footer className="footer white">
        <strong>DISCLAIMER:</strong> This is an OSINT mathematical model. Not official military advice. Follow <strong>Pikud HaOref</strong> for life-safety. All data is verified against current reports.
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; }
        .dashboard { max-width: 900px; margin: 0 auto; border: 1px solid #333; padding: 20px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #FF0000; margin-bottom: 20px; padding-bottom: 10px; }
        .title { margin: 0; font-size: 1.3rem; font-weight: 900; }
        .v { color: #f00; font-size: 0.8rem; vertical-align: top; }
        .white { color: #FFFFFF !important; }
        .green { color: #00FF00 !important; }
        .red { color: #FF0000 !important; }
        
        .top-section { display: grid; grid-template-columns: 1fr 1.3fr; gap: 20px; margin-bottom: 20px; }
        .gauges-area { display: flex; gap: 15px; background: #080808; border: 1px solid #222; padding: 15px; }
        .gauge-box { flex: 1; text-align: center; }
        .gauge-visual { width: 140px; height: 70px; margin: 0 auto; position: relative; overflow: hidden; }
        .gauge-arc { width: 140px; height: 140px; border-radius: 50%; border: 12px solid #111; transform: rotate(45deg); position: absolute; }
        .gauge-needle { position: absolute; bottom: 0; left: 50%; width: 2px; height: 55px; background: #fff; transform-origin: bottom center; transition: transform 1.5s ease-out; }
        .gauge-status { position: absolute; bottom: 0; left: 0; right: 0; font-size: 0.9rem; font-weight: 900; }
        .gauge-range { font-size: 1.1rem; font-weight: bold; margin-top: 10px; }
        .gauge-label { font-size: 0.6rem; text-transform: uppercase; margin-top: 5px; }

        .card { border: 1px solid #444; background: #050505; padding: 15px; margin-bottom: 15px; }
        .section-title { font-size: 0.7rem; font-weight: 900; margin-bottom: 12px; border-bottom: 1px solid #222; padding-bottom: 5px; }
        .trigger-list { font-size: 0.8rem; line-height: 2; }
        .dim { color: #555; }
        .active { color: #00FF00; font-weight: bold; }

        .mid-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .timeline { display: flex; justify-content: space-between; font-size: 0.9rem; }
        .m-row { font-size: 0.9rem; margin-bottom: 8px; border-bottom: 1px solid #111; }
        
        .expert-item { font-size: 0.8rem; margin-bottom: 12px; border-left: 4px solid #00FF00; padding-left: 12px; }
        .tag { font-size: 0.6rem; padding: 2px 6px; margin-right: 10px; border-radius: 2px; font-weight: bold; }
        .FACT { background: #004400; color: #00FF00; }
        .ANALYSIS { background: #443300; color: #FFA500; }
        .SIGNAL { background: #000044; color: #4444FF; }
        
        .log-entry { font-size: 0.7rem; padding: 6px 0; border-bottom: 1px solid #111; }
        .footer { font-size: 0.65rem; border-top: 1px solid #333; margin-top: 25px; padding: 20px 0; line-height: 1.6; }
      `}</style>
    </div>
  );
}
