import React, { useState, useEffect } from 'react';

export default function MadadTerminal() {
  const [data, setData] = useState(null);

  const sync = async () => {
    try {
      const r = await fetch('/api/data');
      const d = await r.json();
      if (d.reports) setData(d);
    } catch (e) {
      console.error("SYNC_LOST", e);
    }
  };

  useEffect(() => {
    sync();
    const interval = setInterval(sync, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="loading">RE-INITIALIZING_SYSTEM_V84...</div>;

  return (
    <div className="container">
      <header className="header">
        <div className="title">MADAD_HAOREF</div>
        <div className="risk">
          TOTAL_RISK_ISRAEL: <span className="red">{data.risk_index}%</span> (угрозы Израилю от Ирана/прокси)
          <br />
          US_IRAN_STRIKE_PROB: <span className="red">{data.iran_us_strike_prob}%</span> (вероятность удара США по Ирану)
        </div>
      </header>

      <div className="sub-bar">
        <span>STATUS: <b className="green">DATA_STREAM_SYNCED</b></span>
      </div>

      <main className="content">
        <div className="label">LATEST_VERIFIED_INTEL (открытые анализы экспертов)</div>

        {data.reports?.length > 0 ? (
          data.reports.map((item, i) => (
            <article key={i} className="intel-card">
              <div className="meta">
                <span className="src">{item.agency.toUpperCase()}</span>
                <span className="time">{new Date(item.ts).toLocaleTimeString()}</span>
              </div>
              <h3 className="intel-title">{item.title}</h3>
              <a href={item.link} target="_blank" rel="noreferrer" className="link">
                OPEN_SOURCE_REPORT →
              </a>
            </article>
          ))
        ) : (
          <div className="red">FATAL: NO_INCOMING_DATA</div>
        )}
      </main>

      <footer className="footer">
        LAST_SYNC: {new Date(data.timestamp).toLocaleString()} // NODE_ASHDOD // Источники: ISW, INSS, Atlantic Council и др.
      </footer>

      {/* Стили без изменений */}
      <style jsx global>{`...`}</style>  // Вставьте ваши стили сюда, как раньше
    </div>
  );
}
