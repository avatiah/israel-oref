export default async function handler(req, res) {
  try {
    // Используем Google News RSS как стабильный и бесплатный источник
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+security+military+threat&hl=en-US&gl=US&ceid=US:en';
    const response = await fetch(RSS_URL);
    const xml = await response.text();

    // Парсинг заголовков и ссылок без внешних библиотек
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 12);
    const links = [...xml.matchAll(/<link>(.*?)<\/link>/g)].map(m => m[1]).slice(1, 12);

    const signals = titles.map((t, i) => ({
      source: 'INTEL_NODE_ALPHA',
      title: t.split(' - ')[0], // Убираем хвост "Google News"
      link: links[i] || '#'
    }));

    // Логика расчета блоков (имитация глубокого анализа)
    let blocks = { military: 45, rhetoric: 30, osint: 55, regional: 25 };
    
    // Поиск триггеров в заголовках для повышения индекса
    const triggers = ['attack', 'strike', 'missile', 'iran', 'hezbollah', 'lebanon', 'explosion', 'border'];
    signals.forEach(s => {
      const text = s.title.toLowerCase();
      triggers.forEach(t => {
        if (text.includes(t)) {
          blocks.military += 5;
          blocks.osint += 3;
        }
      });
    });

    // Ограничение до 100%
    Object.keys(blocks).forEach(k => blocks[k] = Math.min(blocks[k], 100));

    // Итоговый индекс по твоей формуле (40/30/20/10)
    const totalIndex = Math.round(
      (blocks.military * 0.4) + (blocks.rhetoric * 0.3) + 
      (blocks.osint * 0.2) + (blocks.regional * 0.1)
    );

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json({
      last_update: new Date().toISOString(),
      index: totalIndex,
      blocks: blocks,
      signals: signals
    });
  } catch (error) {
    res.status(500).json({ error: "OSINT_ENGINE_OFFLINE", details: error.message });
  }
}
