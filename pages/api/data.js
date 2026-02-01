export default async function handler(req, res) {
  try {
    // Используем RSS ленту Reuters, которую легко парсить текстом
    const RSS_URL = 'https://www.reutersagency.com/feed/?best-topics=world-news&post_type=best';
    const response = await fetch(RSS_URL);
    const xml = await response.text();

    // Извлекаем заголовки через регулярные выражения (чтобы не ставить парсер)
    const titles = [...xml.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g)].map(m => m[1]);
    const links = [...xml.matchAll(/<link>(.*?)<\/link>/g)].map(m => m[1]).slice(1);

    const signals = titles.slice(0, 10).map((t, i) => ({
      source: 'REUTERS_LIVE',
      title: t,
      link: links[i] || '#'
    }));

    // Логика анализа угроз
    const keywords = {
      military: ['missile', 'strike', 'idf', 'hezbollah', 'iran', 'attack', 'war'],
      rhetoric: ['warns', 'threatens', 'condemns', 'vows'],
      regional: ['border', 'lebanon', 'syria', 'gaza', 'tehran']
    };

    let blocks = { military: 30, rhetoric: 20, osint_activity: 40, regional: 15 };

    signals.forEach(s => {
      const text = s.title.toLowerCase();
      if (keywords.military.some(k => text.includes(k))) blocks.military += 12;
      if (keywords.rhetoric.some(k => text.includes(k))) blocks.rhetoric += 10;
      if (keywords.regional.some(k => text.includes(k))) blocks.regional += 5;
    });

    // Ограничиваем блоки до 100
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
    res.status(500).json({ error: "API_FETCH_ERROR", details: error.message });
  }
}
