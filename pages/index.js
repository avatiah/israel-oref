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
          <div className="gauge-subtitle">
            Current assessment (real-time aggregation)<br />
            24–48 hour outlook
          </div>
          <div className="gauge">
            <div className="gauge-body">
              {/* Только внешний контур */}
              <div className="gauge-arc"></div>
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
          <div className="gauge-subtitle">
            Current assessment (real-time aggregation)<br />
            24–48 hour outlook
          </div>
          <div className="gauge">
            <div className="gauge-body">
              <div className="gauge-arc"></div>
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
        LAST_SYNC: {new Date(data.timestamp).toLocaleString()}<br />
        Sources: ISW, INSS, Atlantic Council, IsraelRadar_com etc.<br />
        <span className="disclaimer">
          DISCLAIMER: This is an automated aggregation of open-source expert analyses. 
          It is not official intelligence, not a prediction, and carries no liability. 
          Use for informational purposes only.
        </span>
      </footer>

      <style jsx global>{`
        body {
          background: #000;
          color: #e0e0e0;
          font-family: 'Consolas', 'Courier New', monospace;
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
          color: #ffffff;
        }
        .gauges {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 25px;
        }
        .gauge-container {
          text-align: center;
        }
        .gauge-label {
          font-size: 1.1rem;
          margin-bottom: 4px;
          color: #ffffff;
          font-weight: bold;
        }
        .gauge-subtitle {
          font-size: 0.75rem;
          color: #aaaaaa;
          line-height: 1.3;
          margin-bottom: 8px;
        }
        .gauge {
          position: relative;
          width: 180px;
          height: 100px;
        }
        .gauge-body {
          width: 180px;
          height: 90px;
          background: #000000;
          border-radius: 180px 180px 0 0;
          position: relative;
          overflow: hidden;
          border: 2px solid #333333;
        }
        .gauge-arc {
          position: absolute;
          inset: 0;
          background: conic-gradient(
            from 180deg at 50% 100%,
            #00ff00 0deg 60deg,
            #ffff00 60deg 120deg,
            #ff0000 120deg 180deg
          );
          mask: radial-gradient(transparent 45%, black 48%);
          -webkit-mask: radial-gradient(transparent 45%, black 48%);
          border-radius: 180px 180px 0 0;
        }
        .gauge-center {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 28px;
          background: #000000;
          border-radius: 50%;
          border: 2px solid #555555;
          z-index: 5;
        }
        .gauge-needle {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 7px;
          height: 92px;
          background: linear-gradient(to top, #ff0000, #ff4444);
          transform-origin: bottom center;
          transition: transform 1.5s ease-out;
          z-index: 6;
          box-shadow: 0 0 15px #ff0000, 0 0 8px #ff4444;
          border-radius: 7px 7px 0 0;
        }
        .gauge-value {
          margin-top: 12px;
          font-size: 1.6rem;
          font-weight: bold;
          color: #ffffff;
        }
        .red { color: #ff4444; text-shadow: 0 0 8px #ff0000; }
        .green { color: #44ff44; text-shadow: 0 0 8px #00ff00; }
        .sub-bar {
          background: #0a0a0a;
          padding: 12px;
          font-size: 0.9rem;
          border: 1px solid #222222;
          text-align: center;
        }
        .label {
          font-size: 0.75rem;
          color: #555555;
          letter-spacing: 1.5px;
          margin-bottom: 12px;
        }
        .intel-card {
          background: #0a0a0a;
          border: 1px solid #222222;
          padding: 16px;
          border-left: 5px solid #ff0000;
        }
        .meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #44ff44;
          margin-bottom: 10px;
        }
        .intel-title {
          font-size: 1rem;
          margin: 0 0 12px 0;
          line-height: 1.4;
          color: #e0e0e0;
        }
        .link {
          color: #ff4444;
          font-size: 0.75rem;
          text-decoration: none;
          font-weight: bold;
          border-bottom: 1px solid #400000;
        }
        .loading {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff4444;
          font-size: 1rem;
        }
        .footer {
          font-size: 0.65rem;
          color: #555555;
          text-align: center;
          margin-top: 25px;
          line-height: 1.5;
        }
        .disclaimer {
          color: #666666;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
