import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d)).catch(() => {});
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>INITIALIZING STRATEGIC OSINT FEED...</div>;

  const Gauge = ({ value, label, color, size="180px" }) => (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ width: size, height: `calc(${size} / 2)`, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
        <div style={{ width: size, height: size, borderRadius: '50%', border: '10px solid #111', borderTopColor: color, borderRightColor: color, transform: 'rotate(45deg)', position: 'absolute' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', width: '2px', height: '70px', background: '#fff', transformOrigin: 'bottom center', transform: `rotate(${(value / 100) * 180 - 90}deg)`, transition: 'transform 1.5s' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, fontSize: '2rem', fontWeight: 'bold', color: color }}>{value}%</div>
      </div>
      <div style={{ fontSize: '0.7rem', color: '#fff', marginTop: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>{label}</div>
    </div>
  );

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '20px', fontSize: '12px' }}>
      
      <header style={{ borderBottom: '2px solid #f00', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', fontWeight: '900' }}>MADAD OREF // PRECISION OSINT</h1>
          <div style={{ fontSize: '0.65rem', color: '#666' }}>HORIZON: 24-48 HOURS // VERSION: V30_ELITE</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#f00', fontWeight: 'bold' }}>
          LAST_SYNC: {new Date(data.updated).toLocaleTimeString()} // LIVE_THREAT_INDEX
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
        
        {/* LEFT: MAIN GAUGES */}
        <div style={{ border: '1px solid #222', padding: '20px', background: '#050505', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <Gauge value={data.index} label="GENERAL ESCALATION INDEX" color={data.index > 70 ? '#f00' : '#f90'} size="220px" />
          <Gauge value={data.us_iran.val} label="U.S. STRIKE PROBABILITY" color="#f00" size="180px" />
        </div>

        {/* RIGHT: CALCULATION RATIONALE */}
        <div style={{ border: '1px solid #222', padding: '20px', background: '#080808' }}>
          <div style={{ color: '#f00', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #300', paddingBottom: '5px' }}>&gt; CALCULATION RATIONALE</div>
          {data.us_iran.breakdown.map((item, i) => (
            <div key={i} style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: '#999' }}>[STAT] {item.label}:</span>
              <span style={{ color: '#f00', fontWeight: 'bold' }}>{item.val}</span>
            </div>
          ))}
          <div style={{ marginTop: '20px', padding: '10px', border: '1px dashed #333', fontSize: '0.7rem', color: '#666' }}>
            * Current market stability (Oil/ILS) is acting as a minor suppressor to the escalation index.
          </div>
        </div>

        {/* FULL WIDTH: MARKET & EXPERTS */}
        <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
          
          <div style={{ border: '1px solid #222', padding: '15px', background: '#050505' }}>
            <div style={{ color: '#f90', fontWeight: 'bold', marginBottom: '10px' }}>&gt; MARKET INDICATORS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>BRENT CRUDE: <span style={{color:'#fff'}}>${data.markets.brent}</span></div>
              <div>USD/ILS: <span style={{color:'#fff'}}>{data.markets.ils}</span></div>
              <div>POLYMARKET (JUNE 30): <span style={{color:'#fff'}}>{data.markets.poly}</span></div>
            </div>
          </div>

          <div style={{ border: '1px solid #222', padding: '15px', background: '#050505' }}>
            <div style={{ color: '#f90', fontWeight: 'bold', marginBottom: '10px' }}>&gt; VERIFIED EXPERT ANALYTICS (ISW / IISS)</div>
            {data.experts.map((e, i) => (
              <div key={i} style={{ fontSize: '0.75rem', marginBottom: '8px', display: 'flex', gap: '10px' }}>
                <span style={{ background: '#333', color: '#fff', padding: '0 4px', height: 'fit-content' }}>{e.org}</span>
                <span style={{ color: '#bbb' }}>{e.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LOGS */}
        <div style={{ gridColumn: 'span 2', border: '1px solid #222', padding: '15px', background: '#050505' }}>
          <div style={{ color: '#444', fontWeight: 'bold', marginBottom: '10px' }}>&gt; RAW_SIGNAL_FEED:</div>
          {data.logs.map((l, i) => (
            <div key={i} style={{ fontSize: '0.7rem', color: '#555', padding: '3px 0', borderBottom: '1px solid #111' }}>
              [{i+1}] {l}
            </div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: '30px', borderTop: '1px solid #222', paddingTop: '15px', fontSize: '0.65rem', color: '#444', textAlign: 'center', lineHeight: '1.5' }}>
        <strong>DISCLAIMER:</strong> AGGREGATED OSINT DATA. FOR SITUATIONAL AWARENESS ONLY. NOT OFFICIAL MILITARY OR GOVERNMENT GUIDANCE. <br/>
        <strong>SOURCES:</strong> ISW (INSTITUTE FOR THE STUDY OF WAR), IISS, POLYMARKET, REUTERS, BLOOMBERG (BRENT), BANK OF ISRAEL (ILS).
      </footer>
    </div>
  );
}
