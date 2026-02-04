export default async function handler(req, res) {
  try {
    const rssFeeds = [
      'https://www.understandingwar.org/rss.xml',
      'https://www.criticalthreats.org/rss.xml',
      'https://www.atlanticcouncil.org/region/middle-east/feed/',
      'https://www.inss.org.il/feed/',
      'https://worldview.stratfor.com/rss',
      'https://www.csis.org/programs/middle-east-program/rss',
      'https://www.rand.org/topics/iran.rss',
      'https://www.brookings.edu/topics/iran/feed/',
      'https://www.fdd.org/category/analysis/iran/feed/',
      'https://www.washingtoninstitute.org/rss.xml'
    ];

    const reports = [];

    for (const feedUrl of rssFeeds) {
      try {
        const rssRes = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`
        );
        const data = await rssRes.json();

        if (data?.status === 'ok' && data.items?.length > 0) {
          const relevant = data.items
            .filter(item => {
              const text = (item.title + ' ' + (item.description || '')).toLowerCase();
              return text.includes('iran') || text.includes('israel') || text.includes('hezbollah') ||
                     text.includes('us strike') || text.includes('trump iran') || text.includes('nuclear') ||
                     text.includes('escalation') || text.includes('irgc') || text.includes('proxies') ||
                     text.includes('abraham lincoln') || text.includes('hormuz');
            })
            .slice(0, 4); // лимит на источник

          relevant.forEach(item => {
            reports.push({
              agency: data.feed?.title || 'Think Tank',
              title: item.title,
              link: item.link,
              ts: item.pubDate || new Date().toISOString(),
              description: item.description || item.content || ''
            });
          });
        }
      } catch (e) {
        // пропускаем фид если ошибка
      }
    }

    // Добавляем свежие X-посты вручную (обновляй по мере необходимости)
    reports.push({
      agency: 'IsraelRadar_com',
      title: 'Trump prefers negotiate with Iran now. US strike still on table.',
      link: 'https://x.com/IsraelRadar_com/status/2018039517760892954',
      ts: '2026-02-01T19:11:29Z',
      description: ''
    });

    // Расчёт индексов
    const now = Date.now();
    let israelThreat = 0;
    let usIranStrike = 0;
    let weightSum = 0;

    const israelKw = {
      threat: 8, attack: 10, missile: 9, hezbollah: 10, houthis: 8, hamas: 7,
      proxies: 9, irgc: 9, escalation: 9, nuclear: 10, lebanon: 7, gaza: 6,
      syria: 6, retaliation: 8, cyber: 7, protests: 5, instability: 8
    };

    const usIranKw = {
      'us strike': 12, 'trump iran': 11, 'strike iran': 12, 'military action': 10,
      'abraham lincoln': 9, 'hormuz': 8, 'naval': 9, 'nuclear breakout': 11,
      diplomacy: -8, negotiation: -9, talks: -7, 'nuclear deal': -10, deescalation: -7
    };

    reports.forEach(r => {
      const ageH = (now - new Date(r.ts).getTime()) / (3600 * 1000);
      const fresh = Math.max(0.3, 1.5 - ageH * 0.1);

      let iS = 0, uS = 0;
      const txt = (r.title + ' ' + r.description).toLowerCase();

      Object.entries(israelKw).forEach(([k, v]) => { if (txt.includes(k)) iS += v; });
      Object.entries(usIranKw).forEach(([k, v]) => { if (txt.includes(k)) uS += v; });

      if (Math.abs(iS) > 5) {
        israelThreat += iS * fresh;
        weightSum += Math.abs(iS) * fresh / 10;
      }
      if (Math.abs(uS) > 5) {
        usIranStrike += uS * fresh;
        weightSum += Math.abs(uS) * fresh / 10;
      }
    });

    const risk_index = weightSum > 0
      ? Math.round(Math.min(100, Math.max(0, (israelThreat / weightSum) * 75 + 25)))
      : 42; // fallback ~ambient tension

    const iran_us_strike_prob = weightSum > 0
      ? Math.round(Math.min(100, Math.max(0, (usIranStrike / weightSum) * 70 + 15)))
      : 28; // fallback ~current diplomacy phase

    res.status(200).json({
      timestamp: new Date().toISOString(),
      reports: reports.sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 10),
      risk_index,
      iran_us_strike_prob
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DATA_FETCH_FAILED' });
  }
}
