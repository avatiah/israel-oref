import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>RESTORING ANALYTICAL CORES...</div>;

  const color = data.index > 70 ? '#f00' : data.index > 40 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '20px', fontSize: '12px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${color}`, paddingBottom: '10px', marginBottom: '25px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '1.6rem', letterSpacing: '3px' }}>MADAD OREF</h1>
          <div style={{ opacity: 0.6 }}>ISRAEL STRATEGIC INTELLIGENCE TERMINAL</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: color }}>[ STATUS: {data.index > 40 ? 'CRITICAL' : 'OPERATIONAL'} ]</div>
          <div style={{ fontSize: '0.6rem' }}>SYNC: {new Date(data.updated).toLocaleTimeString()}</div>
        </div>
      </div>

      <div className="layout">
        
        {/* BLOCK 1: DYNAMIC RADAR */}
        <div className="card panel-center">
          <div className="radar-box" style={{borderColor: color}}>
            <div className="radar-sweep"></div>
            <div className="radar-grid"></div>
            <div className="radar-value" style={{color: color}}>{data.index}%</div>
          </div>
          <div style={{marginTop: '20px'}}>
            <div style={{fontSize: '0.7rem', color: color, marginBottom: '10px'}}>72H THREAT TREND</div>
            <div style={{display: 'flex', alignItems: 'flex-end', height: '40px', gap: '3px'}}>
              {data.history.map((h, i) => (
                <div key={i} style={{flex: 1, background: color, height: `${h}%`, opacity: 0.1 + (i*0.06)}}></div>
              ))}
            </div>
          </div>
        </div>

        {/* BLOCK 2: SECTOR ANALYSIS & MARKETS */}
        <div className="card">
          <div style={{color: '#f00', fontWeight: 'bold', marginBottom: '15px'}}>&gt; EXTERNAL: U.S. VS IRAN // {data.iran_prob}%</div>
          <div className="market-row">
            <div>POLYMARKET: <span style={{color: '#fff'}}>{data.markets.poly}</span></div>
            <div>BRENT OIL: <span style={{color: '#fff'}}>{data.markets.oil}</span></div>
            <div>USD/ILS: <span style={{color: '#fff'}}>{data.markets.ils}</span></div>
          </div>

          <div style={{marginTop: '25px', borderTop: '1px solid #222', paddingTop: '15px'}}>
            <div style={{fontSize: '0.7rem', color: color, marginBottom: '10px'}}>REGIONAL FRONT STATUS:</div>
            {data.sectors.map((s, i) => (
              <div key={i} style={{marginBottom: '10px'}}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.6rem'}}><span>{s.n}</span><span>{s.v}%</span></div>
                <div style={{height:'2px', background:'#111', marginTop: '4px'}}><div style={{height:'100%', background:color, width:`${s.v}%`}}></div></div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOCK 3: LATEST OSINT LOGS */}
        <div className="card full">
          <div style={{fontSize: '0.7rem', color: color, marginBottom: '12px'}}>&gt; VERIFIED_OSINT_FEED</div>
          {data.logs.map((l, i) => (
            <div key={i} style={{fontSize: '0.7rem', padding: '6px 0', borderBottom: '1px solid #111', display: 'flex'}}>
              <span style={{color: color, marginRight: '10px'}}>[SIGNAL_{i+1}]</span>
              <span style={{color: '#999'}}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: '30px', borderTop: '1px solid #222', paddingTop: '15px', fontSize: '0.6rem', color: '#555' }}>
        <strong>SOURCES (live feeds):</strong><br/>
        • News aggregation (Google News clusters) | • Prediction markets (Polymarket) | 
        • Commodities (Brent Oil - market proxy) | • FX (USD/ILS - stress indicator)
      </footer>

      <style jsx>{`
        .layout { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { border: 1px solid #222; padding: 20px; background: #050505; position: relative; }
        .panel-center { text-align: center; }
        .full { grid-column: span 2; }
        .market-row { display: grid; grid-template-columns: 1fr; gap: 8px; font-size: 0.7rem; }
        
        .radar-box { width: 150px; height: 150px; border: 2px solid #030; border-radius: 50%; margin: 0 auto; position: relative; overflow: hidden; background: #000; }
        .radar-sweep { position: absolute; width: 100%; height: 100%; background: conic-gradient(from 0deg, rgba(0,255,0,0.15) 0deg, transparent 90deg); animation: r 4s linear infinite; }
        .radar-grid { position: absolute; top:0; left:0; width:100%; height:100%; background-image: radial-gradient(circle, transparent 30%, rgba(0,255,0,0.05) 31%, transparent 32%, transparent 60%, rgba(0,255,0,0.05) 61%); }
        .radar-value { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2.2rem; font-weight: bold; }
        
        @keyframes r { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @media (max-width: 700px) {
          .layout { grid-template-columns: 1fr; }
          .full { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
}
