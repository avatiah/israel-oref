export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+military+Hezbollah+Gaza+Iran+Pentagon+US+Navy&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 45);

    let stats = { military: 0, political: 0, movement: 0, media: 0, social: 0 };
    let iranFactors = { carrier: 0, rhetoric: 0, drills: 0 };
    let signals = [];

    titles.forEach(t => {
      const text = t.toLowerCase();
      // Логика MADAD OREF (Израиль)
      if (/(missile|strike|barrage|rocket|intercepted|killed|explosion)/.test(text)) {
        stats.military += 1;
        signals.push({ type: 'MILITARY', text: t.split(' - ')[0], weight: 5 });
      } else if (/(threatens|warns|statement|commander|official)/.test(text)) {
        stats.political += 1;
        signals.push({ type: 'POLITICAL', text: t.split(' - ')[0], weight: 3 });
      } else if (/(deployment|satellite|border|convoy)/.test(text)) {
        stats.movement += 1;
        signals.push({ type: 'MOVEMENT', text: t.split(' - ')[0], weight: 4 });
      } else if (/(breaking|reports|confirmed|sources)/.test(text)) {
        stats.media += 1;
        signals.push({ type: 'MEDIA', text: t.split(' - ')[0], weight: 2 });
      } else { stats.social += 1; }

      // Логика U.S. vs IRAN
      if (/(carrier|strike group|uss|navy|fleet)/.test(text)) iranFactors.carrier += 1;
      if (/(pentagon|khamenei|retaliation|war path)/.test(text)) iranFactors.rhetoric += 1;
      if (/(maneuvers|drills| Hormuz|enrichment)/.test(text)) iranFactors.drills += 1;
    });

    const isrIndex = Math.max(12, Math.min(Math.round(((stats.military * 5) + (stats.political * 3) + (stats.movement * 4) + (stats.media * 2)) / 2.8), 100));
    
    // Расчет для Ирана (Strike Probability)
    const iranIndex = Math.max(5, Math.min(Math.round((iranFactors.carrier * 15) + (iranFactors.rhetoric * 10) + (iranFactors.drills * 8)), 100));

    res.status(200).json({
      index: isrIndex,
      iran_strike: {
        index: iranIndex,
        factors: [
          { name: "Naval Presence (US/IR)", val: iranFactors.carrier * 15 },
          { name: "Escalatory Rhetoric", val: iranFactors.rhetoric * 10 },
          { name: "Combat Readiness/Drills", val: iranFactors.drills * 8 }
        ]
      },
      stats: [
        { label: "Military Events", count: stats.military, weight: 5, contribution: stats.military * 5 },
        { label: "Leadership Statements", count: stats.political, weight: 3, contribution: stats.political * 3 },
        { label: "Troop Movement", count: stats.movement, weight: 4, contribution: stats.movement * 4 },
        { label: "Media Reports", count: stats.media, weight: 2, contribution: stats.media * 2 }
      ],
      latest: signals.slice(0, 6),
      updated: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: "OFFLINE" });
  }
}
