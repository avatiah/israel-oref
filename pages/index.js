import React, { useEffect, useState, useRef } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  // Используем ref для хранения последнего успешного состояния, чтобы не мигало при ошибках
  const lastValidData = useRef(null);

  const fetchIntel = async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error("API_UNAVAILABLE");
      
      const json = await res.json();
      
      // Проверка на корректность структуры
      if (json && json.nodes && json.nodes.length > 0) {
        lastValidData.current = json;
        setData(json);
        setErrorCount(0);
      }
    } catch (e) {
      console.warn("RECOVERY_MODE: Holding last known state due to sync error.");
      setErrorCount(prev => prev + 1);
      // Если API упал, но у нас есть старые данные в ref — восстанавливаем их
      if (lastValidData.current) {
        setData(lastValidData.current);
      }
    }
  };

  useEffect(() => {
    fetchIntel();
    const timer = setInterval(fetchIntel, 12000); // Оптимальный интервал 12 сек
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div style={s.loader}>{">"} ACCESSING_INTEL_STREAM...</div>;

  return (
    <div style={s.container}>
      {/* HEADER */}
      <header style={s.header}>
        <div>
          <h1 style={s.logo}>MADAD HAOREF</h1>
          <div style={s.meta}>SECURITY_ANALYSIS_TERMINAL // V10.4_STABLE</div>
        </div>
        <div style={s.statusBlock}>
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

            {/* NEWS STREAM FOR THIS INDEX */}
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

            {/* METHODOLOGY BLOCK */}
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

      {/* STRATEGIC FORECAST */}
      <div style={s.forecastBox}>
        <h3 style={s.forecastTitle}>⚠️ СТРАТЕГИЧЕСКИЙ ПРОГНОЗ: {data.prediction?.date}</h3>
        <p style={s.forecastText}>
          ТЕКУЩИЙ ВЕКТОР: <strong style={{color:'#ff3e3e'}}>{data.prediction?.status}</strong>. <br/>
          При срыве «Маскатского протокола» (Оман) риск удара США вырастет до <strong>{data.prediction?.impact}%</strong>. 
          Это приведет к автоматической коррекции всех оборонных индексов региона.
        </p>
      </div>

      {/* DISCLAIMER / FOOTER */}
      <footer style={s.footer}>
        <p style={s.disclaimerText}>
          <strong>ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ:</strong> ДАННЫЙ РЕСУРС ЯВЛЯЕТСЯ АГРЕГАТОРОМ ОТКРЫТЫХ ДАННЫХ (OSINT). 
          ВСЕ РАСЧЕТЫ ЯВЛЯЮТСЯ ВЕРОЯТНОСТНЫМИ МОДЕЛЯМИ НА ОСНОВЕ АНАЛИЗА МЕДИА-ПОТОКОВ И ОТЧЕТОВ СПЕЦИАЛИСТОВ. 
          ИНФОРМАЦИЯ НЕ ЯВЛЯЕТСЯ ОФИЦИАЛЬНЫМ ПРИЗЫВОМ К ДЕЙСТВИЮ ИЛИ ДИРЕКТИВОЙ СЛУЖБ БЕЗОПАСНОСТИ.
        </p>
        <div style={s.footerMeta}>MADAD HAOREF © 2026 // PERSISTENT_DATA_PROTOCOL_ACTIVE</div>
      </footer>
    </div>
  );
}

// STYLES
const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', minHeight: '100vh', padding: '20px', textTransform: 'uppercase' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px', marginBottom: '30px' },
  logo: { fontSize: '24px', letterSpacing: '3px', margin: 0, fontWeight: 'bold' },
  meta: { fontSize: '10px', color: '#444', marginTop: '5px' },
  statusBlock: { textAlign: 'right' },
  statusText: { fontSize: '11px', marginBottom: '5px' },
  time: { fontSize: '10px', color: '#888' },
  grid: { maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { border: '1px solid #222', padding: '20px', background: '#050505', position: 'relative' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  nodeTitle: { fontSize: '14px', color: '#888', fontWeight: 'bold' },
  value: { fontSize: '52px', fontWeight: 'bold' },
  newsSection: { borderLeft: '2px solid #1a1a1a', paddingLeft: '15px', marginBottom: '20px' },
  sectionLabel: { fontSize: '10px', color: '#0f4', marginBottom: '10px', fontWeight: 'bold' },
  newsList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  newsItem: { fontSize: '12px', color: '#ccc', textTransform: 'none', lineHeight: '1.4' },
  newsSrc: { color: '#0f4', fontWeight: 'bold', marginRight: '5px' },
  infoBox: { borderTop: '1px solid #111', paddingTop: '15px' },
  infoRow: { display: 'flex', marginBottom: '5px', fontSize: '9px' },
  infoLabel: { color: '#444', width: '100px', flexShrink: 0 },
  infoVal: { color: '#666', textTransform: 'none' },
  forecastBox: { maxWidth: '750px', margin: '30px auto', border: '1px solid #400', padding: '20px', background: '#0a0000' },
  forecastTitle: { fontSize: '14px', color: '#ff3e3e', margin: '0 0 10px 0' },
  forecastText: { fontSize: '13px', textTransform: 'none', color: '#eee', lineHeight: '1.5' },
  footer: { maxWidth: '750px', margin: '50px auto 0', borderTop: '1px solid #111', paddingTop: '20px' },
  disclaimerText: { fontSize: '9px', color: '#333', textAlign: 'justify', lineHeight: '1.4', textTransform: 'none' },
  footerMeta: { textAlign: 'center', fontSize: '9px', color: '#1a1a1a', marginTop: '15px' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f4', background: '#000' }
};
