import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data')
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setData(d))
      .catch(e => console.error("API_ERR", e));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; SECURING_CHANNEL...</div>;

  const MapZone = ({ active, path }) => (
    <path d={path} fill={active ? '#ff0000' : '#111'} stroke="#0f0" strokeWidth="1" className={active ? 'pulse' : ''} />
  );

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '15px' }}>
      <header style={{ border: '1px solid #0f0', padding: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{fontWeight:'bold'}}>ISR_RADAR_PRO // V2</div>
        <div style={{fontSize:'0.7rem', opacity: 0.8}}>SYSTEM_STATUS: ONLINE</div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div style={{ border: '1px solid #0f0', padding: '20px', textAlign: 'center', marginBottom: '15px' }}>
            <div style={{fontSize:'0.7rem', opacity:0.6}}>TENSION_INDEX</div>
            <div style={{fontSize:'4rem', fontWeight:'bold', color: (data?.index || 0) > 60 ? '#f00' : '#0f0'}}>{data?.index || 0}%</div>
          </div>

          <div style={{ border: '1px solid #0f0', padding: '15px', textAlign: 'center' }}>
            <div style={{fontSize:'0.6rem', marginBottom:'10px'}}>THREAT_GEOMETRY</div>
            <svg viewBox="0 0 100 200" style={{ height: '250px' }}>
              <MapZone active={data?.geo?.north} path="M40,10 L60,10 L65,30 L35,35 Z" />
              <MapZone active={data?.geo?.center} path="M35,35 L65,30 L60,70 L30,75 Z" />
              <MapZone active={data?.geo?.westbank} path="M50,45 L65,45 L65,85 L50,90 Z" />
              <MapZone active={data?.geo?.gaza} path="M25,80 L35,80 L35,95 L25,100 Z" />
              <MapZone active={data?.geo?.south} path="M30,75 L60,70 L55,180 L20,130 Z" />
            </svg>
            <div style={{fontSize:'0.5rem', marginTop:'10px', textAlign:'left'}}>
               {data?.geo && Object.entries(data.geo).map(([k, v]) => (
                 <div key={k} style={{color: v ? '#f00' : '#333'}}>• {k.toUpperCase()}: {v ? 'ALERT' : 'STABLE'}</div>
               ))}
            </div>
          </div>
        </aside>

        <main className="feed">
          <div style={{ border: '1px solid #0f0', padding: '15px', height: '100%' }}>
            <div style={{borderBottom:'1px solid #0f0', paddingBottom:'10px', marginBottom:'15px'}}>&gt; INTELLIGENCE_LOG</div>
            {data?.signals?.map((s, i) => (
              <div key={i} style={{ marginBottom: '12px', borderBottom: '1px solid #111', paddingBottom: '8px' }}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.7rem'}}>
                  <span style={{color: s.color}}>[{s.importance}]</span>
                  <a href={s.link} target="_blank" style={{color:'#0f0', textDecoration:'none', border:'1px solid #0f0', padding:'0 3px'}}>&gt;&gt;</a>
                </div>
                <div style={{fontSize:'0.85rem', marginTop:'4px'}}>{s.title}</div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .layout { display: flex; flex-direction: column; gap: 15px; }
        @media (min-width: 768px) { .layout { flex-direction: row; } .sidebar { width: 280px; } .feed { flex-grow: 1; } }
        .pulse { animation: mapPulse 1s infinite; }
        @keyframes mapPulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        body { background: #000; margin: 0; overflow-x: hidden; }
      `}</style>
    </div>
  );
}
