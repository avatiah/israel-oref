import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; CALIBRATING_SENTIMENT_SENSORS...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '10px' }}>
      {/* SENTIMENT RADAR BLOCK */}
      <div style={{ border: '2px solid', borderColor: data.index > 65 ? '#f00' : '#0f0', padding: '10px', marginBottom: '10px', textAlign: 'center', background: data.index > 65 ? '#200' : '#010' }}>
        <div style={{fontSize: '0.6rem', marginBottom: '5px'}}>AI_SENTIMENT_RADAR // FINAL_VERDICT</div>
        <div style={{fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '2px'}}>
          &gt; {data.verdict} &lt;
        </div>
      </div>

      <div className="main-grid" style={{display:'flex', gap:'10px'}}>
        <aside style={{width: '260px'}}>
          <div style={{border:'1px solid #0f0', padding:'15px', textAlign:'center', marginBottom:'10px'}}>
            <div style={{fontSize:'0.6rem', opacity:0.6}}>AGGREGATED_THREAT</div>
            <div style={{fontSize:'3.5rem', fontWeight:'bold', color: data.index > 70 ? '#f00' : '#0f0'}}>{data.index}%</div>
          </div>
          
          <div style={{border:'1px solid #0f0', padding:'10px', fontSize:'0.6rem'}}>
            <div style={{marginBottom:'5px'}}>DETECTION_FACTORS</div>
            <div>VOLATILITY: {data.factors?.burst}%</div>
            <div>SENTIMENT: {data.factors?.sentiment} pts</div>
          </div>
        </aside>

        <main style={{flexGrow: 1, border:'1px solid #0f0', padding:'10px'}}>
          <div style={{fontSize:'0.7rem', borderBottom:'1px solid #0f0', paddingBottom:'5px', marginBottom:'10px'}}>HYBRID_INTELLIGENCE_STREAM</div>
          {data.signals?.map((s, i) => (
            <div key={i} style={{marginBottom:'8px', fontSize:'0.8rem', borderBottom:'1px solid #111', paddingBottom:'4px'}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.55rem', opacity:0.6}}>
                <span>{s.isExpert ? '★ EXPERT_ANALYSIS' : 'NEWS_SIGNAL'}</span>
                <span>{s.time}</span>
              </div>
              {s.title}
            </div>
          ))}
        </main>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) { .main-grid { flex-direction: column !important; } aside { width: 100% !important; } }
        body { background: #000; margin: 0; }
      `}</style>
    </div>
  );
}
