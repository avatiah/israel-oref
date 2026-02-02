const Gauge = ({ value, range, label, status, color }) => {
  // Вычисляем поворот стрелки заранее
  const rotation = (value / 100) * 180 - 90;

  return (
    <div className="gauge-box">
      <div className="gauge-visual">
        {/* Трехцветная статичная дуга */}
        <div className="gauge-arc-bg"></div>
        
        {/* Стрелка */}
        <div 
          className="gauge-needle" 
          style={{ transform: `rotate(${rotation}deg)` }}
        ></div>
        
        {/* Текстовый статус */}
        <div className="gauge-status" style={{ color: color }}>
          {status}
        </div>
      </div>
      
      <div className="gauge-range white">{range}</div>
      <div className="gauge-label white">{label}</div>
      
      <style jsx>{`
        .gauge-box { text-align: center; flex: 1; display: flex; flex-direction: column; align-items: center; }
        .gauge-visual { 
          width: 140px; 
          height: 70px; 
          margin: 0 auto; 
          position: relative; 
          overflow: hidden; 
        }
        
        .gauge-arc-bg {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 12px solid transparent;
          background: conic-gradient(
            from 270deg, 
            #00FF00 0%, 
            #FFFF00 25%, 
            #FF0000 50%, 
            transparent 50%
          );
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 13px), #fff calc(100% - 12px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 13px), #fff calc(100% - 12px));
          position: absolute;
          top: 0;
          left: 0;
        }

        .gauge-needle { 
          position: absolute; 
          bottom: 0; 
          left: calc(50% - 1.5px); 
          width: 3px; 
          height: 55px; 
          background: #FFFFFF; 
          transform-origin: bottom center; 
          transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1); 
          z-index: 5;
        }

        .gauge-status { 
          position: absolute; 
          bottom: 0; 
          left: 0; 
          right: 0; 
          font-size: 0.8rem; 
          font-weight: 900; 
          text-shadow: 1px 1px 1px #000;
        }

        .gauge-range { font-size: 1.1rem; font-weight: bold; margin-top: 10px; color: #FFFFFF; }
        .gauge-label { font-size: 0.6rem; text-transform: uppercase; margin-top: 5px; color: #FFFFFF; }
        .white { color: #FFFFFF !important; }
      `}</style>
    </div>
  );
};
