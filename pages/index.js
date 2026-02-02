import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d)).catch(() => {});
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>BOOTING V32_STRATCOM...</div>;

  const Gauge = ({ value, label, color }) => (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ width: '180px', height: '90px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
        <div style={{ width: '180px', height: '180px', borderRadius: '50%', border: '12px solid #111', borderTopColor: color, borderRightColor: color, transform: 'rotate(45deg)', position: 'absolute' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', width: '2px', height: '75px', background: '#fff', transformOrigin: 'bottom center', transform: `rotate(${(value / 100) * 180 - 90}deg)`, transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, fontSize: '2.2rem', fontWeight: '900', color: color }}>{value}%</div>
      </div>
      <div style={{ fontSize: '0.7rem', color: '#fff', marginTop: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>{label}</div>
    </div>
  );

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '15px', maxWidth: '600px', margin: '0 auto', borderLeft: '1px solid #222', borderRight: '1px solid #222' }}>
      
      {/* HEADER */}
      <header style={{ borderBottom: '2px solid #f00', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: 'bold' }}>MADAD OREF // STRATCOM</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#666' }}>
          <span>ID: OSINT-V32-ELITE</span>
          <span>DATE: 02 FEB 2026 // {new Date(data.updated).toLocaleTimeString()}</span>
        </div>
      </header>

      {/* GAUGES SECTION */}
      <section style={{ display: 'flex', gap: '15px', marginBottom: '30px', background: '#050505', padding: '20px 0', border: '1px solid #111' }}>
        <Gauge value={data.index} label="GENERAL ESCALATION" color={data.index > 70 ? '#f00' : '#f90'} />
        <Gauge value={data.us_iran.val} label="U.S. STRIKE PROB" color="#f00" />
      </section>

      {/* TIMELINE PROJECTION */}
      <section style={{ border: '1px solid #222', padding: '12px', background: '#080808', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.65rem', color: '#f00', fontWeight: 'bold', marginBottom: '8px' }}>&gt; ESCALATION TIMELINE (PROJECTION):</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem' }}>
          <span>NOW: <b style={{color:'#fff'}}>{data.index}%</b></span>
          <span style={{color:'#333'}}>|</span>
          <span>+24H: <b style={{color:'#fff'}}>~{Math.round(data.index * 1.08)}%</b></span>
          <span style={{color:'#333'}}>|</span>
          <span>+72H: <b style={{color:'#fff'}}>~{Math.round(data.index * 0.95)}%</b></span>
        </div>
      </section>

      {/* RATIONALE BLOCK */}
      <section style={{ border: '1px solid #400', padding: '15px', background: '#0a0000', marginBottom: '20px' }}>
        <div style={{ color: '#f00', fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '10px' }}>&gt; U.S. vs IRAN: STRIKE RATIONALE</div>
        {data.us_iran.breakdown.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '6px', borderBottom: '1px solid #1a0000' }}>
            <span style={{ color: '#888' }}>{item.label}</span>
            <span style={{ color: '#f00', fontWeight: 'bold' }}>{item.val}</span>
          </div>
        ))}
      </section>

      {/* MARKET INDICATORS */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #222', padding: '10px', background: '#050505' }}>
          <div style={{ fontSize: '0.55rem', color: '#666' }}>BRENT_OIL</div>
          <div style={{ fontSize: '0.9rem', color: '#fff' }}>${data.markets.brent}</div>
        </div>
        <div style={{ border: '1px solid #222', padding: '10px', background: '#050505' }}>
          <div style={{ fontSize: '0.55rem', color: '#666' }}>USD/ILS</div>
          <div style={{ fontSize: '0.9rem', color: '#fff' }}>{data.markets.ils}</div>
        </div>
        <div style={{ gridColumn: 'span 2', border: '1px solid #222', padding: '10px', background: '#050505', fontSize: '0.65rem' }}>
          POLYMARKET: <span style={{color:'#fff'}}>JUNE 30: {data.markets.poly_june} // TODAY: {data.markets.poly_today}</span>
        </div>
      </section>

      {/* EXPERT INTEL COMMUNITY - EXTENDED */}
      <section style={{ border: '1px solid #222', padding: '15px', marginBottom: '20px', background: '#050505' }}>
        <div style={{ color: '#f90', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '12px' }}>&gt; EXPERT_INTEL_ANALYSIS (5 SOURCES):</div>
        {data.experts.map((e, i) => (
          <div key={i} style={{ fontSize: '0.65rem', color: '#bbb', marginBottom: '10px', borderLeft: '2px solid #f90', paddingLeft: '10px', lineHeight: '1.3' }}>
             <b style={{color:'#fff'}}>{e.org}:</b> {e.text}
          </div>
        ))}
      </section>

      {/* RAW SIGNAL LOG */}
      <section style={{ border: '1px solid #222', padding: '15px', background: '#050505', opacity: 0.7 }}>
        <div style={{ color: '#444', fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '10px' }}>&gt; RAW_SIGNAL_LOG (LATEST SATELLITE/RSS):</div>
        {data.logs.map((l, i) => (
          <div key={i} style={{ fontSize: '0.6rem', color: '#666', padding: '4px 0', borderBottom: '1px solid #111' }}>
            [{i+1}] {l}
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer style={{ marginTop: '20px', borderTop: '1px solid #222', paddingTop: '15px', fontSize: '0.55rem', color: '#333', textAlign: 'center' }}>
        <strong>SOURCE_AUTH:</strong> ISW, IISS, SOUFAN CENTER, POLYMARKET, REUTERS. <br/>
        AGGREGATED OSINT DATA. NOT OFFICIAL GOVERNMENT GUIDANCE.
      </footer>
    </div>
  );
}
