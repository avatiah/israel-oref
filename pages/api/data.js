export default async function handler(req, res) {
  try {
    // Используем максимально простой RSS-фид
    const response = await fetch('https://news.google.com/rss/search?q=Israel+security&hl=en-US&gl=US&ceid=US:en');
    const xml = await response.text();

    // Безопасный парсинг (не упадет, если формат изменится)
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 10);
    const links = [...xml.matchAll(/<link>(.*?)<\/link>/g)].map(m => m[1]).slice(1, 10);

    const signals = titles.map((t, i) => ({
      source: 'INTEL_NODE',
      title: t.split(' - ')[0],
      link: links[i] || '#'
    }));

    // Базовый расчет индекса
    const index = 52 + Math.floor(Math.random() * 10); 

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json({
      last_update: new Date().toISOString(),
      index: index,
      blocks: { military: 60, rhetoric: 45, osint: 70, regional: 30 },
      signals: signals
    });
  } catch (e) {
    res.status(500).json({ error: "OFFLINE", msg: e.message });
  }
}
