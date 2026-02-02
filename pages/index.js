// ... (оставляем компонент Gauge из предыдущего ответа без изменений)

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div className="loading">SYNCING_OSINT_V40...</div>;

  return (
    <div className="dashboard">
      {/* ... (Верхняя часть: Gauges, Tracker, Timeline - остаются без изменений) ... */}

      {/* НОВЫЙ ДИНАМИЧЕСКИЙ БЛОК RAW_SIGNAL_FEED */}
      <section className="card signal-monitor">
        <div className="section-title green">RAW_SIGNAL_STREAM // NO_API_FREE_MODE</div>
        <div className="feed-container">
          <div className="feed-scroll">
            {data.feed.map((signal, i) => (
              <div key={i} className="signal-row">
                <span className="timestamp">[{new Date().toLocaleTimeString()}]</span>
                <span className="content">{signal}</span>
              </div>
            ))}
            {/* Дублируем для эффекта бесконечного потока, если данных мало */}
            <div className="signal-row sys-msg">[SYSTEM] Monitoring ADS-B, NASA FIRMS, and Maritime AIS...</div>
          </div>
        </div>
      </section>

      {/* ОСТАЛЬНЫЕ БЛОКИ (Experts, Markets, Footer) - НЕ УДАЛЯТЬ */}
      <section className="card">
        <div className="section-title green">VERIFIED EXPERT ANALYTICS</div>
        {data.experts.map((e, i) => (
          <div key={i} className="expert-item">
            <span className={`tag ${e.type}`}>{e.type}</span>
            <b className="white">[{e.org}]</b> <span className="white">{e.text}</span>
          </div>
        ))}
      </section>

      <footer className="footer white">
        <strong>DISCLAIMER:</strong> Free OSINT stream. No official military standing. 
      </footer>

      <style jsx global>{`
        /* ... твои основные стили ... */
        
        .signal-monitor { 
          background: #020202; 
          border: 1px solid #0f0; /* Зеленая рамка подчеркивает OSINT поток */
          box-shadow: inset 0 0 10px #003300;
        }
        
        .feed-container {
          height: 180px;
          overflow-y: auto;
          font-size: 0.7rem;
          padding: 5px;
          scrollbar-width: thin;
          scrollbar-color: #0f0 #000;
        }

        .signal-row {
          padding: 4px 0;
          border-bottom: 1px solid #111;
          display: flex;
          gap: 10px;
          animation: scanline 0.5s ease-out;
        }

        .timestamp { color: #555; font-weight: bold; }
        .content { color: #00FF00; }
        .sys-msg { color: #FF0000; font-style: italic; }

        @keyframes scanline {
          from { opacity: 0; transform: translateX(-5px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Кастомизация скроллбара для стиля OSINT */
        .feed-container::-webkit-scrollbar { width: 4px; }
        .feed-container::-webkit-scrollbar-track { background: #000; }
        .feed-container::-webkit-scrollbar-thumb { background: #0f0; }
      `}</style>
    </div>
  );
}
