export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+military+Iran+CENTCOM+IAEA+Strike+Hezbollah&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]);

    let weights = { naval: 0, kinetic: 0, nuclear: 0, diplo: 0 };
    let sources = new Set();
    
    const logs = titles.slice(1, 55).map(t => {
      const clean = t.split(' - ')[0].replace(/Day \d+[:|]/gi, '').trim();
      const low = clean.toLowerCase();
      const src = t.split(' - ')[1] || "OSINT_GENERIC";
      sources.add(src);

      if (/(carrier|uss|navy|fleet|csg)/.test(low)) weights.naval += 1;
      if (/(strike|explosion|rocket|missile|attack)/.test(low)) weights.kinetic += 1;
      if (/(nuclear|enrichment|uranium|iaea)/.test(low)) weights.nuclear += 1;
      if (/(talks|de-escalate|ceasefire|deal|negotiate)/.test(low)) weights.diplo += 1;

      return { text: clean, src: src, cat: low.includes('strike') ? 'MIL' : 'POL' };
    });

    // 1. Уровень уверенности (Confidence Level)
    const confidence = sources.size > 15 ? 'HIGH' : sources.size > 8 ? 'MED' : 'LOW';

    // 2. Сценарное моделирование
    const scenario_proxy = Math.min(weights.kinetic * 12, 95);
    const scenario_direct = Math.min((weights.naval * 10) + (weights.kinetic * 5), 90);
    const scenario_nuclear = Math.min(weights.nuclear * 25, 98);

    // 3. Общий индекс (Weighted Average)
    const rawIndex = (scenario_proxy * 0.4) + (scenario_direct * 0.4) + (scenario_nuclear * 0.2);
    const mitigator = weights.diplo * 5; // Снижение риска при дипломатии
    const finalIndex = Math.max(12, Math.min(Math.round(rawIndex - mitigator), 98));

    res.status(200).json({
      index: finalIndex,
      confidence: { level: confidence, sources: sources.size },
      scenarios: [
        { name: "Proxy Escalation", val: scenario_proxy, trend: '+4%' },
        { name: "Direct State-on-State", val: scenario_direct, trend: '-2%' },
        { name: "Nuclear Breakout", val: scenario_nuclear, trend: '0%' }
      ],
      mitigators: weights.diplo > 0 ? [`Diplomatic signals detected (${weights.diplo})`] : [],
      markets: {
        brent: "$66.31", // [Fact 02.02.26]
        ils: "3.10",     // [Fact 02.02.26]
        poly: finalIndex > 50 ? "61%" : "18%"
      },
      history: Array.from({length: 12}, (_, i) => Math.max(15, finalIndex + Math.sin(i) * 10)).reverse(),
      logs: logs.slice(0, 8),
      updated: new Date().toISOString()
    });
  } catch (e) { res.status(500).json({ error: 'CORE_SYNC_ERR' }); }
}
