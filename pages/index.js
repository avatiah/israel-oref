import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>INITIATING STRATCOM V23...</div>;

  const color = data.index > 60 ? '#f00' : data.index > 35 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '20px', fontSize: '12px' }}>
      
      <header style={{ borderBottom: `2px solid ${color}`, paddingBottom: '10px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, color: '#fff', letterSpacing: '2px' }}>MADAD OREF</h2>
          <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>INTEL STATUS: {data.index > 40 ? 'CRITICAL' : 'STABLE'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: color, fontSize: '1.2rem' }}>{data.index}%</div>
          <div style={{ fontSize: '0.6rem' }}>02 FEB 2026 // LIVE</div>
        </div>
      </header>

      <div className="layout">
        {/* RADAR */}
        <div className="card center">
          <div className="radar-circle" style={{borderColor: color}}>
            <div className="radar-sweep"></div>
            <div className="radar-value" style={{color: color}}>{data.index}%</div>
          </div>
          <div style={{marginTop: '20px', fontSize: '0.8rem', color: color}}>&gt; THREAT_LEVEL: {data.index > 35 ? 'ELEVATED' : 'MONITORED'}</div>
        </div>

        {/* IRAN ANALYSIS */}
        <div className="card">
          <div style={{color: '#f00', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #300'}}>EXTERNAL: U.S. VS IRAN // {data.iran_detail.total}%</div>
          {data.iran_detail.factors.map((f, i) => (
            <div key={i} style={{marginBottom: '12px'}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.65rem'}}><span>{f.n}</span><span>+{f.v} pts</span></div>
              <div style={{height:'3px', background:'#111', marginTop: '5px'}}><div style={{height:'100%', background:'#f00', width: `${(f.v/40)*100}%`}}></div></div>
            </div>
          ))}
          <div style={{fontSize: '0.55rem', opacity: 0.4, marginTop: '15px'}}>* Logic correlates CENTCOM naval assets with escalatory rhetoric.</div>
        </div>

        {/* MARKET INDICATORS */}
        <div className="card full market-grid">
          <div className="m-item"><span>BRENT OIL</span><br/><span style={{color: '#fff', fontSize: '1rem'}}>{data.markets.oil}</span></div>
          <div className="m-item"><span>USD/ILS</span><br/><span style={{color: '#fff', fontSize: '1rem'}}>{data.markets.ils}</span></div>
          <div className="m-item"><span>POLYMARKET (STRIKE)</span><br/><span style={{color: '#fff', fontSize: '1rem'}}>{data.markets.poly}</span></div>
          <div className="m-item"><span>MARKET TREND</span><br/><span style={{color: color}}>{data.index > 40 ? 'RISK_OFF' : 'RISK_ON'}</span></div>
        </div>

        {/* OSINT LOGS */}
        <div className="card full">
          <div style={{fontSize: '0.7rem', color: color, marginBottom: '12px'}}>&gt; VERIFIED_OSINT_FEED:</div>
          {data.logs.map((l, i) => (
            <div key={i} style={{fontSize: '0.7rem', padding: '8px 0', borderBottom: '1px solid #111', color: '#999'}}>
              <span style={{color: color, marginRight: '10px'}}>[{i+1}]</span> {l}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .layout { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { border: 1px solid #222; padding: 20px; background: #050505; }
        .center { text-align: center; }
        .full { grid-column: span 2; }
        .market-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .m-item { border-left: 1px solid #333; padding-left: 10px; }
        
        .radar-circle { width: 140px; height: 140px; border: 2px solid #030; border-radius: 50%; margin: 0 auto; position: relative; overflow: hidden; }
        .radar-sweep { position: absolute; width: 100%; height: 100%; background: conic-gradient(from 0deg, rgba(0,255,0,0.2) 0deg, transparent 90deg); animation: rot 4s linear infinite; }
        .radar-value { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2.5rem; font-weight: bold; }
        
        @keyframes rot { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 700px) { .layout { grid-template-columns: 1fr; } .full { grid-column: span 1; } .market-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
}
