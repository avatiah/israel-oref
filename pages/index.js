import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>LOADING_SYSTEM_CORES...</div>;

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
      <div style={{ borderBottom: '1px solid #0f0', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{fontWeight:'bold', letterSpacing:'2px'}}>ISRAEL SECURITY TENSION INDEX // V14</span>
        <span style={{color: status.color}}>[ STATUS: {status.text} ]</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* BLOCK 1: RADAR & MAIN INDEX */}
        <div style={{ border: '1px solid #222', padding: '20px', textAlign: 'center', background: '#050505' }}>
          <div className="radar-container">
            <div className="radar-sweep"></div>
            <div className="radar-circles"></div>
            <div className="radar-value" style={{color: status.color}}>{data.index}</div>
          </div>
          <div style={{ marginTop: '20px', fontSize: '1.2rem', color: status.color }}>{status.text} TENSION</div>
          <div style={{ opacity: 0.5, fontSize: '0.7rem' }}>UPDATED: {new Date(data.updated).toLocaleTimeString()}</div>
        </div>

        {/* BLOCK 3: BREAKDOWN */}
        <div style={{ border: '1px solid #222', padding: '20px' }}>
          <div style={{ marginBottom: '15px', borderBottom: '1px solid #222' }}>WHAT DRIVES THE INDEX NOW</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', opacity: 0.5 }}>
                <th style={{padding:'5px'}}>SOURCE</th>
                <th>COUNT</th>
                <th>WEIGHT</th>
                <th>IMPACT</th>
              </tr>
            </thead>
            <tbody>
              {data.stats.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                  <td style={{padding:'8px 5px'}}>{s.label}</td>
                  <td>{s.count}</td>
                  <td>×{s.weight}</td>
                  <td style={{color: '#0f0'}}>+{s.contribution}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>

      {/* BLOCK 5: LATEST TRIGGERS */}
      <div style={{ marginTop: '30px', border: '1px solid #222', padding: '20px' }}>
        <div style={{ marginBottom: '15px', color: '#ff0' }}>&gt; LATEST_ESCALATION_SIGNALS</div>
        {data.latest.map((s, i) => (
          <div key={i} style={{ marginBottom: '8px', borderLeft: `2px solid ${s.weight > 4 ? '#f00' : '#0f0'}`, paddingLeft: '10px' }}>
            <span style={{opacity: 0.5}}>[{s.type}]</span> {s.text}
          </div>
        ))}
      </div>

      {/* FOOTER & DISCLAIMER */}
      <footer style={{ marginTop: '50px', borderTop: '1px solid #222', paddingTop: '20px', fontSize: '0.65rem', color: '#555', textAlign: 'center' }}>
        <p>Disclaimer: The developers are not responsible for decisions made based on the data in this index. For critical decisions, always consult official sources and experts.</p>
        <p>© 2026 OSINT_DASHBOARD_STATION</p>
      </footer>

      {/* RADAR STYLES */}
      <style jsx>{`
        .radar-container {
          width: 200px;
          height: 200px;
          border: 2px solid #040;
          border-radius: 50%;
          margin: 0 auto;
          position: relative;
          background: radial-gradient(circle, #010 0%, #000 70%);
          overflow: hidden;
        }
        .radar-sweep {
          position: absolute;
          width: 100%;
          height: 100%;
          background: conic-gradient(from 0deg, rgba(0,255,0,0.3) 0deg, transparent 90deg);
          animation: sweep 4s linear infinite;
        }
        .radar-circles {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 50%;
          box-shadow: inset 0 0 0 1px #030, inset 0 0 0 40px rgba(0,255,0,0.02), inset 0 0 0 80px rgba(0,255,0,0.02);
        }
        .radar-value {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-size: 3rem;
          font-weight: bold;
        }
        @keyframes sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
