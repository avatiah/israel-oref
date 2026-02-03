export default async function handler(req, res) {
  const sources = [
    { name: 'ISW', url: 'https://understandingwar.org/rss.xml' },
    { name: 'REUTERS_GEO', url: 'https://www.reutersagency.com/feed/?best-sectors=geopolitics' }
  ];

  try {
    const responses = await Promise.all(
      sources.map(s => fetch(`https://api.rss2json.com/v1/api.json?rss_url=${s.url}`).then(r => r.json()))
    );

    const reports = responses.flatMap((data, index) => 
      data.items?.map(item => ({
        agency: sources[index].name,
        title: item.title,
        content: item.description?.replace(/<[^>]*>?/gm, '').slice(0, 300),
        link: item.link,
        date: item.pubDate
      })) || []
    ).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

    // Реальный курс для индекса
    const fx = await fetch(`https://open.er-api.com/v6/latest/USD`).then(r => r.json());
    const currentIls = fx.rates?.ILS || 3.10;

    res.status(200).json({
      updated: new Date().toISOString(),
      reports,
      ils: currentIls,
      // Индекс теперь привязан к рыночной волатильности
      safety_index: ((currentIls - 3.00) * 100).toFixed(0) 
    });
  } catch (e) {
    res.status(500).json({ error: "FEED_SYNC_FAILED" });
  }
}
