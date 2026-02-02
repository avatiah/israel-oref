import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d)).catch(() => {});
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>INITIALIZING_V35_SYSTEM...</div>;

  const Gauge = ({ value, range, label, status, color }) => (
    <div className="gauge-box">
      <div className="gauge-visual">
        <div className="gauge-arc" style={{ borderTopColor: color, borderRightColor: color }}></div>
        <div className="gauge-needle" style={{ transform: `rotate(${(value / 100) * 180 - 90}deg)` }}></div>
        <div className="gauge-status" style={{ color: color }}>{status}</div>
      </div>
      <div className="gauge-range">{range}</div>
      <div className="gauge-label">{label}</div>
      <style jsx>{`
        .gauge-box { flex: 1; text-align: center; background: #080808; padding: 15px 5px; border: 1px solid #111; }
        .gauge-visual { width: 120px; height: 60px; margin: 0 auto; position: relative; overflow: hidden; }
        .gauge-arc { width: 120px; height: 120px; border-radius: 50%; border: 8px solid #1a1a1a; transform: rotate(45deg); position: absolute; }
        .gauge-needle { position: absolute; bottom: 0; left: 50%; width: 2px; height: 45px; background: #fff; transform-origin: bottom center; transition: transform 1.5s ease-out; }
        .gauge-status { position: absolute; bottom: 0; left: 0; right: 0; font-size: 0.9rem; font-weight: 900; }
        .gauge-range { font-size: 0.8rem; color: #fff; font-weight: bold; margin-top: 8px; }
        .gauge-label { font-size: 0.5rem; color: #666; margin-top: 4px; text-transform: uppercase; }
      `}</style>
    </div>
  );

  return (
    <div className="dashboard">
      <header className="header">
        <h1 className="title">MADAD OREF <span className="v">V35</span></h1>
        <div className="time">SCAN: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <section className="gauges-area">
        <Gauge value={data.israel.val} range={data.israel.range} status={data.israel.status} label="Israel Internal" color={data.israel.val > 40 ? '#f00' : '#0f0'} />
        <Gauge value={data.us_strike.val} range={data.us_strike.range} status={data.us_strike.status} label="U.S. Strike Risk" color="#f00" />
      </section>

      <section className="card timeline-card">
        <div className="section-title">RISK HORIZON (ESTIMATED)</div>
        <div className="timeline">
          <div className="t-point">T-0h: <span className="white">{data.israel.val}%</span></div>
          <div className="t-point">T+24h: <span className="white">~{Math.round(data.israel.val * 1.1)}% ↑</span></div>
          <div className="t-point">T+72h: <span className="white">~{Math.round(data.israel.val * 0.8)}% ↓</span></div>
        </div>
      </section>

      <section className="card">
        <div className="section-title">MARKET SENTIMENT (PROXIES)</div>
        <div className="market-row">Brent Oil: <span className="white">$66.42</span> <span style={{color:'#f00'}}>↓</span></div>
        <div className="market-row">USD/ILS: <span className="white">3.14</span> <span style={{color:'#666'}}>→</span></div>
        <div className="market-row">Polymarket: <span className="white">61%</span> <span style={{color:'#0f0'}}>↑</span></div>
      </section>

      <section className="card log-card">
        <div className="section-title white">LIVE_SIGNAL_LOG</div>
        {data.logs.map((l, i) => (
          <div key={i} className="log-entry">[{i+1}] {l}</div>
        ))}
      </section>

      <footer className="footer">
        <div className="disclaimer-title">⚠️ OFFICIAL LEGAL & ANALYTICAL DISCLAIMER</div>
        <p><strong>1. NOT OFFICIAL ADVICE:</strong> This index (IGTI) is a mathematical OSINT model based on open-source data. It is NOT an official assessment by the IDF, US CENTCOM, or any government agency. For life-saving instructions, follow the <strong>Home Front Command (Pikud HaOref)</strong> exclusively.</p>
        <p><strong>2. METHODOLOGY:</strong> Risk ranges represent analytical uncertainty. Media noise is filtered; hard military positioning carries 10x more weight than news reports.</p>
        <p><strong>3. LIMITATION OF LIABILITY:</strong> The authors of this dashboard are not responsible for any decisions made based on this data. Prediction markets (Polymarket) and sentiment proxies are for contextual awareness only.</p>
      </footer>

      <style jsx global>{`
        body { background: #000; color: #ccc; font-family: monospace; margin: 0; }
        .dashboard { max-width: 480px; margin: 0 auto; padding: 15px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; padding-bottom: 5px; margin-bottom: 15px; }
        .title { margin: 0; color: #fff; font-size: 1.1rem; }
        .v { color: #f00; font-size: 0.6rem; vertical-align: top; }
        .time { font-size: 0.6rem; color: #fff; align-self: center; }
        .gauges-area { display: flex; gap: 10px; margin-bottom: 15px; }
        .card { border: 1px solid #222; background: #050505; padding: 10px; margin-bottom: 10px; }
        .section-title { font-size: 0.6rem; color: #555; margin-bottom: 8px; }
        .white { color: #fff; }
        .timeline { display: flex; justify-content: space-between; font-size: 0.7rem; }
        .market-row { font-size: 0.75rem; margin-bottom: 5px; border-bottom: 1px solid #111; padding-bottom: 2px; }
        .log-entry { font-size: 0.6rem; color: #fff; padding: 4px 0; border-bottom: 1px solid #111; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .footer { font-size: 0.5rem; color: #444; text-align: left; border-top: 1px solid #222; margin-top: 20px; padding-bottom: 30px; }
        .disclaimer-title { font-weight: bold; color: #666; margin-bottom: 10px; text-align: center; }
        p { margin: 5px 0; line-height: 1.4; }
      `}</style>
    </div>
  );
}
