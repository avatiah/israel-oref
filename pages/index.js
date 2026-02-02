import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>STRATCOM V26: BOOTING...</div>;

  const color = data.index > 70 ? '#f00' : data.index > 40 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '15px', fontSize: '11px' }}>
      
      <header style={{ borderBottom: `2px solid ${color}`, paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>MADAD OREF <span style={{fontSize: '0.6rem', opacity: 0.5}}>V26_ELITE</span></h2>
          <div style={{ fontSize: '0.6rem', color: color }}>● STATUS: {data.index > 60 ? 'CRITICAL ESCALATION' : 'MONITORED'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: color, fontSize: '1.2rem' }}>{data.index}%</div>
          <div style={{ fontSize: '0.6rem' }}>02 FEB 2026 // LIVE</div>
        </div>
      </header>

      <div className="grid">
        {/* RADAR */}
        <div className="card center">
          <div className="radar" style={{borderColor: color}}>
            <div className="sweep"></div>
            <div className="val" style={{color: color}}>{data.index}%</div>
          </div>
          <div style={{marginTop: '15px', fontSize: '0.7rem', opacity: 0.6}}>MODEL: BAYESIAN_INTEL_FUSION</div>
        </div>

        {/* US VS IRAN PROBABILITY */}
        <div className="card">
          <div style={{color: '#f00', fontWeight: 'bold', marginBottom: '10px'}}>&gt; US STRIKE PROBABILITY // {data.us_iran.val}%</div>
          <div style={{fontSize: '0.65rem', borderLeft: '2px solid #300', paddingLeft: '8px', color: '#999', marginBottom: '10px'}}>
            {data.us_iran.rationale}
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span style={{opacity: 0.5}}>POLYMARKET (JUNE 30):</span>
            <span style={{color: '#fff'}}>{data.markets.poly}</span>
          </div>
        </div>

        {/* MARKET INDICATORS */}
        <div className="card full market-grid">
          <div className="m-item">BRENT OIL: <b style={{color: '#fff'}}>{data.markets.brent}</b></div>
          <div className="m-item">USD/ILS: <b style={{color: '#fff'}}>{data.markets.ils}</b></div>
          <div className="m-item">SENTIMENT: <b style={{color: color}}>{data.index > 50 ? 'RISK_OFF' : 'NEUTRAL'}</b></div>
        </div>

        {/* EXPERT ANALYSIS */}
        <div className="card full">
          <div style={{color: '#f90', fontSize: '0.7rem', marginBottom: '10px'}}>&gt; INTERNATIONAL OSINT EXPERTS (ISW / CFR / IISS)</div>
          {data.experts.length > 0 ? data.experts.map((e, i) => (
            <div key={i} style={{marginBottom: '8px', fontSize: '0.65rem'}}>
              <span style={{color: '#fff'}}>[{e.org}]</span> {e.text}
            </div>
          )) : <div style={{opacity: 0.4}}>Searching expert databases for latest reports...</div>}
        </div>

        {/* RAW SIGNAL LOG */}
        <div className="card full">
          <div style={{color: color, fontSize: '0.7rem', marginBottom: '10px'}}>&gt; VERIFIED_SIGNALS_LOG:</div>
          {data.logs.map((l, i) => (
            <div key={i} style={{fontSize: '0.65rem', padding: '4px 0', borderBottom: '1px solid #111', color: '#777'}}>
              [{i+1}] {l}
            </div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: '20px', borderTop: '1px solid #222', paddingTop: '10px', fontSize: '0.55rem', color: '#444' }}>
        <strong>DISCLAIMER:</strong> AGGREGATED OSINT DATA. FOR SITUATIONAL AWARENESS ONLY. NOT OFFICIAL MILITARY GUIDANCE. <br/>
        <strong>SOURCES:</strong> ISW, IISS, Polymarket, Bloomberg (Brent), Bank of Israel (ILS).
      </footer>

      <style jsx>{`
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .card { border: 1px solid #222; padding: 15px; background: #050505; }
        .full { grid-column: span 2; }
        .center { text-align: center; }
        .market-grid { display: flex; justify-content: space-around; }
        .m-item { border-left: 1px solid #333; padding-left: 10px; }
        .radar { width: 100px; height: 100px; border: 2px solid #030; border-radius: 50%; margin: 0 auto; position: relative; overflow: hidden; }
        .sweep { position: absolute; width: 100%; height: 100%; background: conic-gradient(from 0deg, rgba(0,255,0,0.15) 0deg, transparent 90deg); animation: rot 4s linear infinite; }
        .val { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.8rem; font-weight: bold; }
        @keyframes rot { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } .full { grid-column: span 1; } .market-grid { flex-direction: column; gap: 10px; } }
      `}</style>
    </div>
  );
}
