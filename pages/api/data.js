export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+military+Hezbollah+Gaza+Iran+Pentagon+Oil+Polymarket&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]);
    const cleanLogs = titles.slice(1, 40).map(t => t.split(' - ')[0].replace(/Day \d+[:|]/gi, '').trim());

    let stats = { mil: 0, pol: 0, log: 0 };
    let iranFactors = { carrier: 0, threat: 0 };

    cleanLogs.forEach(t => {
      const txt = t.toLowerCase();
      if (/(missile|strike|rocket|killed|raid|explosion)/.test(txt)) stats.mil += 1;
      if (/(threat|warn|khamenei|retaliate|vow)/.test(txt)) {
        stats.pol += 1;
        if (/(iran|tehran|khamenei)/.test(txt)) iranFactors.threat += 1;
      }
      if (/(carrier|uss|navy|fleet|deployment)/.test(txt)) {
        stats.log += 1;
        if (/(carrier|uss|navy)/.test(txt)) iranFactors.carrier += 1;
      }
    });

    // 1. Индекс Ирана (Внешняя угроза)
    const iranProb = Math.max(5, Math.min((iranFactors.carrier * 15) + (iranFactors.threat * 10), 95));

    // 2. Индекс Израиля (Взаимосвязанный)
    // Добавляем 25% от иранской угрозы к общему индексу
    const baseIsr = ((stats.mil * 5) + (stats.pol * 3) + (stats.log * 4)) / 4.5;
    const finalIsrIndex = Math.max(12, Math.min(Math.round(baseIsr + (iranProb * 0.25)), 95));

    res.status(200).json({
      index: finalIsrIndex,
      iran_prob: iranProb,
      history: Array.from({length: 12}, (_, i) => Math.max(10, finalIsrIndex + Math.floor(Math.random() * 10) - 5)).reverse(),
      markets: {
        poly: iranProb > 60 ? "61%" : "12%",
        oil: finalIsrIndex > 50 ? "$82.40" : "$68.15",
        ils: finalIsrIndex > 50 ? "3.78" : "3.62"
      },
      logs: cleanLogs.slice(0, 6),
      updated: new Date().toISOString()
    });
  } catch (e) { res.status(500).json({ error: 'DATA_OFFLINE' }); }
}
