export default async function handler(req, res) {
  try {
    // 1. Агрегация потоков (ISW и Reuters)
    const sources = [
      'https://api.rss2json.com/v1/api.json?rss_url=https://understandingwar.org/rss.xml',
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.reutersagency.com/feed/?best-sectors=geopolitics'
    ];

    const responses = await Promise.all(sources.map(s => fetch(s).then(r => r.json())));
    
    // Формируем чистый массив аналитики
    const intel = responses.flatMap(repo => repo.items || []).map(item => ({
      agency: item.author || "STRATEGIC_INTEL",
      title: item.title,
      summary: item.description?.replace(/<[^>]*>?/gm, '').slice(0, 250),
      link: item.link,
      ts: new Date(item.pubDate).getTime()
    })).sort((a, b) => b.ts - a.ts).slice(0, 10);

    // 2. Рыночные индикаторы страха (Только живой поток)
    const fx = await fetch(`https://open.er-api.com/v6/latest/USD`).then(r => r.json());
    
    res.status(200).json({
      updated: new Date().toISOString(),
      intel: intel,
      markets: {
        ils: fx.rates?.ILS?.toFixed(2),
        index: ((fx.rates?.ILS - 3.65) * 100 + 40).toFixed(0) // Математический индекс на базе курса
      }
    });
  } catch (e) {
    res.status(500).json({ error: "GATEWAY_TIMEOUT" });
  }
}
