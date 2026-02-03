export default async function handler(req, res) {
  // Список прямых аналитических фидов
  const feeds = [
    'https://understandingwar.org/rss.xml', // ISW
    'https://www.reutersagency.com/feed/?best-sectors=geopolitics', // Reuters
    'https://hnrss.org/frontpage?q=Israel+Hezbollah' // OSINT Stream
  ];

  try {
    const responses = await Promise.all(
      feeds.map(url => fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`).then(r => r.json()))
    );

    const allReports = responses.flatMap(data => data.items || []).map(item => ({
      source: item.author || "INTEL_NODE",
      title: item.title,
      summary: item.description?.replace(/<[^>]*>?/gm, '').slice(0, 400),
      link: item.link,
      pubDate: item.pubDate
    })).sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)).slice(0, 8);

    // Реальный курс валют (фактор стресса)
    const fx = await fetch(`https://open.er-api.com/v6/latest/USD`).then(r => r.json());
    const ils = fx.rates?.ILS || 3.10;

    res.status(200).json({
      updated: new Date().toISOString(),
      reports: allReports,
      ils: ils,
      // Индекс: математическая волатильность (реальный страх рынка)
      risk_index: ((ils - 3.05) * 150).toFixed(0) 
    });
  } catch (e) {
    res.status(500).json({ error: "OSINT_GATEWAY_TIMEOUT" });
  }
}
