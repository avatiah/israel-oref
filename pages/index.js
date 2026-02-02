import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>DEPLOYING V24_STRATEGIST...</div>;

  const color = data.index > 70 ? '#f00' : data.index > 40 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '15px', fontSize: '11px' }}>
      
      {/* HEADER WITH CONFIDENCE LEVEL */}
      <header style={{ borderBottom: `2px solid ${color}`, paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>MADAD OREF <span style={{fontSize: '0.6rem', opacity: 0.5}}>V24_PRO</span></h2>
          <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
            <span style={{ color: color }}>● INDEX: {data.index}%</span>
            <span>CONFIDENCE: <b style={{color: data.confidence.level==='HIGH'?'#0f0':'#f90'}}>{data.confidence.level}</b> ({data.confidence.sources} sources)</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.6rem', opacity: 0.6 }}>
          TIMELINE: 24H-7D HORIZON<br/>LAST SYNC: {new Date(data.updated).toLocaleTimeString()}
        </div>
      </header>

      <div className="layout">
        
        {/* RADAR & TREND GRAPH */}
        <div className="card center">
          <div className="radar-circle" style={{borderColor: color}}>
            <div className="radar-sweep"></div>
            <div className="radar-value" style={{color: color}}>{data.index}%</div>
          </div>
          <div style={{marginTop: '15px'}}>
            <div style={{fontSize: '0.6rem', marginBottom: '5px', opacity: 0.6}}>24H THREAT EVOLUTION</div>
            <div style={{display: 'flex', alignItems: 'flex-end', height: '30px', gap: '2px'}}>
              {data.history.map((h, i) => (
                <div key={i} style={{flex: 1, background: color, height: `${h}%`, opacity: 0.2 + (i*0.06)}}></div>
              ))}
            </div>
          </div>
        </div>

        {/* SCENARIO MATRIX */}
        <div className="card">
          <div style={{fontSize: '0.7rem', color: '#fff', marginBottom: '10px', fontWeight: 'bold'}}>&gt; ESCALATION SCENARIOS</div>
          {data.scenarios.map((s, i) => (
            <div key={i} style={{marginBottom: '10px', borderLeft: '2px solid #333', paddingLeft: '8px'}}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <span>{s.name}</span>
                <span style={{color: s.val > 60 ? '#f00' : '#fff'}}>{s.val}%</span>
              </div>
              <div style={{height:'2px', background:'#111', marginTop:'4px'}}><div style={{height:'100%', background:color, width:`${s.val}%`}}></div></div>
            </div>
          ))}
        </div>

        {/* RISK MITIGATORS (NEW) */}
        <div className="card" style={{borderColor: '#0f0'}}>
          <div style={{fontSize: '0.7rem', color: '#0f0', marginBottom: '10px', fontWeight: 'bold'}}>&gt; DE-ESCALATION SIGNALS</div>
          {data.mitigators.length > 0 ? data.mitigators.map((m, i) => (
            <div key={i} style={{color: '#9f9', fontSize: '0.65rem'}}>[V] {m}</div>
          )) : <div style={{opacity: 0.4}}>No mitigation signals detected.</div>}
        </div>

        {/* MARKETS (STILL HERE) */}
        <div className="card market-grid">
          <div className="m-item"><span>BRENT CRUDE</span><br/><b style={{color:'#fff'}}>{data.markets.oil}</b></div>
          <div className="m-item"><span>USD/ILS</span><br/><b style={{color:'#fff'}}>{data.markets.ils}</b></div>
          <div className="m-item"><span>POLYMARKET</span><br/><b style={{color:'#fff'}}>{data.markets.poly}</b></div>
        </div>

        {/* LOGS WITH SOURCE TAGS */}
        <div className="card full">
          <div style={{fontSize: '0.7rem', color: color, marginBottom: '10px', fontWeight: 'bold'}}>&gt; VERIFIED_OSINT_FEED (SORTED)</div>
          <div className="log-container">
            {data.logs.map((l, i) => (
              <div key={i} style={{fontSize: '0.65rem', padding: '6px 0', borderBottom: '1px solid #111', display: 'flex'}}>
                <span style={{color: color, width: '60px'}}>[{l.cat}]</span>
                <span style={{flex: 1}}>{l.text}</span>
                <span style={{opacity: 0.4, marginLeft: '10px'}}>{l.src}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .layout { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .card { border: 1px solid #222; padding: 15px; background: #050505; }
        .full { grid-column: span 2; }
        .center { text-align: center; }
        .market-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .m-item { border-left: 1px solid #333; padding-left: 10px; }
        .radar-circle { width: 110px; height: 110px; border: 2px solid #030; border-radius: 50%; margin: 0 auto; position: relative; overflow: hidden; }
        .radar-sweep { position: absolute; width: 100%; height: 100%; background: conic-gradient(from 0deg, rgba(0,255,0,0.2) 0deg, transparent 90deg); animation: rot 4s linear infinite; }
        .radar-value { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2rem; font-weight: bold; }
        @keyframes rot { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 600px) { .layout { grid-template-columns: 1fr; } .full { grid-column: span 1; } .market-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
