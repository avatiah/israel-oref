export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+military+Hezbollah+Gaza+Iran+strike&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 40);

    let stats = { military: 0, political: 0, movement: 0, media: 0, social: 0 };
    let signals = [];

    titles.forEach(t => {
      const text = t.toLowerCase();
      if (/(missile|strike|barrage|rocket|intercepted|killed|explosion)/.test(text)) {
        stats.military += 1;
        signals.push({ type: 'MILITARY', text: t.split(' - ')[0], weight: 5 });
      } else if (/(threatens|warns|statement|commander|official)/.test(text)) {
        stats.political += 1;
        signals.push({ type: 'POLITICAL', text: t.split(' - ')[0], weight: 3 });
      } else if (/(deployment|satellite|border|convoy|carrier)/.test(text)) {
        stats.movement += 1;
        signals.push({ type: 'MOVEMENT', text: t.split(' - ')[0], weight: 4 });
      } else if (/(breaking|reports|confirmed|sources)/.test(text)) {
        stats.media += 1;
        signals.push({ type: 'MEDIA', text: t.split(' - ')[0], weight: 2 });
      } else {
        stats.social += 1;
      }
    });

    // Твоя формула: Σ(сигналы × вес)
    const rawIndex = (stats.military * 5) + (stats.political * 3) + (stats.movement * 4) + (stats.media * 2) + (stats.social * 1);
    
    // Применяем "демпфер" (сегодня затишье из-за Рафаха, поэтому делим на поправочный коэффициент)
    const finalIndex = Math.max(12, Math.min(Math.round(rawIndex / 2.5), 100));

    res.status(200).json({
      index: finalIndex,
      stats: [
        { label: "Military Events", count: stats.military, weight: 5, contribution: stats.military * 5 },
        { label: "Leadership Statements", count: stats.political, weight: 3, contribution: stats.political * 3 },
        { label: "Troop Movement", count: stats.movement, weight: 4, contribution: stats.movement * 4 },
        { label: "Media Reports", count: stats.media, weight: 2, contribution: stats.media * 2 },
        { label: "Social Activity", count: stats.social, weight: 1, contribution: stats.social * 1 }
      ],
      latest: signals.slice(0, 6),
      updated: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: "OFFLINE" });
  }
}
