import React, { useEffect, useState, useRef } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const lastValidData = useRef(null);

  const fetchIntel = async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error("SYNC_LOST");
      const json = await res.json();
      if (json && json.nodes) {
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
    const timer = setInterval(fetchIntel, 10000);
    return () => clearInterval(timer);
  }, []);

  // Если данных нет совсем, показываем загрузку, но не блокируем экран при обновлениях
  if (!data && errorCount === 0) return <div style={s.loader}>{">"} ACCESSING_INTEL_STREAM...</div>;

  return (
    <div style={s.container}>
      {/* HEADER - СТРОГО ЦЕНТР */}
      <header style={s.header}>
        <h1 style={s.logo}>MADAD HAOREF</h1>
        <div style={s.statusBlock}>
          <div style={s.meta}>SECURITY_ANALYSIS_TERMINAL // V11.0</div>
          <div style={s.statusText}>
            STATUS: <span style={{color: errorCount > 0 ? '#ff3e3e' : '#0f4'}}>
              {errorCount > 0 ? 'RECONNECTING_TO_NODES...' : 'LIVE_ENCRYPTED'}
            </span>
          </div>
          <div style={s.time}>{data ? new Date(data.timestamp).toLocaleTimeString() : '--:--:--'} UTC</div>
        </div>
      </header>

      {/* MAIN CONTENT - АДАПТИВНАЯ СЕТКА */}
      <main style={s.grid}>
        {data?.nodes?.map(node => (
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
                <span style={s.infoLabel}>ИСТОЧНИКИ:</span> 
                <span style={s.infoVal}>{node.source || 'GDELT, ISW, CENTCOM'}</span>
              </div>
              <div style={s.infoRow}>
                <span style={s.infoLabel}>МЕТОДОЛОГИЯ:</span> 
                <span style={s.infoVal}>{node.method}</span>
              </div>
            </div>
          </div>
        ))}

        {/* STRATEGIC FORECAST */}
        <div style={s.forecastBox}>
          <h3 style={s.forecastTitle}>⚠️ ПРОГНОЗ: {data?.prediction?.date || '06.02'}</h3>
          <p style={s.forecastText}>
            ВЕКТОР: <strong style={{color:'#ff3e3e'}}>{data?.prediction?.status || 'ANALYZING'}</strong>. <br/>
            При срыве протокола в Омане риск удара вырастет до <strong>{data?.prediction?.impact || '--'}%</strong>.
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer style={s.footer}>
        <p style={s.disclaimerText}>
          <strong>ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ:</strong> OSINT-АГРЕГАТОР. НЕ ЯВЛЯЕТСЯ ОФИЦИАЛЬНОЙ ДИРЕКТИВОЙ.
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
    padding: '40px 15px', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  header: { 
    textAlign: 'center', 
    marginBottom: '40px',
    width: '100%',
    maxWidth: '650px'
  },
  logo: { 
    fontSize: 'clamp(22px, 7vw, 36px)', 
    letterSpacing: '5px', 
    fontWeight: 'bold', 
    margin: '0 0 10px 0' 
  },
  statusBlock: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    gap: '4px' 
  },
  meta: { fontSize: '11px', color: '#00cc00' }, // Зеленый вместо серого
  statusText: { fontSize: '11px', fontWeight: 'bold' },
  time: { fontSize: '10px', color: '#008800' },

  grid: { 
    width: '100%', 
    maxWidth: '650px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px' 
  },
  card: { 
    border: '1px solid #004400', 
    padding: '20px', 
    background: '#050505' 
  },
  cardTop: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '20px' 
  },
  nodeTitle: { 
    fontSize: 'clamp(11px, 3vw, 14px)', 
    color: '#fff', // Белый для контраста
    fontWeight: 'bold' 
  },
  value: { 
    fontSize: 'clamp(36px, 10vw, 56px)', 
    fontWeight: 'bold' 
  },

  newsSection: { 
    borderLeft: '2px solid #004400', 
    paddingLeft: '15px', 
    marginBottom: '20px' 
  },
  sectionLabel: { fontSize: '10px', color: '#0f4', marginBottom: '10px' },
  newsList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  newsItem: { 
    fontSize: '13px', 
    color: '#ffffff', // Чистый белый для мобилок
    textTransform: 'none', 
    lineHeight: '1.4' 
  },
  newsSrc: { color: '#0f4', fontWeight: 'bold' },

  infoBox: { borderTop: '1px solid #1a1a1a', paddingTop: '15px' },
  infoRow: { display: 'flex', marginBottom: '5px', fontSize: '10px' },
  infoLabel: { color: '#0f4', width: '100px', flexShrink: 0 },
  infoVal: { color: '#ffffff', textTransform: 'none' },

  forecastBox: { 
    border: '1px solid #600', 
    padding: '20px', 
    background: '#100000', 
    marginTop: '10px' 
  },
  forecastTitle: { fontSize: '15px', color: '#ff3e3e', margin: '0 0 10px 0' },
  forecastText: { fontSize: '13px', textTransform: 'none', color: '#fff', lineHeight: '1.5' },

  footer: { 
    width: '100%', 
    maxWidth: '650px', 
    marginTop: '50px', 
    textAlign: 'center', 
    borderTop: '1px solid #1a1a1a', 
    paddingTop: '20px' 
  },
  disclaimerText: { fontSize: '10px', color: '#008800', textTransform: 'none' },
  footerMeta: { fontSize: '9px', color: '#004400', marginTop: '10px' },

  loader: { 
    height: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    background: '#000', 
    color: '#0f4' 
  }
};
