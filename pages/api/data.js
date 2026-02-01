export default async function handler(req, res) {
  try {
    // Используем Google News для поиска по ключевым словам "Israel OSINT"
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+security+military&hl=en-US&gl=US&ceid=US:en';
    const response = await fetch(RSS_URL);
    const xml = await response.text();

    // Более гибкий парсинг заголовков и ссылок
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1);
    const links = [...xml.matchAll(/<link>(.*?)<\/link>/g)].map(m => m[1]).slice(1);

    const signals = titles.slice(0, 12).map((t, i) => ({
      source: 'INTEL_STREAM',
      title: t.replace(' - Google News', ''),
      link: links[i] || '#'
    }));

    // Базовые веса блоков
    let blocks = { military: 35, rhetoric: 25, osint_activity: 45, regional: 20 };

    // Анализ контента для изменения индекса
    const keywords = ['attack', 'missile', 'idf', 'iran', 'strike', 'hezbollah', 'explosion', 'border', 'war'];
    
    signals.forEach(s => {
      const text = s.title.toLowerCase();
      keywords.forEach(word => {
        if (text.includes(word)) {
          blocks.military += 5;
          blocks.osint_activity += 3;
        }
      });
    });

    // Ограничение 100%
    Object.keys(blocks).forEach(k => blocks[k] = Math.min(blocks[k], 100));

    const index = Math.round(
      (blocks.military * 0.4) + (blocks.rhetoric * 0.3) + 
      (blocks.osint_activity * 0.2) + (blocks.regional * 0.1)
    );

    res.status(200).json({
      last_update: new Date().toISOString(),
      index: index,
      blocks: blocks,
      signals: signals
    });
  } catch (error) {
    res.status(500).json({ error: "FEED_OFFLINE", details: error.message });
  }
}
