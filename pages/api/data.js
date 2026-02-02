export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+military+Hezbollah+Gaza+Iran+Pentagon+US+Navy&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]);

    // Аналитическая фильтрация
    let score = { mil: 0, rhet: 0, log: 0 };
    let iranSignals = 0;
    
    const logs = titles.slice(1, 45).map(t => {
      const clean = t.split(' - ')[0].replace(/Day \d+[:|]/gi, '').trim();
      const low = clean.toLowerCase();
      if (/(missile|strike|attack|killed|clash|raid)/.test(low)) score.mil += 5;
      if (/(warn|threat|vow|khamenei|retaliate)/.test(low)) score.rhet += 3;
      if (/(carrier|uss|navy|deployment|troop)/.test(low)) score.log += 4;
      if (/(iran|tehran|khamenei|strait)/.test(low)) iranSignals += 1;
      return clean;
    }).filter(t => t.length > 15);

    // Расчет внешней угрозы (U.S. vs IRAN)
    const iranIndex = Math.max(5, Math.min(Math.round(iranSignals * 8), 95));
    
    // Расчет MADAD OREF (с учетом внешнего фактора)
    let baseRisk = (score.mil + score.rhet + score.log) / 4.2;
    if (iranIndex > 60) baseRisk *= 1.4; // Множитель региональной эскалации

    const finalIndex = Math.max(12, Math.min(Math.round(baseRisk), 98));

    res.status(200).json({
      index: finalIndex,
      iran_prob: iranIndex,
      sectors: [
        { n: 'NORTH', v: Math.min(score.mil * 1.5 + 10, 100) },
        { n: 'SOUTH', v: Math.min(score.mil * 1.2 + 15, 100) },
        { n: 'EAST', v: iranIndex }
      ],
      markets: {
        poly: iranIndex > 50 ? "64%" : "14%",
        oil: finalIndex > 40 ? "$84.20" : "$67.90",
        ils: finalIndex > 40 ? "3.81" : "3.61"
      },
      history: Array.from({length: 15}, (_, i) => Math.max(12, finalIndex + Math.floor(Math.random() * 10) - 5)).reverse(),
      logs: logs.slice(0, 8),
      updated: new Date().toISOString()
    });
  } catch (e) { res.status(500).json({ error: 'SYSTEM_ERROR' }); }
}
