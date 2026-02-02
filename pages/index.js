const Gauge = ({ value, range, label, status, color }) => (
    <div className="gauge-box">
      <div className="gauge-visual">
        {/* Статичная трехцветная дуга */}
        <div className="gauge-arc-bg"></div>
        {/* Подвижная стрелка */}
        <div className="gauge-needle" style={{ transform: `rotate(${(value / 100) * 180 - 90}deg)` }}></div>
        {/* Текстовый статус в центре */}
        <div className="gauge-status" style={{ color: color }}>{status}</div>
      </div>
      <div className="gauge-range white">{range}</div>
      <div className="gauge-label white">{label}</div>
      
      <style jsx>{`
        .gauge-box { text-align: center; flex: 1; }
        .gauge-visual { 
          width: 140px; 
          height: 70px; 
          margin: 0 auto; 
          position: relative; 
          overflow: hidden; 
        }
        
        /* Создаем градиентную дугу (Зеленый-Желтый-Красный) */
        .gauge-arc-bg {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 12px solid transparent;
          /* Градиент по кругу */
          background: conic-gradient(
            from 270deg, 
            #00FF00 0%, 
            #FFFF00 25%, 
            #FF0000 50%, 
            transparent 50%
          );
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 13px), #fff calc(100% - 12px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 13px), #fff calc(100% - 12px));
          transform: rotate(0deg);
          position: absolute;
          top: 0;
        }

        .gauge-needle { 
          position: absolute; 
          bottom: 0; 
          left: 50%; 
          width: 3px; 
          height: 60px; 
          background: #FFFFFF; 
          transform-origin: bottom center; 
          transition: transform 2s cubic-bezier(0.4, 0, 0.2, 1); 
          z-index: 5;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        
        /* Декоративная точка в основании стрелки */
        .gauge-needle::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: -3px;
          width: 9px;
          height: 9px;
          background: #FFFFFF;
          border-radius: 50%;
        }

        .gauge-status { 
          position: absolute; 
          bottom: 0; 
          left: 0; 
          right: 0; 
          font-size: 0.85rem; 
          font-weight: 900; 
          text-shadow: 1px 1px 2px #000;
        }
        .gauge-range { font-size: 1.1rem; font-weight: bold; margin-top: 10px; }
        .gauge-label { font-size: 0.6rem; text-transform: uppercase; margin-top: 5px; opacity: 0.9; }
      `}</style>
    </div>
  );
