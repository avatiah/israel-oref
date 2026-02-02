import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>RE-CALIBRATING OSINT SENSORS...</div>;

  const color = data.index > 65 ? '#f00' : data.index > 35 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '15px', fontSize: '12px' }}>
      
      <header style={{ borderBottom: `2px solid ${color}`, paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>MADAD OREF</h1>
          <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>STRATEGIC THREAT ANALYTICS // V22_HARDENED</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: color, fontSize: '1rem' }}>INDEX: {data.index}%</div>
          <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>02 FEB 2026 // {new Date(data.updated).toLocaleTimeString()}</div>
        </div>
      </header>

      <div className="grid">
        {/* RADAR */}
        <div className="card center">
          <div className="radar" style={{borderColor: color}}>
            <div className="sweep" style={{background: `conic-gradient(from 0deg, ${color}33 0deg, transparent 90deg)`}}></div>
            <div className="val" style={{color: color}}>{data.index}%</div>
          </div>
          <div style={{marginTop: '15px', color: color}}>LEVEL: {data.index > 35 ? 'ELEVATED' : 'STABLE'}</div>
        </div>

        {/* IRAN BREAKDOWN */}
        <div className="card">
          <div style={{color: '#f00', fontWeight: 'bold', marginBottom: '12px', fontSize: '0.7rem'}}>EXTERNAL: U.S. VS IRAN // {data.iran_detail.total}%</div>
          {data.iran_detail.factors.map((f, i) => (
            <div key={i} style={{marginBottom: '10px'}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize: '0.6rem'}}><span>{f.n}</span><span>+{f.v}</span></div>
              <div style={{height:'2px', background:'#111', marginTop:'4px'}}><div style={{height:'100%', background:'#f00', width:`${(f.v/40)*100}%`}}></div></div>
            </div>
          ))}
        </div>

        {/* MARKETS */}
        <div className="card full market-grid">
          <div className="m-item"><span>BRENT OIL</span><br/><span style={{color: '#fff'}}>{data.markets.brent}</span></div>
          <div className="m-item"><span>USD/ILS</span><br/><span style={{color: '#fff'}}>{data.markets.ils}</span></div>
          <div className="m-item"><span>POLYMARKET</span><br/><span style={{color: '#fff'}}>{data.markets.poly}</span></div>
          <div className="m-item"><span>SENTIMENT</span><br/><span style={{color: color}}>{data.index > 40 ? 'RISK_OFF' : 'NEUTRAL'}</span></div>
        </div>

        {/* OSINT FEED */}
        <div className="card full">
          <div style={{fontSize: '0.7rem', color: color, marginBottom: '10px'}}>&gt; VERIFIED_SIGNALS:</div>
          {data.logs.map((l, i) => (
            <div key={i} style={{fontSize: '0.65rem', marginBottom: '8px', borderLeft: `2px solid ${color}`, paddingLeft: '8px', color: '#888'}}>
              {l}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .card { border: 1px solid #222; padding: 15px; background: #050505; }
        .full { grid-column: span 2; }
        .center { text-align: center; }
        .market-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .m-item { border-left: 1px solid #333; padding-left: 10px; font-size: 0.6rem; }
        .radar { width: 120px; height: 120px; border: 2px solid #030; border-radius: 50%; margin: 0 auto; position: relative; overflow: hidden; }
        .sweep { position: absolute; width: 100%; height: 100%; animation: r 4s linear infinite; }
        .val { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.8rem; font-weight: bold; }
        @keyframes r { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } .full { grid-column: span 1; .market-grid { grid-template-columns: 1fr 1fr; } } }
      `}</style>
    </div>
  );
}
