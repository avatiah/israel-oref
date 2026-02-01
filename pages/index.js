import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/data', { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error('CONNECTION_LOST');
        return res.json();
      })
      .then(json => setData(json))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div style={{backgroundColor:'#000', color:'#f00', padding:'20px', fontFamily:'monospace'}}>[!] CRITICAL_ERROR: {error}</div>;
  if (!data) return <div style={{backgroundColor:'#000', color:'#0f0', padding:'20px', fontFamily:'monospace'}}>&gt; SYNCHRONIZING_WITH_INTEL_NETWORK...</div>;

  const isAlert = data.index > 70;

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      {/* HEADER */}
      <header style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.2rem' }}>THREAT_ENGINE_ADMIN // ISR_v1.0</h1>
          <div style={{ fontSize: '0.7rem' }}>UPLINK: ACTIVE | ENCRYPTION: AES-256</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: isAlert ? '#f00' : '#0f0' }}>STATUS: {isAlert ? 'CRITICAL_DANGER' : 'MONITORING'}</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{data.last_update}</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
        {/* ANALYTICS COLUMN */}
        <aside>
          <div style={{ border: '1px solid #0f0', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.8rem', marginBottom: '10px' }}>TENSION_INDEX</div>
            <div style={{ fontSize: '5rem', fontWeight: 'bold', textShadow: isAlert ? '0 0 15px #f00' : '0 0 10px #0f0', color: isAlert ? '#f00' : '#0f0' }}>
              {data.index}%
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #0f0' }}>
            <tbody>
              {Object.entries(data.blocks).map(([k, v]) => (
                <tr key={k}>
                  <td style={{ border: '1px solid #0f0', padding: '10px', fontSize: '0.7rem' }}>{k.toUpperCase()}</td>
                  <td style={{ border: '1px solid #0f0', padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>{v}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>

        {/* SIGNALS COLUMN */}
        <main style={{ border: '1px solid #0f0', padding: '20px' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #0f0', paddingBottom: '10px' }}>&gt; LIVE_INTEL_STREAM</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {data.signals.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                  <td style={{ padding: '12px 5px', fontSize: '0.85rem' }}>
                    <span style={{ color: '#555' }}>[{i}]</span> {s.title}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <a href={s.link} target="_blank" rel="noreferrer" style={{ color: '#0f0', textDecoration: 'none', border: '1px solid #0f0', padding: '2px 5px', fontSize: '0.7rem' }}>LINK</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
