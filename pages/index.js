import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error loading OSINT data"));
  }, []);

  if (!data) return (
    <div style={{ backgroundColor: '#000', color: '#00ff00', height: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      &gt; LOADING_OSINT_ENGINE...<br/>
      &gt; ESTABLISHING_SECURE_CONNECTION...
    </div>
  );

  return (
    <div style={{ backgroundColor: '#000', color: '#00ff00', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      {/* Header */}
      <header style={{ borderBottom: '2px solid #00ff00', marginBottom: '30px', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>THREAT_ENGINE_ADMIN_V1.0</h1>
        <div style={{ fontSize: '0.8rem' }}>STATUS: ONLINE // SYSTEM_TIME: {new Date().toISOString()}</div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* Left Column: Index */}
        <section>
          <div style={{ border: '1px solid #00ff00', padding: '20px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '20px' }}>CURRENT_TENSION_INDEX</h2>
            <div style={{ fontSize: '4rem', fontWeight: 'bold', textShadow: '0 0 10px #00ff00' }}>
              {data.index}%
            </div>
            <div style={{ marginTop: '10px', color: data.index > 70 ? '#ff0000' : '#00ff00' }}>
              {data.index > 70 ? '[ CRITICAL_DANGER ]' : '[ MONITORING_MODE ]'}
            </div>
          </div>

          <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', border: '1px solid #00ff00' }}>
            <tbody>
              {Object.entries(data.blocks).map(([key, val]) => (
                <tr key={key}>
                  <td style={{ border: '1px solid #00ff00', padding: '8px' }}>{key.toUpperCase()}</td>
                  <td style={{ border: '1px solid #00ff00', padding: '8px', textAlign: 'right' }}>{val}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Right Column: Signals */}
        <section>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>&gt; REALTIME_SIGNALS_FEED</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #00ff00' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(0,255,0,0.1)' }}>
                <th style={{ border: '1px solid #00ff00', padding: '10px', textAlign: 'left' }}>SOURCE</th>
                <th style={{ border: '1px solid #00ff00', padding: '10px', textAlign: 'left' }}>DATA_STREAM</th>
              </tr>
            </thead>
            <tbody>
              {data.signals.map((s, i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid #00ff00', padding: '10px', fontSize: '0.8rem' }}>{s.source}</td>
                  <td style={{ border: '1px solid #00ff00', padding: '10px' }}>
                    <a href={s.link} target="_blank" rel="noreferrer" style={{ color: '#00ff00', textDecoration: 'none' }}>
                      {s.title}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </div>

      <footer style={{ marginTop: '40px', fontSize: '0.7rem', opacity: 0.6 }}>
        LAST_UPDATE: {data.last_update} | NO_DATABASE_MODE_ACTIVE
      </footer>
    </div>
  );
}
