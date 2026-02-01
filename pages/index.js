import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 30000); // Чаще опрашиваем для детекции взрыва
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; SYNCING_WITH_EXPERT_NODES...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '10px' }}>
      <header style={{ border: '1px solid #0f0', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{fontWeight:'bold'}}>OSINT_RADAR_PREDICT // v3.0</span>
        <span style={{fontSize:'0.7rem'}}>EXPERT_NODES: ACTIVE</span>
      </header>

      <div className="grid">
        <aside style={{ width: '280px' }}>
          <div style={{ border: '1px solid #0f0', padding: '20px', textAlign: 'center', marginBottom: '10px' }}>
            <div style={{fontSize:'0.6rem', opacity:0.6}}>AGGREGATED_THREAT</div>
            <div style={{fontSize:'3.5rem', fontWeight:'bold', color: data.index > 75 ? '#f00' : '#0f0'}}>{data.index}%</div>
          </div>

          <div style={{ border: '1px solid #0f0', padding: '15px', fontSize: '0.7rem' }}>
            <div style={{marginBottom:'10px', borderBottom:'1px solid #333'}}>DETECTION_FACTORS</div>
            <div style={{display:'flex', justifyContent:'space-between'}}><span>INFO_BURST:</span><span>{data.factors?.burst}%</span></div>
            <div style={{display:'flex', justifyContent:'space-between'}}><span>EXPERT_PREDICT:</span><span>{data.factors?.expert}%</span></div>
            <div style={{display:'flex', justifyContent:'space-between'}}><span>SIGNAL_VOLUME:</span><span>{data.factors?.volume}</span></div>
            
            <div style={{marginTop:'15px', height:'4px', width:'100%', background:'#111', position:'relative'}}>
               <div style={{height:'100%', background:'#0f0', width: `${data.factors?.burst * 3.3}%`, transition: 'width 1s'}}></div>
            </div>
            <div style={{fontSize:'0.5rem', marginTop:'5px'}}>DATA_VELOCITY_TRACKER</div>
          </div>
        </aside>

        <main style={{ flexGrow: 1, border: '1px solid #0f0', padding: '10px', marginLeft: '10px' }}>
          <div style={{fontSize:'0.7rem', borderBottom:'1px solid #0f0', marginBottom:'10px', paddingBottom:'5px'}}>&gt; HYBRID_INTELLIGENCE_FEED</div>
          {data.signals?.map((s, i) => (
            <div key={i} style={{ marginBottom: '12px', borderBottom: '1px solid #111', paddingBottom: '5px' }}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.6rem'}}>
                <span style={{color: s.color, fontWeight: s.isExpert ? 'bold' : 'normal'}}>
                  [{s.importance}] {s.isExpert && '★ EXPERT_ANALYSIS'}
                </span>
                <span style={{opacity:0.5}}>{s.time}</span>
              </div>
              <div style={{fontSize:'0.85rem', marginTop:'3px'}}>{s.title}</div>
            </div>
          ))}
        </main>
      </div>

      <style jsx global>{`
        .grid { display: flex; flex-direction: row; }
        @media (max-width: 768px) { .grid { flex-direction: column; } aside { width: 100% !important; } main { margin-left: 0 !important; margin-top: 10px; } }
        body { background: #000; margin: 0; }
      `}</style>
    </div>
  );
}
