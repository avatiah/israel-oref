import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [showMeta, setShowMeta] = useState(false);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>INITIALIZING MADAD OREF V18...</div>;

  const mainColor = data.index > 65 ? '#f00' : data.index > 35 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '15px', fontSize: '13px' }}>
      
      {/* HEADER */}
      <header style={{ borderBottom: `2px solid ${mainColor}`, paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', letterSpacing: '2px' }}>MADAD OREF</h1>
          <div style={{ fontSize: '0.6rem', opacity: 0.7 }}>ISRAEL GENERAL THREAT INDEX</div>
        </div>
        <button onClick={() => setShowMeta(!showMeta)} style={{background:'none', border:`1px solid ${mainColor}`, color:mainColor, padding:'4px 8px', cursor:'pointer', fontSize:'0.7rem'}}>
          [ METHODOLOGY ]
        </button>
      </header>

      {showMeta && (
        <div style={{ border: `1px solid ${mainColor}`, padding: '10px', marginBottom: '20px', background: '#080808', fontSize: '0.7rem' }}>
          &gt; CALCULATION: Index = (Military*5 + Rhetoric*3 + Logistics*4) / 4.5 <br/>
          &gt; DATA SOURCES: Verified News Clusters & Market Proxies.
        </div>
      )}

      <div className="grid">
        {/* RADAR BLOCK */}
        <div className="card center">
          <div className="radar" style={{borderColor: mainColor}}>
            <div className="sweep" style={{background: `conic-gradient(from 0deg, ${mainColor}44 0deg, transparent 90deg)`}}></div>
            <div className="val" style={{color: mainColor}}>{data.index}%</div>
          </div>
          <div style={{marginTop: '15px', color: mainColor}}>STATUS: {data.index > 35 ? 'ELEVATED' : 'STABILIZED'}</div>
          
          {/* MINI CHART */}
          <div style={{marginTop: '20px', display:'flex', alignItems:'flex-end', height: '40px', gap: '2px'}}>
            {data.history.map((h, i) => (
              <div key={i} style={{flex: 1, background: mainColor, height: `${h}%`, opacity: 0.2 + (i*0.06)}}></div>
            ))}
          </div>
          <div style={{fontSize: '0.5rem', marginTop: '5px', opacity: 0.5}}>72H TREND ANALYSIS</div>
        </div>

        {/* EXTERNAL & FRONTS */}
        <div className="card">
          <div style={{color: '#f00', fontWeight: 'bold', marginBottom: '10px'}}>EXTERNAL: U.S. VS IRAN</div>
          <div style={{fontSize: '1.5rem', marginBottom: '5px'}}>{data.iran_prob}% <span style={{fontSize: '0.7rem', opacity:0.5}}>STRIKE PROB.</span></div>
          
          <div style={{marginTop: '20px', borderTop: '1px solid #222', paddingTop: '10px'}}>
            <div style={{fontSize: '0.7rem', marginBottom: '10px', color: mainColor}}>REGIONAL FRONTS:</div>
            {data.fronts.map((f, i) => (
              <div key={i} style={{marginBottom: '10px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem'}}><span>{f.name}</span><span>{f.val}%</span></div>
                <div style={{height: '2px', background: '#111', marginTop: '4px'}}><div style={{height: '100%', background: mainColor, width: `${f.val}%`}}></div></div>
              </div>
            ))}
          </div>
        </div>

        {/* LOGS - FULL WIDTH */}
        <div className="card full">
          <div style={{fontSize: '0.7rem', color: mainColor, marginBottom: '10px'}}>&gt; LATEST_OSINT_SIGNALS</div>
          {data.logs.map((l, i) => (
            <div key={i} style={{fontSize: '0.7rem', marginBottom: '8px', borderLeft: `2px solid ${mainColor}`, paddingLeft: '10px', color: '#bbb'}}>
              {l}
            </div>
          ))}
        </div>
      </div>

      <footer style={{marginTop: '30px', borderTop: '1px solid #222', paddingTop: '15px', fontSize: '0.6rem', color: '#555'}}>
        <div style={{marginBottom: '10px'}}>
          <strong>SOURCES (live feeds):</strong><br/>
          • News aggregation (Google News clusters) | • Prediction markets (Polymarket)<br/>
          • Commodities (Brent – market proxy) | • FX (USD/ILS – stress indicator)
        </div>
        <div>UPDATED: {new Date(data.updated).toLocaleString()} | MADAD OREF DSS V18</div>
      </footer>

      <style jsx>{`
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .card { border: 1px solid #222; padding: 15px; background: #050505; }
        .center { text-align: center; }
        .full { grid-column: span 2; }
        .radar { width: 140px; height: 140px; border: 2px solid #030; border-radius: 50%; margin: 0 auto; position: relative; overflow: hidden; background: radial-gradient(circle, #010 0%, #000 70%); }
        .sweep { position: absolute; width: 100%; height: 100%; animation: r 4s linear infinite; }
        .val { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2rem; font-weight: bold; }
        @keyframes r { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @media (max-width: 650px) {
          .grid { grid-template-columns: 1fr; }
          .full { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
}
