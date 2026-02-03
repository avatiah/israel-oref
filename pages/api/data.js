// pages/api/data.js

export default async function handler(req, res) {
  try {
    // 1. АВТОМАТИЧЕСКИЙ КУРС ВАЛЮТ (Бесплатный источник)
    const fxRes = await fetch('https://open.er-api.com/v6/latest/USD');
    const fxData = await fxRes.json();
    const ils = fxData.rates.ILS.toFixed(2);

    // 2. АВТОМАТИЧЕСКИЕ НОВОСТИ (Через бесплатный RSS-to-JSON мост)
    // Используем фид мировых новостей, который всегда доступен
    const newsRes = await fetch('https://api.rss2json.com/v1/api.json?rss_url=http://feeds.reuters.com/reuters/topNews');
    const newsData = await newsRes.json();
    
    const latestNews = newsData.items ? newsData.items.slice(0, 5).map(i => i.title) : [];

    // 3. АВТОМАТИЧЕСКАЯ ЛОГИКА ИНДЕКСОВ (Пример алгоритма)
    // Если в заголовках есть "Iran", "Strike", "Missile" — индекс растет автоматически
    const dangerWords = ["iran", "strike", "missile", "war", "attack", "israel", "hezbollah"];
    const signalStrength = latestNews.filter(n => 
      dangerWords.some(word => n.toLowerCase().includes(word))
    ).length;

    // Базовый расчет (динамика на основе новостного фона)
    const baseThreat = 40; 
    const dynamicThreat = Math.min(baseThreat + (signalStrength * 12), 98);

    const data = {
      updated: new Date().toISOString(),
      israel: {
        val: dynamicThreat - 5,
        range: `${dynamicThreat - 10}-${dynamicThreat}%`,
        status: dynamicThreat > 70 ? "CRITICAL" : (dynamicThreat > 50 ? "ELEVATED" : "STANDBY"),
        color: dynamicThreat > 70 ? "#FF0000" : (dynamicThreat > 50 ? "#FFFF00" : "#00FF00")
      },
      us_iran: {
        val: dynamicThreat + 5,
        range: `${dynamicThreat}-${dynamicThreat + 10}%`,
        status: dynamicThreat > 65 ? "HIGH_ALERT" : "STABLE",
        triggers: {
          carrier_groups: true, // Можно завязать на скрейпинг MarineTraffic (но это сложнее)
          ultimatums: signalStrength > 2,
          evacuations: signalStrength > 3,
          airspace: false
        }
      },
      experts: [
        { type: "FACT", org: "REUTERS", text: latestNews[0] || "Monitoring regional stability." },
        { type: "ANALYSIS", org: "AUTO_OSINT", text: `Detected ${signalStrength} high-priority signals in last cycle.` }
      ],
      feed: latestNews.length > 0 ? latestNews : ["Waiting for incoming signal packet..."]
    };

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); // Кэш на 60 сек, чтобы не спамить источники
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "Data collection failed" });
  }
}
