import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>VERIFYING OSINT SOURCES...</div>;

  const color = data.index > 65 ? '#f00' : data.index > 35 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '15px', fontSize: '12px' }}>
      
      {/* HEADER */}
      <div style={{ borderBottom: `2px solid ${color}`, paddingBottom: '10px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', letterSpacing: '2px' }}>MADAD OREF</h1>
          <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>STRATEGIC THREAT MONITORING // OSINT V21</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: color }}>INDEX: {data.index}%</div>
          <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>02 FEB 2026 // {new Date(data.updated).toLocaleTimeString()}</div>
        </div>
      </div>

      <div className="grid">
        {/* RADAR & TREND */}
        <div className="card center">
          <div className="radar" style={{borderColor: color}}>
            <div className="sweep" style={{background: `conic-gradient(from 0deg, ${color}33 0deg, transparent 90deg)`}}></div>
            <div className="val" style={{color: color}}>{data.index}%</div>
          </div>
          <div style={{marginTop: '15px', color: color, letterSpacing: '1px'}}>LEVEL: {data.index > 35 ? 'HIGH_TENSION' : 'MONITORED'}</div>
        </div>

        {/* DETAILED IRAN BREAKDOWN */}
        <div className="card">
          <div style={{color: '#f00', fontWeight: 'bold', marginBottom: '12px', borderBottom: '1px solid #300'}}>EXTERNAL: U.S. VS IRAN // {data.iran_detail.total}%</div>
          <div style={{fontSize: '0.7rem'}}>
            {data.iran_detail.factors.map((f, i) => (
              <div key={i} style={{marginBottom: '12px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom: '4px'}}>
                  <span>{f.n}</span>
                  <span style={{color: '#f00'}}>+{f.v} pts</span>
                </div>
                <div style={{height:'2px', background: '#111'}}><div style={{height:'100%', background:'#f00', width: `${(f.v/50)*100}%`}}></div></div>
              </div>
            ))}
          </div>
          <div style={{fontSize: '0.6rem', opacity: 0.5, marginTop: '10px'}}>* Probabilities calculated based on CSG positions & kinetic logs.</div>
        </div>

        {/* MARKET INTELLIGENCE (CORRECTED) */}
        <div className="card full market-grid">
          <div className="m-item"><span>BRENT OIL (MARKET PROXY)</span><br/><span style={{color: '#fff', fontSize: '1.1rem'}}>{data.markets.brent}</span></div>
          <div className="m-item"><span>USD/ILS (STRESS INDEX)</span><br/><span style={{color: '#fff', fontSize: '1.1rem'}}>{data.markets.ils}</span></div>
          <div className="m-item"><span>POLYMARKET (ESC. PROB)</span><br/><span style={{color: '#fff', fontSize: '1.1rem'}}>{data.markets.poly}</span></div>
          <div className="m-item"><span>SENTIMENT</span><br/><span style={{color: color}}>{data.index > 40 ? 'RISK_OFF' : 'STABLE'}</span></div>
        </div>

        {/* LIVE OSINT FEED */}
        <div className="card full">
          <div style={{fontSize: '0.7rem', color: color, marginBottom: '10px'}}>&gt; VERIFIED_SIGNALS_LOG:</div>
          {data.logs.map((l, i) => (
            <div key={i} style={{fontSize: '0.65rem', padding: '6px 0', borderBottom: '1px solid #111', color: '#999'}}>
              <span style={{color: color, marginRight: '8px'}}>[EVENT_{i+1}]</span> {l}
            </div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: '30px', borderTop: '1px solid #222', paddingTop: '15px', fontSize: '0.6rem', color: '#444' }}>
        <strong>ANALYTIC SOURCES:</strong> News Aggregation (Google clusters) | Prediction markets (Polymarket) | Commodities (Brent) | FX (USD/ILS) <br/>
        <em>Disclaimer: Data provided as-is for situational awareness.</em>
      </footer>

      <style jsx>{`
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .card { border: 1px solid #222; padding: 15px; background: #050505; position: relative; }
        .center { text-align: center; }
        .full { grid-column: span 2; }
        .market-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .m-item { border-left: 1px solid #333; padding-left: 10px; }
        .radar { width: 130px; height: 130px; border: 2px solid #030; border-radius: 50%; margin: 0 auto; position: relative; overflow: hidden; background: #000; }
        .sweep { position: absolute; width: 100%; height: 100%; animation: r 4s linear infinite; }
        .val { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2rem; font-weight: bold; }
        @keyframes r { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } .full { grid-column: span 1; } .market-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </div>
  );
}
