export default async function handler(req, res) {
  // Список авторитетных OSINT и аналитических источников
  const sources = [
    { name: 'ISW', url: 'https://understandingwar.org/rss.xml' },
    { name: 'REUTERS_GEO', url: 'https://www.reutersagency.com/feed/?best-sectors=geopolitics' }
  ];

  try {
    // 1. Получаем живой поток аналитики
    const reports = await Promise.all(
      sources.map(async (src) => {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(src.url)}`);
        const data = await response.json();
        return data.items?.map(item => ({
          agency: src.name,
          title: item.title,
          summary: item.description?.replace(/<[^>]*>?/gm, '').slice(0, 350), // Только текст
          link: item.link,
          pubDate: item.pubDate
        })) || [];
      })
    );

    // 2. Получаем живой курс валют (Индикатор стресса)
    const fxRes = await fetch(`https://open.er-api.com/v6/latest/USD`);
    const fxData = await fxRes.json();
    const currentIls = fxData.rates?.ILS || 3.10;

    // Сортируем по свежести
    const finalReports = reports.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)).slice(0, 10);

    res.status(200).json({
      updated: new Date().toISOString(),
      ils: currentIls,
      risk_index: ((currentIls - 3.00) * 100).toFixed(0), // Математический расчет риска
      intel: finalReports
    });
  } catch (e) {
    res.status(500).json({ error: "OSINT_GATEWAY_OFFLINE" });
  }
}
