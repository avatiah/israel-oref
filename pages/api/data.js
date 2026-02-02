export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+Hezbollah+Iran+Pentagon+Oil+Price+Polymarket&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 50);

    let stats = { military: 0, political: 0, movement: 0, media: 0 };
    let iranFactors = { carrier: 0, rhetoric: 0, drills: 0 };
    
    titles.forEach(t => {
      const text = t.toLowerCase();
      if (/(missile|strike|rocket|interception|explosion)/.test(text)) stats.military += 1;
      if (/(threaten|warn|statement|official)/.test(text)) stats.political += 1;
      if (/(deployment|convoy|border)/.test(text)) stats.movement += 1;
      if (/(carrier|uss|navy|khamenei|hormuz)/.test(text)) {
        if (/(carrier|uss)/.test(text)) iranFactors.carrier += 1;
        if (/(khamenei|threat)/.test(text)) iranFactors.rhetoric += 1;
        if (/(drills|maneuver)/.test(text)) iranFactors.drills += 1;
      }
    });

    // Расчет MADAD OREF (Израиль)
    const isrIndex = Math.max(12, Math.min(Math.round(((stats.military * 5) + (stats.political * 3) + (stats.movement * 4)) / 3.5), 100));

    // Расчет US vs IRAN (Скорректированный)
    // Балансируем между присутствием сил и дипломатией
    const iranBase = (iranFactors.carrier * 10) + (iranFactors.rhetoric * 8) + (iranFactors.drills * 5);
    const finalIranIndex = Math.max(5, Math.min(Math.round(iranBase / 1.8), 95));

    res.status(200).json({
      index: isrIndex,
      iran_confrontation: {
        index: finalIranIndex,
        status: finalIranIndex > 70 ? 'CRITICAL_FRICTION' : (finalIranIndex > 40 ? 'HIGH_WATCH' : 'STABLE_MONITOR'),
        factors: [
          { name: "Naval Strike Groups", val: Math.min(iranFactors.carrier * 10, 40) },
          { name: "Tehran/DC Rhetoric", val: Math.min(iranFactors.rhetoric * 8, 30) }
        ]
      },
      markets: {
        polymarket_iran_strike: "61%", // По данным на 02.02.2026
        brent_oil: "$65.66", // Снижение из-за переговоров
        usd_ils: "3.11",
        market_sentiment: "DE-ESCALATING"
      },
      updated: new Date().toISOString()
    });
  } catch (e) { res.status(500).json({ error: "OFFLINE" }); }
}
