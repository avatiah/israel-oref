import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>STRATCOM V25: SYNCING...</div>;

  const color = data.index > 65 ? '#f00' : data.index > 35 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '15px', fontSize: '12px' }}>
      
      <header style={{ borderBottom: `2px solid ${color}`, paddingBottom: '10px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>MADAD OREF</h2>
          <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>02 FEB 2026 // STATUS: {data.index > 40 ? 'ELEVATED' : 'OPERATIONAL'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: color, fontSize: '1.2rem' }}>{data.index}%</div>
          <div style={{ fontSize: '0.6rem' }}>LIVE ANALYTICS</div>
        </div>
      </header>

      <div className="grid">
        <div className="card center">
          <div className="radar" style={{borderColor: color}}>
            <div className="sweep" style={{background: `conic-gradient(from 0deg, ${color}33 0deg, transparent 90deg)`}}></div>
            <div className="val" style={{color: color}}>{data.index}%</div>
          </div>
          <div style={{marginTop: '15px'}}>METHODOLOGY: BAYESIAN RISK ANALYTICS</div>
        </div>

        <div className="card">
          <div style={{color: '#f00', fontWeight: 'bold', marginBottom: '10px'}}>&gt; US STRIKE ON IRAN // {data.us_iran.val}%</div>
          <p style={{fontSize: '0.65rem', color: '#888', borderLeft: '2px solid #300', paddingLeft: '8px'}}>{data.us_iran.rationale}</p>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
            <span>POLYMARKET (JUNE 30):</span>
            <span style={{color: '#fff'}}>{data.markets.poly_june}</span>
          </div>
        </div>

        <div className="card full market-line">
          <div>BRENT OIL: <b style={{color:'#fff'}}>{data.markets.brent}</b></div>
          <div>USD/ILS: <b style={{color:'#fff'}}>{data.markets.ils}</b></div>
          <div>SENTIMENT: <b style={{color: color}}>{data.index > 40 ? 'RISK_OFF' : 'RISK_ON'}</b></div>
        </div>

        <div className="card full">
          <div style={{fontSize: '0.7rem', color: '#f90', marginBottom: '10px'}}>&gt; PROFESSIONAL OSINT BRIEF (ISW / IISS)</div>
          {data.osint_experts.map((e, i) => (
            <div key={i} style={{fontSize: '0.65rem', marginBottom: '6px'}}><span style={{color: '#fff'}}>[{e.org}]</span> {e.text}</div>
          ))}
        </div>

        <div className="card full">
          <div style={{fontSize: '0.7rem', color: color, marginBottom: '10px'}}>&gt; SIGNAL_LOG:</div>
          {data.logs.map((l, i) => (
            <div key={i} style={{fontSize: '0.65rem', padding: '4px 0', borderBottom: '1px solid #111', color: '#777'}}>[{i+1}] {l}</div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: '20px', borderTop: '1px solid #222', paddingTop: '10px', fontSize: '0.55rem', color: '#444' }}>
        <strong>DISCLAIMER:</strong> AGGREGATED OSINT DATA. NOT OFFICIAL GUIDANCE. SOURCES: ISW, IISS, POLYMARKET.
      </footer>

      <style jsx>{`
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .card { border: 1px solid #222; padding: 15px; background: #050505; }
        .full { grid-column: span 2; }
        .center { text-align: center; }
        .market-line { display: flex; justify-content: space-around; font-size: 0.7rem; }
        .radar { width: 100px; height: 100px; border: 2px solid #030; border-radius: 50%; margin: 0 auto; position: relative; overflow: hidden; }
        .sweep { position: absolute; width: 100%; height: 100%; animation: rot 4s linear infinite; }
        .val { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.6rem; font-weight: bold; }
        @keyframes rot { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } .full { grid-column: span 1; } .market-line { flex-direction: column; gap: 10px; } }
      `}</style>
    </div>
  );
}
