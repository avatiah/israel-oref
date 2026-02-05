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
      {/* HEADER - СТРОГО ПО ЦЕНТРУ */}
      <header style={s.header}>
        <h1 style={s.logo}>MADAD HAOREF</h1>
        <div style={s.statusBlock}>
          <div style={s.meta}>SECURITY_ANALYSIS_TERMINAL // V10.5_STABLE</div>
          <div style={s.statusText}>
            STATUS: <span style={{color: errorCount > 0 ? '#ff3e3e' : '#0f4'}}>
              {errorCount > 0 ? 'RECONNECTING...' : 'LIVE_ENCRYPTED'}
            </span>
          </div>
          <div style={s.time}>{new Date(data.timestamp).toLocaleTimeString()} UTC</div>
        </div>
      </header>

      {/* MAIN CONTENT */}
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
                {node.news && node.news.length > 0 ? node.news.map((item, idx) => (
                  <div key={idx} style={s.newsItem}>
                    <span style={s.newsSrc}>[{item.src}]</span> {item.txt}
                  </div>
                )) : <div style={s.newsItem}>Ожидание свежих пакетов данных...</div>}
              </div>
            </div>

            <div style={s.infoBox}>
              <div style={s.infoRow}>
                <span style={s.infoLabel}>ИСТОЧНИКИ:</span> 
                <span style={s.infoVal}>{node.source || 'GDELT, ISW, OSINT_FEED'}</span>
              </div>
              <div style={s.infoRow}>
                <span style={s.infoLabel}>МЕТОДОЛОГИЯ:</span> 
                <span style={s.infoVal}>{node.method}</span>
              </div>
            </div>
          </div>
        ))}
      </main>

      <div style={s.forecastBox}>
        <h3 style={s.forecastTitle}>⚠️ СТРАТЕГИЧЕСКИЙ ПРОГНОЗ: {data.prediction?.date}</h3>
        <p style={s.forecastText}>
          ТЕКУЩИЙ ВЕКТОР: <strong style={{color:'#ff3e3e'}}>{data.prediction?.status}</strong>. <br/>
          При срыве «Маскатского протокола» (Оман) риск удара США вырастет до <strong>{data.prediction?.impact}%</strong>.
        </p>
      </div>

      <footer style={s.footer}>
        <p style={s.disclaimerText}>
          <strong>ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ:</strong> ДАННЫЙ РЕСУРС ЯВЛЯЕТСЯ АГРЕГАТОРОМ ОТКРЫТЫХ ДАННЫХ (OSINT). 
          ИНФОРМАЦИЯ НЕ ЯВЛЯЕТСЯ ОФИЦИАЛЬНОЙ ДИРЕКТИВОЙ СЛУЖБ БЕЗОПАСНОСТИ.
        </p>
        <div style={s.footerMeta}>MADAD HAOREF © 2026 // PERSISTENT_DATA_PROTOCOL_ACTIVE</div>
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', minHeight: '100vh', padding: '40px 20px', textTransform: 'uppercase' },
  header: { textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '30px', marginBottom: '40px' },
  logo: { fontSize: '32px', letterSpacing: '6px', margin: '0 0 10px 0', fontWeight: 'bold' },
  statusBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' },
  meta: { fontSize: '12px', color: '#aaa' }, // Текст стал светлее
  statusText: { fontSize: '12px', fontWeight: 'bold' },
  time: { fontSize: '11px', color: '#888' }, // Улучшена яркость
  grid: { maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { border: '1px solid #333', padding: '25px', background: '#050505' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  nodeTitle: { fontSize: '15px', color: '#bbb', fontWeight: 'bold' }, // Был серый, стал светло-серый
  value: { fontSize: '58px', fontWeight: 'bold' },
  newsSection: { borderLeft: '2px solid #222', paddingLeft: '20px', marginBottom: '25px' },
  sectionLabel: { fontSize: '11px', color: '#0f4', marginBottom: '12px', fontWeight: 'bold' },
  newsList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  newsItem: { fontSize: '13px', color: '#eee', textTransform: 'none', lineHeight: '1.5' }, // Почти белый для чтения
  newsSrc: { color: '#0f4', fontWeight: 'bold', marginRight: '8px' },
  infoBox: { borderTop: '1px solid #222', paddingTop: '20px' },
  infoRow: { display: 'flex', marginBottom: '8px', fontSize: '10px' },
  infoLabel: { color: '#888', width: '120px', flexShrink: 0 }, // Четко видимый ярлык
  infoVal: { color: '#aaa', textTransform: 'none' }, // Читаемое значение
  forecastBox: { maxWidth: '750px', margin: '40px auto', border: '1px solid #600', padding: '25px', background: '#0d0000' },
  forecastTitle: { fontSize: '16px', color: '#ff3e3e', margin: '0 0 12px 0' },
  forecastText: { fontSize: '14px', textTransform: 'none', color: '#fff', lineHeight: '1.6' },
  footer: { maxWidth: '750px', margin: '60px auto 0', borderTop: '1px solid #222', paddingTop: '30px' },
  disclaimerText: { fontSize: '10px', color: '#666', textAlign: 'justify', lineHeight: '1.6', textTransform: 'none' }, // Читаемый дисклеймер
  footerMeta: { textAlign: 'center', fontSize: '10px', color: '#444', marginTop: '20px' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f4', background: '#000', fontSize: '14px' }
};
