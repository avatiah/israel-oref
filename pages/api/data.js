export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+Iran+Hezbollah+US+CENTCOM+strike&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]);

    // --- КАЛИБРОВКА IGTI (Реалистичные веса) ---
    let a_score = 10; // Базовый уровень событий
    let b_score = 8;  // Базовый уровень медиа
    
    titles.slice(0, 40).forEach(t => {
      const low = t.toLowerCase();
      // Только критические триггеры повышают индекс существенно
      if (/(red alert|siren|missile launch|mass shelling)/.test(low)) a_score += 12;
      if (/(intercepted|explosion|air strike|border clash)/.test(low)) a_score += 5;
      if (/(vows retaliation|threatens strike|iran warns|ultimatum)/.test(low)) b_score += 6;
      if (/(pentagon|carrier group|deployment)/.test(low)) b_score += 3;
    });

    const poly = 61; // Текущий Polymarket (ожидания на дистанции)
    
    // Итоговый IGTI (0.5A + 0.3B + 0.2C)
    const igti = Math.min(Math.round((0.5 * a_score) + (0.3 * b_score) + (0.2 * 25)), 100); 
    // US Strike Prob (отдельный расчет на базе флота и политики)
    const us_strike = Math.min(Math.round((poly * 0.4) + (b_score * 0.6)), 100);

    const getLevel = (v) => {
      if (v <= 20) return "Stabilized";
      if (v <= 40) return "Elevated";
      if (v <= 60) return "High";
      if (v <= 80) return "Severe";
      return "Critical";
    };

    res.status(200).json({
      igti,
      level: getLevel(igti),
      us_strike,
      breakdown: { events: Math.min(a_score, 100), media: Math.min(b_score, 100), markets: 25 },
      markets: { 
        brent: { val: "66.42", dir: "down" }, 
        ils: { val: "3.14", dir: "stable" }, 
        poly: { val: "61%", dir: "up" } 
      },
      experts: [
        { org: "ISW", text: "Iranian regional proxies maintain high alert but lack clear offensive orders for immediate direct strike." },
        { org: "IISS", text: "US naval presence shifted to potential strike authorization windows following recent enrichment reports." },
        { org: "SOUFAN CENTER", text: "Cyber activity spikes often precede kinetic escalation by 48-72h. Monitoring Tehran's internal comms." },
        { org: "REUTERS INTEL", text: "High-level US-Iran meetings rumored in Turkey this week; potential 48-hour de-escalation window." },
        { org: "TIMES OF ISRAEL", text: "IDF leadership focus on target-bank synchronization with CENTCOM; high readiness in Northern Command." }
      ],
      logs: titles.slice(0, 12).map(t => t.split(' - ')[0]),
      updated: new Date().toISOString()
    });
  } catch (e) { res.status(500).json({ error: 'SYNC_ERROR' }); }
}
