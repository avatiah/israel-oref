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

  // Simple function to convert value to rotation angle (0-180 degrees for half-circle gauge)
  const getNeedleRotation = (value) => {
    return (value / 100) * 180;
  };

  return (
    <div className="container">
      <header className="header">
        <div className="title">MADAD_HAOREF</div>
      </header>

      <div className="gauges">
        <div className="gauge-container">
          <div className="gauge-label">TOTAL RISK ISRAEL</div>
          <div className="gauge">
            <div className="gauge-body">
              <div className="gauge-fill" style={{ background: 'conic-gradient(#0f0 0deg 60deg, #ff0 60deg 120deg, #f00 120deg 180deg)' }}></div>
              <div className="gauge-center"></div>
              <div
                className="gauge-needle"
                style={{ transform: `rotate(${getNeedleRotation(data.risk_index)}deg)` }}
              ></div>
            </div>
            <div className="gauge-value">{data.risk_index}%</div>
          </div>
        </div>

        <div className="gauge-container">
          <div className="gauge-label">US-IRAN STRIKE PROBABILITY</div>
          <div className="gauge">
            <div className="gauge-body">
              <div className="gauge-fill" style={{ background: 'conic-gradient(#0f0 0deg 60deg, #ff0 60deg 120deg, #f00 120deg 180deg)' }}></div>
              <div className="gauge-center"></div>
              <div
                className="gauge-needle"
                style={{ transform: `rotate(${getNeedleRotation(data.iran_us_strike_prob)}deg)` }}
              ></div>
            </div>
            <div className="gauge-value">{data.iran_us_strike_prob}%</div>
          </div>
        </div>
      </div>

      <div className="sub-bar">
        <span>STATUS: <b className="green">DATA_STREAM_SYNCED</b></span>
      </div>

      <main className="content">
        <div className="label">LATEST VERIFIED INTEL (open-source expert analyses)</div>

        {data.reports?.length > 0 ? (
          data.reports.map((item, i) => (
            <article key={i} className="intel-card">
              <div className="meta">
                <span className="src">{item.agency.toUpperCase()}</span>
                <span className="time">{new Date(item.ts).toLocaleTimeString()}</span>
              </div>
              <h3 className="intel-title">{item.title}</h3>
              <a href={item.link} target="_blank" rel="noreferrer" className="link">
                OPEN SOURCE REPORT →
              </a>
            </article>
          ))
        ) : (
          <div className="red">FATAL: NO_INCOMING_DATA</div>
        )}
      </main>

      <footer className="footer">
        LAST_SYNC: {new Date(data.timestamp).toLocaleString()} // NODE_ASHDOD // Sources: ISW, INSS, Atlantic Council, IsraelRadar_com etc.
      </footer>

      <style jsx global>{`
        body {
          background: #000;
          color: #fff;
          font-family: 'Courier New', monospace;
          margin: 0;
          padding: 15px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #f00;
          padding-bottom: 10px;
        }
        .title {
          font-size: 1.5rem;
          font-weight: 900;
        }
        .gauges {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 20px;
        }
        .gauge-container {
          text-align: center;
        }
        .gauge-label {
          font-size: 0.9rem;
          margin-bottom: 8px;
          color: #888;
        }
        .gauge {
          position: relative;
          width: 140px;
          height: 80px;
        }
        .gauge-body {
          width: 140px;
          height: 70px;
          background: #111;
          border-radius: 140px 140px 0 0;
          overflow: hidden;
          position: relative;
        }
        .gauge-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          transform: rotate(180deg);
        }
        .gauge-center {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 20px;
          background: #222;
          border-radius: 50%;
          border: 3px solid #444;
          z-index: 2;
        }
        .gauge-needle {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 4px;
          height: 70px;
          background: #f00;
          transform-origin: bottom center;
          transition: transform 1s ease-out;
          z-index: 3;
          border-radius: 4px 4px 0 0;
        }
        .gauge-value {
          margin-top: 8px;
          font-size: 1.2rem;
          font-weight: bold;
        }
        .red { color: #f00; text-shadow: 0 0 10px #f00; }
        .green { color: #0f0; }
        .sub-bar {
          background: #0a0a0a;
          padding: 10px;
          font-size: 0.8rem;
          border: 1px solid #1a1a1a;
          text-align: center;
        }
        .label {
          font-size: 0.7rem;
          color: #444;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        .intel-card {
          background: #050505;
          border: 1px solid #111;
          padding: 15px;
          border-left: 4px solid #f00;
        }
        .meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #0f0;
          margin-bottom: 10px;
        }
        .intel-title {
          font-size: 0.95rem;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }
        .link {
          color: #f00;
          font-size: 0.7rem;
          text-decoration: none;
          font-weight: bold;
          border-bottom: 1px solid #300;
        }
        .loading {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f00;
          font-size: 0.9rem;
        }
        .footer {
          font-size: 0.6rem;
          color: #222;
          text-align: center;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
