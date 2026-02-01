import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(d => d && setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; AGGREGATING_EXPERT_DATA...</div>;

  const SectorBox = ({ title, signals }) => (
    <div style={{ border: '1px solid #0f0', padding: '15px', background: '#010' }}>
      <div style={{ fontSize: '0.7rem', borderBottom: '1px solid #0f0', paddingBottom: '5px', marginBottom: '10px', color: '#0f0', fontWeight: 'bold' }}>
        &gt; {title} ({signals.length})
      </div>
      {signals.length > 0 ? signals.slice(0, 3).map((s, i) => (
        <div key={i} style={{ marginBottom: '10px', fontSize: '0.85rem', lineHeight: '1.2' }}>
          <span style={{ opacity: 0.5, fontSize: '0.6rem' }}>[{s.time}]</span> {s.text}
        </div>
      )) : <div style={{ opacity: 0.3, fontSize: '0.7rem' }}>NO_CRITICAL_SIGNALS</div>}
    </div>
  );

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '15px' }}>
      {/* HEADER */}
      <header style={{ border: '2px solid #0f0', padding: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '2px' }}>STRATEGIC_SURVEILLANCE_CENTER</h1>
          <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>SOURCE: MULTI-CHANNEL_OSINT_ANALYSIS</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: data.index > 70 ? '#f00' : '#0f0' }}>{data.index}%</div>
          <div style={{ fontSize: '0.6rem' }}>THREAT_INDEX</div>
        </div>
      </header>

      {/* VERDICT BAR */}
      <div style={{ background: data.index > 70 ? '#300' : '#020', border: '1px solid #0f0', padding: '10px', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>
        SENTIMENT_VERDICT: {data.verdict}
      </div>

      {/* SECTOR GRID */}
      <div className="sector-grid">
        <SectorBox title="MILITARY_OPERATIONS" signals={data.sectors.MILITARY_OPS} />
        <SectorBox title="STRATEGIC_INTELLIGENCE" signals={data.sectors.STRATEGIC_INTEL} />
        <SectorBox title="MARKET_&_CYBER" signals={data.sectors.CYBER_MARKET} />
      </div>

      <style jsx global>{`
        .sector-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
        @media (max-width: 900px) { .sector-grid { grid-template-columns: 1fr; } }
        body { background: #000; margin: 0; }
      `}</style>
    </div>
  );
}
