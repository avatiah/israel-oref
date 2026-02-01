import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
    } catch (e) { console.error("Sync Error"); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Обновление раз в минуту
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; INITIALIZING_RADAR...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '10px' }}>
      {/* HEADER */}
      <div style={{ border: '1px solid #0f0', padding: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>ISR_STRIKE_RADAR</div>
        <div style={{ fontSize: '0.7rem', color: data.index > 70 ? '#f00' : '#0f0' }}>STATUS: ACTIVE</div>
      </div>

      <div className="main-grid">
        {/* INDEX SECTION */}
        <div style={{ border: '1px solid #0f0', padding: '15px', textAlign: 'center', marginBottom: '15px' }}>
          <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>AGGREGATED_TENSION_INDEX</div>
          <div style={{ fontSize: '4rem', fontWeight: 'bold', color: data.index > 65 ? '#f00' : '#0f0' }}>{data.index}%</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginTop: '10px' }}>
            {Object.entries(data.blocks).map(([k, v]) => (
              <div key={k} style={{ fontSize: '0.6rem', border: '1px solid #333', padding: '4px' }}>
                {k.replace('_', ' ')}: {v}%
              </div>
            ))}
          </div>
        </div>

        {/* FEED SECTION */}
        <div style={{ border: '1px solid #0f0', padding: '10px' }}>
          <div style={{ fontSize: '0.8rem', borderBottom: '1px solid #0f0', paddingBottom: '5px', marginBottom: '10px' }}>&gt; LIVE_INTEL_STREAM</div>
          {data.signals.map((s, i) => (
            <div key={i} style={{ borderBottom: '1px solid #222', padding: '10px 0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: s.color, fontSize: '0.65rem', fontWeight: 'bold' }}>[{s.importance}]</span>
                <span style={{ color: '#555', fontSize: '0.65rem' }}>{s.time}</span>
              </div>
              <div style={{ fontSize: '0.85rem', lineHeight: '1.3' }}>{s.title}</div>
              <a href={s.link} target="_blank" style={{ color: '#0f0', fontSize: '0.65rem', marginTop: '5px', textDecoration: 'none', border: '1px solid #0f0', width: 'fit-content', padding: '1px 4px' }}>OPEN_SOURCE</a>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .main-grid { display: flex; flexDirection: column; }
        @media (min-width: 768px) {
          .main-grid { display: grid; grid-template-columns: 320px 1fr; gap: 15px; }
        }
      `}</style>
    </div>
  );
}
