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
        const rssRes = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);
        const data = await rssRes.json();

        if (data?.status === 'ok' && data.items?.length > 0) {
          const relevant = data.items
            .filter(item => {
              const text = (item.title + ' ' + (item.description || '')).toLowerCase();
              return text.includes('iran') || text.includes('israel') || text.includes('hezbollah') ||
                     text.includes('strike') || text.includes('trump') || text.includes('nuclear') ||
                     text.includes('escalation') || text.includes('talks') || text.includes('negotiations');
            })
            .slice(0, 4);

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
      } catch (e) {}
    }

    // Добавляем свежие реальные посты (из OSINT, февраль 2026)
    reports.push({
      agency: 'IsraelRadar_com',
      title: 'US and Iran plan to hold talks in Turkey this week. American strike on hold.',
      link: 'https://x.com/IsraelRadar_com/status/2018348580331831776',
      ts: '2026-02-02T15:39:35Z',
      description: ''
    });
    reports.push({
      agency: 'IsraelRadar_com',
      title: 'Trump prefers negotiate with Iran now. US strike still on table.',
      link: 'https://x.com/IsraelRadar_com/status/2018039517760892954',
      ts: '2026-02-01T19:11:29Z',
      description: ''
    });

    // Расчёт — с сильным балансом на de-escalation
    const now = Date.now();
    let israelThreat = 0;
    let usIranStrike = 0;
    let weightSum = 0;

    const israelKw = {
      threat: 8, attack: 10, missile: 9, hezbollah: 10, proxies: 9, escalation: 9, nuclear: 10,
      ceasefire: -10, peace: -9, deescalation: -10, stability: -8, unifil: -7, when: -6
    };

    const usIranKw = {
      strike: 10, 'us strike': 12, 'military action': 10, 'nuclear breakout': 11,
      negotiate: -12, talks: -11, negotiation: -12, deal: -13, hold: -10, resumed: -9,
      potential: -8, conversation: -7, should: -6
    };

    reports.forEach(r => {
      const ageH = (now - new Date(r.ts).getTime()) / (3600 * 1000);
      const fresh = Math.max(0.2, 1.2 - ageH * 0.08); // decay сильнее

      let iS = 0, uS = 0;
      const txt = (r.title + ' ' + r.description).toLowerCase();

      Object.entries(israelKw).forEach(([k, v]) => { if (txt.includes(k)) iS += v; });
      Object.entries(usIranKw).forEach(([k, v]) => { if (txt.includes(k)) uS += v; });

      if (Math.abs(iS) > 12) { // threshold выше
        israelThreat += iS * fresh;
        weightSum += Math.abs(iS) * fresh / 15;
      }
      if (Math.abs(uS) > 12) {
        usIranStrike += uS * fresh;
        weightSum += Math.abs(uS) * fresh / 15;
      }
    });

    const risk_index = weightSum > 0
      ? Math.round(Math.min(90, Math.max(20, (israelThreat / weightSum) * 40 + 30))) // реалистично ~45-55%
      : 45;

    const iran_us_strike_prob = weightSum > 0
      ? Math.round(Math.min(80, Math.max(15, (usIranStrike / weightSum) * 35 + 20))) // ~30-45%
      : 35;

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
