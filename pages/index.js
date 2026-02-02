import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d)).catch(() => {});
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>V36_BOOT_INTEL...</div>;

  const Gauge = ({ value, range, label, status, color }) => (
    <div className="gauge-box">
      <div className="gauge-visual">
        <div className="gauge-arc" style={{ borderTopColor: color, borderRightColor: color }}></div>
        <div className="gauge-needle" style={{ transform: `rotate(${(value / 100) * 180 - 90}deg)` }}></div>
        <div className="gauge-status" style={{ color: color }}>{status}</div>
      </div>
      <div className="gauge-range white">{range}</div>
      <div className="gauge-label">{label}</div>
      <style jsx>{`
        .gauge-box { flex: 1; text-align: center; background: #080808; padding: 15px 5px; border: 1px solid #111; }
        .gauge-visual { width: 130px; height: 65px; margin: 0 auto; position: relative; overflow: hidden; }
        .gauge-arc { width: 130px; height: 130px; border-radius: 50%; border: 8px solid #1a1a1a; transform: rotate(45deg); position: absolute; }
        .gauge-needle { position: absolute; bottom: 0; left: 50%; width: 2px; height: 50px; background: #fff; transform-origin: bottom center; transition: transform 1.5s ease-out; }
        .gauge-status { position: absolute; bottom: 0; left: 0; right: 0; font-size: 0.9rem; font-weight: 900; }
        .gauge-range { font-size: 0.85rem; font-weight: bold; margin-top: 8px; }
        .gauge-label { font-size: 0.5rem; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
      `}</style>
    </div>
  );

  return (
    <div className="dashboard">
      <header className="header">
        <h1 className="title">MADAD OREF <span className="v">V36</span></h1>
        <div className="time">SYNC: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      {/* ГЛАВНЫЕ ИНДЕКСЫ */}
      <section className="gauges-area">
        <Gauge value={data.israel.val} range={data.israel.range} status={data.israel.status} label="Israel Internal" color={data.israel.val > 40 ? '#f00' : '#0f0'} />
        <Gauge value={data.us_iran.val} range={data.us_iran.range} status={data.us_iran.status} label="U.S. Strike vs IRAN" color="#f00" />
      </section>

      {/* ПРОЗРАЧНОСТЬ ДАННЫХ (ТРИГГЕРЫ) */}
      <section className="card">
        <div className="section-title">U.S. vs IRAN: HARD SIGNAL TRACKER</div>
        <div className="trigger-grid">
          <div className={`trig ${data.us_iran.triggers.carrier_groups ? 'active' : ''}`}>[ ] Авианосные группы</div>
          <div className={`trig ${data.us_iran.triggers.ultimatums ? 'active' : ''}`}>[ ] Официальные ультиматумы</div>
          <div className={`trig ${data.us_iran.triggers.evacuations ? 'active' : ''}`}>[ ] Эвакуация дипмиссий</div>
          <div className={`trig ${data.us_iran.triggers.airspace ? 'active' : ''}`}>[ ] Закрытие возд. зон</div>
        </div>
      </section>

      {/* ВРЕМЕННЫЕ РАМКИ */}
      <section className="card card-dark">
        <div className="section-title white">TIMELINE PROJECTION (RISK HORIZON)</div>
        <div className="timeline">
          <div>NOW: <span className="white">{data.israel.val}%</span></div>
          <div>+24H: <span className="white">~{Math.round(data.israel.val * 1.1)}% ↑</span></div>
          <div>+72H: <span className="white">~{Math.round(data.israel.val * 0.8)}% ↓</span></div>
        </div>
      </section>

      {/* РЫНКИ */}
      <section className="card">
        <div className="section-title">MARKET SENTIMENT PROXIES</div>
        <div className="m-row">Brent Oil: <b className="white">$66.42</b> <span style={{color:'#f00'}}>↓</span></div>
        <div className="m-row">USD/ILS: <b className="white">3.14</b> <span style={{color:'#666'}}>→</span></div>
        <div className="m-row">Polymarket: <b className="white">61%</b> <span style={{color:'#0f0'}}>↑</span></div>
      </section>

      {/* ПРОФЕССИОНАЛЬНАЯ РАЗВЕДКА (OSINT) */}
      <section className="card">
        <div className="section-title text-orange">EXPERT_INTEL_COMMUNITY (FACTS vs NARRATIVE)</div>
        {data.experts.map((e, i) => (
          <div key={i} className="expert-item">
            <span className={`tag ${e.type}`}>{e.type}</span>
            <b className="white">[{e.org}]</b> {e.text}
          </div>
        ))}
      </section>

      {/* ЛОГИ */}
      <section className="card log-card">
        <div className="section-title white">RAW_SIGNAL_LOG (LATEST SATELLITE/RSS)</div>
        {data.logs.map((l, i) => (
          <div key={i} className="log-entry">[{i+1}] {l}</div>
        ))}
      </section>

      <footer className="footer">
        <strong>ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ:</strong> Данный дашборд является математической моделью OSINT и не является официальным руководством. Для получения инструкций по безопасности используйте только официальные каналы <strong>Службы тыла (Пикуд а-Ореф)</strong>. Данные не гарантируют 100% точности.
      </footer>

      <style jsx global>{`
        body { background: #000; color: #ccc; font-family: monospace; margin: 0; }
        .dashboard { max-width: 480px; margin: 0 auto; padding: 15px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; padding-bottom: 5px; margin-bottom: 15px; }
        .title { margin: 0; color: #fff; font-size: 1.1rem; }
        .v { color: #f00; font-size: 0.6rem; vertical-align: top; }
        .white { color: #fff !important; }
        .gauges-area { display: flex; gap: 10px; margin-bottom: 15px; }
        .card { border: 1px solid #222; background: #050505; padding: 10px; margin-bottom: 10px; }
        .section-title { font-size: 0.6rem; color: #555; margin-bottom: 8px; text-transform: uppercase; }
        .trigger-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.55rem; color: #444; }
        .trig.active { color: #0f0; font-weight: bold; }
        .timeline { display: flex; justify-content: space-between; font-size: 0.7rem; }
        .m-row { font-size: 0.75rem; margin-bottom: 4px; }
        .expert-item { font-size: 0.65rem; color: #aaa; margin-bottom: 8px; border-left: 2px solid #f90; padding-left: 8px; }
        .tag { font-size: 0.5rem; padding: 1px 3px; margin-right: 5px; border-radius: 2px; }
        .FACT { background: #030; color: #0f0; }
        .ANALYSIS { background: #320; color: #f90; }
        .log-entry { font-size: 0.6rem; color: #fff; padding: 3px 0; border-bottom: 1px solid #111; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .footer { font-size: 0.5rem; color: #444; border-top: 1px solid #222; margin-top: 15px; padding: 10px 0 30px; line-height: 1.4; }
      `}</style>
    </div>
  );
}
