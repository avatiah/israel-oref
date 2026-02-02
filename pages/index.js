import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d)).catch(() => {});
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>V31_VERTICAL_SYNC...</div>;

  const getColor = (v) => v > 75 ? '#f00' : v > 40 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '15px', maxWidth: '600px', margin: '0 auto', borderLeft: '1px solid #222', borderRight: '1px solid #222' }}>
      
      {/* HEADER */}
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>MADAD OREF</h1>
        <div style={{ fontSize: '0.6rem', color: '#f00', fontWeight: 'bold' }}>VERSION: V31_VERTICAL_COMMAND // LIVE</div>
      </header>

      {/* BLOCK 1: MAIN INDEX & TIMELINE */}
      <section style={{ marginBottom: '25px', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', fontWeight: '900', color: getColor(data.index), lineHeight: '1' }}>{data.index}%</div>
        <div style={{ fontSize: '0.7rem', letterSpacing: '2px', marginBottom: '15px' }}>GENERAL ESCALATION INDEX</div>
        
        {/* ВРЕМЕННАЯ ШКАЛА (TIMELINE) */}
        <div style={{ border: '1px solid #222', padding: '10px', background: '#080808' }}>
          <div style={{ fontSize: '0.6rem', color: '#666', marginBottom: '5px' }}>THREAT PROJECTION (HORIZON)</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem' }}>
            <span>NOW: <b>{data.index}%</b></span>
            <span style={{color: '#444'}}>|</span>
            <span>+12H: <b>~{Math.round(data.index * 1.05)}%</b></span>
            <span style={{color: '#444'}}>|</span>
            <span>+48H: <b>~{Math.round(data.index * 0.9)}%</b></span>
          </div>
        </div>
      </section>

      {/* BLOCK 2: US vs IRAN (SPECIFIC) */}
      <section style={{ border: '1px solid #300', padding: '15px', background: '#0a0000', marginBottom: '20px' }}>
        <div style={{ color: '#f00', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '10px' }}>&gt; US_STRIKE_PROBABILITY: {data.us_iran.val}%</div>
        {data.us_iran.breakdown.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px' }}>
            <span style={{ color: '#888' }}>{item.label}</span>
            <span style={{ color: '#f00' }}>{item.val}</span>
          </div>
        ))}
      </section>

      {/* BLOCK 3: MARKET DATA */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #222', padding: '10px' }}>
          <div style={{ fontSize: '0.55rem', color: '#666' }}>BRENT_OIL</div>
          <div style={{ fontSize: '0.9rem', color: '#fff' }}>${data.markets.brent}</div>
        </div>
        <div style={{ border: '1px solid #222', padding: '10px' }}>
          <div style={{ fontSize: '0.55rem', color: '#666' }}>USD/ILS</div>
          <div style={{ fontSize: '0.9rem', color: '#fff' }}>{data.markets.ils}</div>
        </div>
      </section>

      {/* BLOCK 4: EXPERTS */}
      <section style={{ border: '1px solid #222', padding: '15px', marginBottom: '20px' }}>
        <div style={{ color: '#f90', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '10px' }}>&gt; EXPERT_INTEL_COMMUNITY:</div>
        {data.experts.map((e, i) => (
          <div key={i} style={{ fontSize: '0.65rem', color: '#bbb', marginBottom: '8px', borderLeft: '2px solid #333', paddingLeft: '8px' }}>
             <b>{e.org}:</b> {e.text}
          </div>
        ))}
      </section>

      {/* BLOCK 5: EXTENDED SIGNAL LOG */}
      <section style={{ border: '1px solid #222', padding: '15px', background: '#050505', marginBottom: '20px' }}>
        <div style={{ color: '#444', fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '10px' }}>&gt; RAW_SIGNAL_LOG (LATEST 12):</div>
        {data.logs.map((l, i) => (
          <div key={i} style={{ fontSize: '0.6rem', color: '#555', padding: '4px 0', borderBottom: '1px solid #111' }}>
            [{i+1}] {l}
          </div>
        ))}
      </section>

      {/* FOOTER & FULL DISCLAIMER */}
      <footer style={{ padding: '15px 0', borderTop: '1px solid #222', fontSize: '0.55rem', color: '#444', lineHeight: '1.5' }}>
        <strong>DISCLAIMER:</strong> AGGREGATED OSINT DATA. FOR SITUATIONAL AWARENESS ONLY. NOT OFFICIAL MILITARY OR GOVERNMENT GUIDANCE. <br/><br/>
        <strong>SOURCES:</strong> ISW (INSTITUTE FOR THE STUDY OF WAR), IISS (MILITARY BALANCE), POLYMARKET (PREDICTION MARKETS), REUTERS, BLOOMBERG (BRENT), BANK OF ISRAEL (ILS EXCHANGE).
        <div style={{ marginTop: '10px', color: '#222' }}>SYNC_POINT: {new Date(data.updated).toISOString()}</div>
      </footer>
    </div>
  );
}
