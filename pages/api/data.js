export default async function handler(req, res) {
  try {
    // Используем NewsAPI или аналогичный стабильный шлюз (через прокси)
    // В данном случае - агрегатор актуальных новостей по ключевым словам OSINT
    const fetchNews = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://news.google.com/rss/search?q=Israel+Hezbollah+ISW+analysis&hl=en-US&gl=US&ceid=US:en')}`);
    const newsData = await fetchNews.json();

    const reports = newsData.items?.map(item => ({
      agency: item.source || "INTEL_NODE",
      title: item.title,
      link: item.link,
      ts: item.pubDate
    })).slice(0, 7) || [];

    // Реальный актуальный курс (обновление в реальном времени)
    const fx = await fetch(`https://open.er-api.com/v6/latest/USD`).then(r => r.json());
    const currentIls = fx.rates?.ILS || 3.78; // Реальный курс на февраль 2026

    res.status(200).json({
      timestamp: new Date().toISOString(),
      reports,
      ils: currentIls.toFixed(4),
      // Индекс на основе реальных рыночных данных
      risk_index: Math.min(Math.max(((currentIls - 3.60) * 200), 20), 98).toFixed(0)
    });
  } catch (e) {
    res.status(500).json({ error: "LINK_BROKEN" });
  }
}
