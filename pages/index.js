import React, { useEffect, useState, useRef } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const lastValidData = useRef(null);

  const fetchIntel = async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error("API_UNAVAILABLE");
      const json = await res.json();
      if (json && json.nodes && json.nodes.length > 0) {
        lastValidData.current = json;
        setData(json);
        setErrorCount(0);
      }
    } catch (e) {
      setErrorCount(prev => prev + 1);
      if (lastValidData.current) setData(lastValidData.current);
    }
  };

  useEffect(() => {
    fetchIntel();
    const timer = setInterval(fetchIntel, 12000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div style={s.loader}>{">"} ACCESSING_INTEL_STREAM...</div>;

  return (
    <div style={s.container}>
      {/* HEADER - СТРОГО ЦЕНТР И АДАПТИВНОСТЬ */}
      <header style={s.header}>
        <h1 style={s.logo}>MADAD HAOREF</h1>
        <div style={s.statusBlock}>
          <div style={s.meta}>SECURITY_ANALYSIS_TERMINAL // V10.6</div>
          <div style={s.statusText}>
            STATUS: <span style={{color: errorCount > 0 ? '#ff3e3e' : '#0f4'}}>
              {errorCount > 0 ? 'RECONNECTING...' : 'LIVE_ENCRYPTED'}
            </span>
          </div>
          <div style={s.time}>{new Date(data.timestamp).toLocaleTimeString()} UTC</div>
        </div>
      </header>

      {/* MAIN CONTENT - ОГРАНИЧЕНИЕ ПО ШИРИНЕ ДЛЯ МОБИЛОК */}
      <main style={s.grid}>
        {data.nodes.map(node => (
          <div key={node.id} style={s.card}>
            <div style={s.cardTop}>
              <div style={s.nodeTitle}>{node.title}</div>
              <div style={{...s.value, color: node.value > 65 ? '#ff3e3e' : '#0f4'}}>
                {node.value}%
              </div>
            </div>

            <div style={s.newsSection}>
              <div style={s.sectionLabel}>СИГНАЛЫ И ФАКТЫ:</div>
              <div style={s.newsList}>
                {node.news?.map((item, idx) => (
                  <div key={idx} style={s.newsItem}>
                    <span style={s.newsSrc}>[{item.src}]</span> {item.txt}
                  </div>
                ))}
              </div>
            </div>

            <div style={s.infoBox}>
              <div style={s.infoRow}>
                <span style={s.infoLabel}>SOURCE:</span> 
                <span style={s.infoVal}>{node.source || 'OSINT_FEED'}</span>
              </div>
              <div style={s.infoRow}>
                <span style={s.infoLabel}>METHOD:</span> 
                <span style={s.infoVal}>{node.method}</span>
              </div>
            </div>
          </div>
        ))}
      </main>

      <div style={s.forecastBox}>
        <h3 style={s.forecastTitle}>⚠️ ПРОГНОЗ: {data.prediction?.date}</h3>
        <p style={s.forecastText}>
          ВЕКТОР: <strong style={{color:'#ff3e3e'}}>{data.prediction?.status}</strong>. <br/>
          РИСК УДАРА США: <strong>{data.prediction?.impact}%</strong>.
        </p>
      </div>

      <footer style={s.footer}>
        <p style={s.disclaimerText}>
          <strong>ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ:</strong> АГРЕГАТОР ОТКРЫТЫХ ДАННЫХ. 
          ИНФОРМАЦИЯ НЕ ЯВЛЯЕТСЯ ОФИЦИАЛЬНОЙ ДИРЕКТИВОЙ.
        </p>
        <div style={s.footerMeta}>MADAD HAOREF © 2026</div>
      </footer>
    </div>
  );
}

const s = {
  container: { 
    background: '#000', 
    color: '#0f4', 
    fontFamily: 'monospace', 
    minHeight: '100vh', 
    padding: '20px 10px', 
    textTransform: 'uppercase',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  header: { 
    textAlign: 'center', 
    width: '100%',
    maxWidth: '600px',
    borderBottom: '1px solid #333', 
    paddingBottom: '20px', 
    marginBottom: '30px' 
  },
  logo: { 
    fontSize: 'clamp(20px, 8vw, 32px)', 
    letterSpacing: '4px', 
    margin: '0 0 10px 0', 
    fontWeight: 'bold',
    width: '100%'
  },
  statusBlock: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: '5px' 
  },
  meta: { fontSize: '10px', color: '#bbb' },
  statusText: { fontSize: '11px', fontWeight: 'bold' },
  time: { fontSize: '10px', color: '#888' },
  
  grid: { 
    width: '100%',
    maxWidth: '600px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '15px' 
  },
  card: { 
    border: '1px solid #333', 
    padding: '15px', 
    background: '#050505',
    boxSizing: 'border-box'
  },
  cardTop: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '15px' 
  },
  nodeTitle: { 
    fontSize: 'clamp(10px, 3vw, 13px)', 
    color: '#bbb', 
    fontWeight: 'bold',
    maxWidth: '60%'
  },
  value: { 
    fontSize: 'clamp(30px, 10vw, 48px)', 
    fontWeight: 'bold' 
  },
  
  newsSection: { 
    borderLeft: '2px solid #222', 
    paddingLeft: '15px', 
    marginBottom: '15px' 
  },
  sectionLabel: { fontSize: '10px', color: '#0f4', marginBottom: '8px' },
  newsList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  newsItem: { 
    fontSize: 'clamp(11px, 3.5vw, 12px)', 
    color: '#eee', 
    textTransform: 'none', 
    lineHeight: '1.4' 
  },
  newsSrc: { color: '#0f4', fontWeight: 'bold' },
  
  infoBox: { 
    borderTop: '1px solid #222', 
    paddingTop: '12px' 
  },
  infoRow: { display: 'flex', marginBottom: '4px', fontSize: '9px' },
  infoLabel: { color: '#888', width: '80px', flexShrink: 0 },
  infoVal: { color: '#aaa', textTransform: 'none' },
  
  forecastBox: { 
    width: '100%',
    maxWidth: '600px', 
    border: '1px solid #600', 
    padding: '15px', 
    background: '#0d0000',
    marginTop: '20px',
    boxSizing: 'border-box'
  },
  forecastTitle: { fontSize: '14px', color: '#ff3e3e', margin: '0 0 8px 0' },
  forecastText: { fontSize: '12px', textTransform: 'none', color: '#fff' },
  
  footer: { 
    width: '100%',
    maxWidth: '600px', 
    textAlign: 'center',
    marginTop: '40px', 
    borderTop: '1px solid #222', 
    paddingTop: '20px' 
  },
  disclaimerText: { fontSize: '9px', color: '#666', textTransform: 'none' },
  footerMeta: { fontSize: '9px', color: '#333', marginTop: '10px' },
  
  loader: { 
    height: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    color: '#0f4', 
    background: '#000' 
  }
};
