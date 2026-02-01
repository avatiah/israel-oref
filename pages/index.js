import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/data', { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error('ERR_CONNECTION_FAILED');
        return res.json();
      })
      .then(json => setData(json))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div style={{color: '#ff0000', padding: '20px', fontFamily: 'monospace'}}> [!] CRITICAL_SYSTEM_ERROR: {error}</div>;
  if (!data) return <div style={{color: '#00ff00', padding: '20px', fontFamily: 'monospace', animation: 'pulse 1s infinite'}}>&gt; ACCESSING_INTEL_NETWORK...</div>;

  const isAlert = data.index > 70;

  return (
    <div style={{ backgroundColor: '#000', color: '#00ff00', minHeight: '100vh', fontFamily: 'monospace', padding: '30px' }}>
      
      {/* HEADER SECTION */}
      <header style={{ border: '1px solid #00ff00', marginBottom: '20px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '2px' }}>THREAT_ENGINE_ADMIN // ISR_OSINT</h1>
          <div style={{ fontSize: '0.7rem', marginTop: '5px' }}>NODE_ID: 0x4FB2 | SOURCE: GLOBAL_RSS_INTEL</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem' }}>STATUS: <span style={{ color: isAlert ? '#ff0000' : '#00ff00', fontWeight: 'bold' }}>{isAlert ? 'CRITICAL' : 'STABLE'}</span></div>
          <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>SYNC_TIME: {new Date(data.last_update).toLocaleTimeString()}</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '20px' }}>
        
        {/* LEFT COLUMN: ANALYTICS */}
        <aside>
          <div style={{ border: '1px solid #00ff00', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.8rem', marginBottom: '10px' }}>CURRENT_TENSION_INDEX</div>
            <div style={{ 
              fontSize: '5.5rem', 
              fontWeight: 'bold', 
              color: isAlert ? '#ff0000' : '#00ff00',
              textShadow: isAlert ? '0 0 15px #ff0000' : '0 0 10px #00ff00' 
            }}>
              {data.index}%
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #00ff00' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #00ff00' }}>
                <th colSpan="2" style={{ padding: '8px', fontSize: '0.7rem', textAlign: 'left', backgroundColor: 'rgba(0,255,0,0.1)' }}>VECTOR_ANALYSIS</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.blocks).map(([k, v]) => (
                <tr key={k}>
                  <td style={{ border: '1px solid #00ff00', padding: '10px', fontSize: '0.7rem' }}>{k.toUpperCase()}</td>
                  <td style={{ border: '1px solid #00ff00', padding: '10px', textAlign: 'right', fontSize: '0.7rem', fontWeight: 'bold' }}>{v}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>

        {/* RIGHT COLUMN: SIGNALS FEED */}
        <main style={{ border: '1px solid #00ff00', padding: '20px' }}>
          <h3 style={{ marginTop: 0, fontSize: '1rem', borderBottom: '1px solid #00ff00', paddingBottom: '10px' }}>&gt; LIVE_SIGNAL_DECODING...</h3>
          <div style={{ overflowY: 'auto', maxHeight: '600px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {data.signals.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(0,255,0,0.2)' }}>
                    <td style={{ padding: '12px 0', verticalAlign: 'top', width: '40px', color: '#555', fontSize: '0.8rem' }}>[{i}]</td>
                    <td style={{ padding: '12px 10px', fontSize: '0.85rem', lineHeight: '1.4' }}>
                      <div style={{ color: '#aaa', fontSize: '0.65rem', marginBottom: '4px' }}>SRC: {s.source}</div>
                      {s.title}
                    </td>
                    <td style={{ textAlign: 'right', padding: '12px 0' }}>
                       <a href={s.link} target="_blank" rel="noreferrer" style={{ 
                         color: '#00ff00', 
                         textDecoration: 'none', 
                         border: '1px solid #00ff00', 
                         padding: '2px 6px', 
                         fontSize: '0.6rem' 
                       }}>VIEW</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

      </div>

      <footer style={{ marginTop: '20px', fontSize: '0.6rem', opacity: 0.5, textAlign: 'center' }}>
        ID: OSINT-ISR-ALPHA-2026 | UNCLASSIFIED ADVISORY
      </footer>

      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        body { margin: 0; background: #000; }
      `}</style>
    </div>
  );
}
