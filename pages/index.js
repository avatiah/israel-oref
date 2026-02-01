import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [mode, setMode] = useState('live'); 

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(d => { if (d && d.live) setData(d); });
    load();
    const int = setInterval(load, 45000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; LOADING_STRATEGIC_MODULES...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      {/* ... (Верхняя часть страницы остается прежней) ... */}
      
      {/* Кнопки переключения и основной индекс (кратко для примера) */}
      <header style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: '1rem' }}>OSINT_COMMAND_V8</h1>
        <div style={{ display: 'flex', border: '1px solid #0f0' }}>
            <button onClick={() => setMode('live')} style={{ background: mode === 'live' ? '#0f0' : '#000', color: mode === 'live' ? '#000' : '#0f0', border: 'none', padding: '5px 15px', cursor: 'pointer' }}>LIVE</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #0f0', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>REGIONAL_THREAT_INDEX</div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{data.live.index}%</div>
        </div>
        <div style={{ border: '1px solid #0f0', padding: '20px' }}>
            <div style={{ fontSize: '0.7rem', borderBottom: '1px solid #0f0', paddingBottom: '5px', marginBottom: '10px' }}>STRATEGIC_ARGUMENT</div>
            <div style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>"{data.key_argument}"</div>
        </div>
      </div>

      {/* НОВЫЙ БЛОК: U.S. VS IRAN STRIKE INDEX */}
      <div style={{ marginTop: '40px', border: '2px solid #f00', background: '#100', padding: '20px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10px', left: '20px', background: '#000', padding: '0 10px', fontSize: '0.7rem', color: '#f00', fontWeight: 'bold' }}>
          EXTERNAL_THEATER_MONITOR: U.S. vs IRAN
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: '60%' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px', color: '#f00' }}>
              PROBABILITY_OF_U.S._KINETIC_ACTION: {data.iran_strike.index}%
            </div>
            <div style={{ fontSize: '0.7rem', marginTop: '10px', opacity: 0.8, color: '#fff' }}>
              {data.iran_strike.desc}
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>STATUS_LEVEL</div>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: data.iran_strike.index > 50 ? '#f00' : '#ffae00' }}>
              {data.iran_strike.status}
            </div>
          </div>
        </div>

        {/* Индикатор прогресса для Ирана */}
        <div style={{ height: '10px', background: '#200', marginTop: '15px', border: '1px solid #f00' }}>
          <div style={{ height: '100%', background: '#f00', width: `${data.iran_strike.index}%`, transition: 'width 2s' }}></div>
        </div>
      </div>

      <footer style={{ marginTop: '20px', fontSize: '0.5rem', opacity: 0.4, textAlign: 'center' }}>
        DATA_SOURCE: GLOBAL_INTELLIGENCE_NODES // ENCRYPTED_UPLINK_STABLE
      </footer>
    </div>
  );
}
