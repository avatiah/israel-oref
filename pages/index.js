import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>V30_WAR_ROOM_BOOTING...</div>;

  const Gauge = ({ value, label, color }) => (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ width: '180px', height: '90px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
        <div style={{ width: '180px', height: '180px', borderRadius: '50%', border: '10px solid #111', borderTopColor: color, borderRightColor: color, transform: 'rotate(45deg)', position: 'absolute' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', width: '2px', height: '75px', background: '#fff', transformOrigin: 'bottom center', transform: `rotate(${(value / 100) * 180 - 90}deg)`, transition: 'transform 1.5s' }}></div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, fontSize: '2rem', fontWeight: 'bold', color: color }}>{value}%</div>
      </div>
      <div style={{ fontSize: '0.7rem', color: '#fff', marginTop: '10px', fontWeight: 'bold' }}>{label}</div>
    </div>
  );

  const getColor = (v) => v > 70 ? '#f00' : v > 40 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '20px', fontSize: '12px' }}>
      
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '1.6rem', letterSpacing: '2px' }}>MADAD OREF</h1>
          <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>STRATEGIC COMMAND CENTER // 02 FEB 2026</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.6rem', opacity: 0.5 }}>SYNC_TIME: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* DUAL GAUGES */}
        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '20px', border: '1px solid #222', padding: '30px 10px', background: '#050505' }}>
          <Gauge value={data.index} label="GENERAL THREAT (ISR)" color={getColor(data.index)} />
          <Gauge value={data.us_iran.val} label="U.S. STRIKE ON IRAN" color="#f00" />
        </div>

        {/* US-IRAN RATIONALE */}
        <div style={{ gridColumn: 'span 2', border: '1px solid #300', padding: '15px', background: '#0a0000' }}>
          <div style={{ color: '#f00', fontWeight: 'bold', marginBottom: '8px' }}>&gt; U.S. vs IRAN STRIKE RATIONALE:</div>
          <p style={{ fontSize: '0.7rem', color: '#aaa', margin: 0 }}>{data.us_iran.rationale}</p>
        </div>

        {/* MARKET DATA */}
        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-around', border: '1px solid #222', padding: '12px', background: '#050505' }}>
          <div>BRENT OIL: <b style={{color: '#fff'}}>${data.markets.brent}</b></div>
          <div>USD/ILS: <b style={{color: '#fff'}}>{data.markets.ils}</b></div>
          <div>POLYMARKET: <b style={{color: '#fff'}}>{data.markets.poly}</b></div>
        </div>

        {/* EXPERTS */}
        <div style={{ gridColumn: 'span 2', border: '1px solid #222', padding: '15px', background: '#050505' }}>
          <div style={{ color: '#f90', marginBottom: '10px', fontWeight: 'bold' }}>&gt; EXPERT ANALYSIS (ISW / IISS):</div>
          {data.experts.map((e, i) => (
            <div key={i} style={{ fontSize: '0.7rem', marginBottom: '8px' }}><span style={{ color: '#fff', border: '1px solid #444', padding: '0 4px', marginRight: '8px' }}>{e.org}</span> {e.text}</div>
          ))}
        </div>

        {/* LOGS */}
        <div style={{ gridColumn: 'span 2', border: '1px solid #222', padding: '15px', background: '#050505', opacity: 0.6 }}>
          <div style={{ marginBottom: '8px' }}>&gt; RAW_SIGNAL_FEED:</div>
          {data.logs.map((l, i) => (
            <div key={i} style={{ fontSize: '0.6rem', padding: '3px 0', borderBottom: '1px solid #111' }}>[{i+1}] {l}</div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: '30px', borderTop: '1px solid #222', paddingTop: '15px', fontSize: '0.6rem', color: '#444', textAlign: 'center' }}>
        <strong>DISCLAIMER:</strong> AGGREGATED OSINT DATA. NOT OFFICIAL MILITARY GUIDANCE. SOURCES: ISW, IISS, POLYMARKET.
      </footer>
    </div>
  );
}
