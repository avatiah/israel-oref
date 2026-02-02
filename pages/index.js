import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d)).catch(() => {});
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace', fontWeight:'bold'}}>RESYNCING_V38_PLATINUM...</div>;

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

      {/* Основная сетка: на мобильных превращается в одну колонку без дырок */}
      <div className="main-layout">
        <section className="gauges-area">
          <Gauge value={data.israel.val} range={data.israel.range} status={data.israel.status} label="ISRAEL INTERNAL" color="#00FF00" />
          <Gauge value={data.us_iran.val} range={data.us_iran.range} status={data.us_iran.status} label="U.S. STRIKE vs IRAN" color="#FF0000" />
        </section>

        <section className="card rationale-box">
          <div className="section-title green">U.S. vs IRAN: HARD SIGNAL TRACKER</div>
          <div className="trigger-list">
            <div className={data.us_iran.triggers.carrier_groups ? 'active' : 'inactive'}>
               [{data.us_iran.triggers.carrier_groups ? 'X' : ' '}] US Carrier Groups position
            </div>
            <div className={data.us_iran.triggers.ultimatums ? 'active' : 'inactive'}>
               [{data.us_iran.triggers.ultimatums ? 'X' : ' '}] Final official ultimatums
            </div>
            <div className={data.us_iran.triggers.evacuations ? 'active' : 'inactive'}>
               [{data.us_iran.triggers.evacuations ? 'X' : ' '}] Diplomatic/Personnel evacuation
            </div>
            <div className={data.us_iran.triggers.airspace ? 'active' : 'inactive'}>
               [{data.us_iran.triggers.airspace ? 'X' : ' '}] Regional Airspace Closure
            </div>
          </div>
        </section>
      </div>

      <div className="secondary-grid">
        <section className="card">
          <div className="section-title white">TIMELINE PROJECTION</div>
          <div className="timeline white">
            <div className="t-item">NOW: <b>{data.israel.val}%</b></div>
            <div className="t-item">+24H: <b>~{Math.round(data.israel.val * 1.1)}% ↑</b></div>
            <div className="t-item">+72H: <b>~{Math.round(data.israel.val * 0.8)}% ↓</b></div>
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
        <strong>DISCLAIMER:</strong> OSINT mathematical model. Not official military advice. Follow <strong>Pikud HaOref</strong> for life-safety.
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; }
        .dashboard { max-width: 900px; margin: 0 auto; border: 1px solid #333; padding: 15px; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #FF0000; margin-bottom: 15px; padding-bottom: 8px; }
        .title { margin: 0; font-size: 1.1rem; font-weight: 900; color: #fff; }
        .v { color: #f00; font-size: 0.6rem; vertical-align: top; }
        .white { color: #FFFFFF !important; }
        .green { color: #00FF00 !important; }
        .red { color: #FF0000 !important; }

        /* ИСПРАВЛЕНИЕ ПУСТОГО МЕСТА: Flexbox для мобильных */
        .main-layout { display: flex; flex-direction: column; gap: 15px; margin-bottom: 15px; }
        
        .gauges-area { display: flex; gap: 10px; background: #080808; border: 1px solid #222; padding: 12px; justify-content: space-around; }
        .gauge-box { text-align: center; }
        .gauge-visual { width: 120px; height: 60px; margin: 0 auto; position: relative; overflow: hidden; }
        .gauge-arc { width: 120px; height: 120px; border-radius: 50%; border: 10px solid #111; transform: rotate(45deg); position: absolute; }
        .gauge-needle { position: absolute; bottom: 0; left: 50%; width: 2px; height: 45px; background: #fff; transform-origin: bottom center; transition: transform 1.5s ease-out; }
        .gauge-status { position: absolute; bottom: 0; left: 0; right: 0; font-size: 0.8rem; font-weight: 900; }
        .gauge-range { font-size: 1rem; font-weight: bold; margin-top: 8px; }
        .gauge-label { font-size: 0.55rem; text-transform: uppercase; margin-top: 3px; }

        .secondary-grid { display: flex; flex-direction: column; gap: 15px; }

        .card { border: 1px solid #333; background: #050505; padding: 12px; }
        .section-title { font-size: 0.65rem; font-weight: 900; margin-bottom: 10px; border-bottom: 1px solid #222; padding-bottom: 5px; }
        
        .trigger-list { font-size: 0.75rem; line-height: 1.8; }
        .inactive { color: #FFFFFF; opacity: 0.3; } /* Оставил белым, но приглушенным */
        .active { color: #00FF00; font-weight: bold; }

        .timeline { display: flex; justify-content: space-between; font-size: 0.8rem; }
        .m-row { font-size: 0.85rem; margin-bottom: 6px; }
        
        .expert-item { font-size: 0.75rem; margin-bottom: 10px; border-left: 3px solid #00FF00; padding-left: 10px; }
        .tag { font-size: 0.55rem; padding: 2px 5px; margin-right: 8px; border-radius: 2px; font-weight: bold; }
        .FACT { background: #004400; color: #00FF00; }
        .ANALYSIS { background: #443300; color: #FFA500; }
        
        .log-entry { font-size: 0.65rem; padding: 5px 0; border-bottom: 1px solid #111; line-height: 1.2; }
        .footer { font-size: 0.6rem; border-top: 1px solid #333; margin-top: 20px; padding: 15px 0; line-height: 1.4; }

        /* АДАПТИВ ДЛЯ ДЕСКТОПА: Возвращаем сетку, если экран широкий */
        @media (min-width: 768px) {
          .main-layout { display: grid; grid-template-columns: 1fr 1.3fr; }
          .secondary-grid { display: grid; grid-template-columns: 1fr 1fr; }
          .title { font-size: 1.3rem; }
        }
      `}</style>
    </div>
  );
}
