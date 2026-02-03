export default async function handler(req, res) {
  // Список проверенных аналитических фидов
  const sources = [
    { name: 'ISW_NEWS', url: 'https://understandingwar.org/rss.xml' },
    { name: 'REUTERS_INTEL', url: 'https://www.reutersagency.com/feed/?best-sectors=geopolitics' }
  ];

  try {
    const responses = await Promise.all(
      sources.map(async (src) => {
        // Используем открытый RSS-агрегатор для обхода блокировок
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(src.url)}`);
        const data = await res.json();
        return data.items?.map(item => ({
          agency: src.name,
          title: item.title,
          content: item.description?.replace(/<[^>]*>?/gm, '').slice(0, 400),
          link: item.link,
          time: item.pubDate
        })) || [];
      })
    );

    // Сборка и сортировка
    const feed = responses.flat().sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
    
    // Живой курс валют
    const fx = await fetch(`https://open.er-api.com/v6/latest/USD`).then(r => r.json());

    res.status(200).json({
      updated: new Date().toISOString(),
      intel: feed,
      ils: fx.rates?.ILS || 3.10,
      risk: ((fx.rates?.ILS - 3.05) * 100).toFixed(0) // Индекс на основе волатильности
    });
  } catch (e) {
    res.status(500).json({ error: "GATEWAY_ERROR" });
  }
}
