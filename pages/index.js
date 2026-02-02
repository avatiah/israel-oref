import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>INITIALIZING MADAD OREF...</div>;

  const getStatus = (v) => {
    if (v <= 25) return { text: 'CALM', color: '#0f0' };
    if (v <= 50) return { text: 'ELEVATED', color: '#ff0' };
    if (v <= 75) return { text: 'HIGH', color: '#f90' };
    return { text: 'CRITICAL', color: '#f00' };
  };

  const status = getStatus(data.index);

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px', fontSize: '13px' }}>
      
      {/* HEADER */}
      <div style={{ borderBottom: '1px solid #0f0', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '4px' }}>MADAD OREF</h1>
          <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>ISRAEL GENERAL THREAT INDEX</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: status.color, fontSize: '1rem' }}>[ STATUS: {status.text} ]</div>
          <div style={{ fontSize: '0.6rem' }}>DATA_REFRESH: {new Date(data.updated).toLocaleTimeString()}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '25px' }}>
        
        {/* RADAR & MAIN INDEX */}
        <div style={{ border: '1px solid #222', padding: '30px', background: '#050505', position: 'relative' }}>
          <div className="radar-container">
            <div className="radar-sweep"></div>
            <div className="radar-circles"></div>
            <div className="radar-value" style={{color: status.color}}>{data.index}</div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '15px', color: status.color, fontSize: '1rem' }}>SECURITY_TENSION_LEVEL</div>
        </div>

        {/* DRIVERS BREAKDOWN */}
        <div style={{ border: '1px solid #222', padding: '20px' }}>
          <div style={{ fontSize: '0.7rem', color: '#ff0', marginBottom: '15px' }}>&gt; WHAT_DRIVES_THE_INDEX_NOW</div>
          <table style={{ width: '100%', fontSize: '0.7rem', borderCollapse: 'collapse' }}>
            <tbody>
              {data.stats.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                  <td style={{padding: '8px 0'}}>{s.label}</td>
                  <td style={{textAlign: 'right', color: '#0f0'}}>+{s.contribution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EXTERNAL THEATER: US VS IRAN */}
      <div style={{ marginTop: '25px', border: '1px solid #f00', padding: '20px', background: '#100' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <div>
            <div style={{ color: '#f00', fontSize: '0.8rem', fontWeight: 'bold' }}>EXTERNAL_THEATER: U.S. VS IRAN</div>
            <div style={{ fontSize: '1.4rem' }}>STRIKE_PROBABILITY: {data.iran_strike.index}%</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.6rem', color: '#f00' }}>
             OSINT SOURCE: PENTAGON_FEED / IR_STATE_MEDIA
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
          {data.iran_strike.factors.map((f, i) => (
            <div key={i} style={{ borderLeft: '1px solid #f00', paddingLeft: '10px' }}>
              <div style={{ fontSize: '0.6rem', opacity: 0.7 }}>{f.name}</div>
              <div style={{ fontSize: '0.8rem' }}>+{f.val} pts</div>
            </div>
          ))}
        </div>
      </div>

      {/* SIGNALS TICKER */}
      <div style={{ marginTop: '25px', border: '1px solid #222', padding: '15px' }}>
        <div style={{ fontSize: '0.7rem', color: '#0f0', marginBottom: '10px' }}>&gt; RECENT_OSINT_LOGS:</div>
        {data.latest.map((s, i) => (
          <div key={i} style={{ fontSize: '0.7rem', marginBottom: '5px', color: s.weight > 4 ? '#f66' : '#ccc' }}>
            [{new Date().toLocaleTimeString()}] - {s.type}: {s.text}
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '40px', fontSize: '0.6rem', color: '#444', textAlign: 'center', lineHeight: '1.5' }}>
        Disclaimer: The developers are not responsible for decisions made based on the data in this index. For critical decisions, always consult official sources and experts. <br/>
        SYSTEM_ID: MADAD_OREF_V14.5 | ENCRYPTION: ACTIVE
      </footer>

      <style jsx>{`
        .radar-container { width: 180px; height: 180px; border: 2px solid #030; border-radius: 50%; margin: 0 auto; position: relative; background: #000; overflow: hidden; }
        .radar-sweep { position: absolute; width: 100%; height: 100%; background: conic-gradient(from 0deg, rgba(0,255,0,0.25) 0deg, transparent 90deg); animation: sweep 4s linear infinite; }
        .radar-circles { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; box-shadow: inset 0 0 0 1px #020, inset 0 0 0 30px rgba(0,255,0,0.01), inset 0 0 0 60px rgba(0,255,0,0.01); }
        .radar-value { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem; font-weight: bold; }
        @keyframes sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
