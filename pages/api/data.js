export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+military+Hezbollah+Gaza+strike+Iran&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    
    // Чистим заголовки: убираем Day XXX, названия газет и лишние символы
    const rawTitles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]);
    const cleanLogs = rawTitles.slice(1, 40).map(t => {
        let clean = t.split(' - ')[0];
        clean = clean.replace(/Day \d+[:|]/gi, '').replace(/Israel-Hamas war[:|]/gi, '').trim();
        return clean;
    }).filter(t => t.length > 10);

    let stats = { mil: 0, pol: 0, log: 0 };
    let iranFactors = { carrier: 0, threat: 0 };
    let frontLevels = { north: 12, south: 18, east: 8 };

    cleanLogs.forEach(txt => {
      const t = txt.toLowerCase();
      if (/(missile|strike|rocket|killed|raid|jenin|lebanon)/.test(t)) {
        stats.mil += 1;
        if (/(north|lebanon|hezbollah)/.test(t)) frontLevels.north += 5;
        if (/(gaza|south|rafah|hamas)/.test(t)) frontLevels.south += 4;
      }
      if (/(threat|warn|vow|trump|khamenei|retaliate)/.test(t)) {
        stats.pol += 1;
        if (/(iran|khamenei|tehran)/.test(t)) iranFactors.threat += 1;
      }
      if (/(carrier|uss|navy|fleet|deployment)/.test(t)) {
        stats.log += 1;
        if (/(carrier|uss|navy)/.test(t)) iranFactors.carrier += 1;
      }
    });

    const isrIndex = Math.max(12, Math.min(Math.round(((stats.mil * 5) + (stats.pol * 3) + (stats.log * 4)) / 4.5), 95));
    const iranProb = Math.max(5, Math.min((iranFactors.carrier * 15) + (iranFactors.threat * 10), 95));

    res.status(200).json({
      index: isrIndex,
      iran_prob: iranProb,
      fronts: [
        { name: 'NORTH (LEBANON)', val: Math.min(frontLevels.north, 100) },
        { name: 'SOUTH (GAZA)', val: Math.min(frontLevels.south, 100) }
      ],
      history: Array.from({length: 12}, (_, i) => Math.max(10, isrIndex + Math.floor(Math.random() * 15) - 7)).reverse(),
      logs: cleanLogs.slice(0, 7),
      updated: new Date().toISOString()
    });
  } catch (e) { res.status(500).json({ error: 'OFFLINE' }); }
}
