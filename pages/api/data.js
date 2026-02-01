export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+security+military+strike+siren&hl=en-US';
    const response = await fetch(RSS_URL);
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).toLowerCase();

    // Список ключевых узлов для тепловой карты
    const cities = {
      'Kiriat_Shmona': { keywords: ['kiryat shmona', 'metula', 'north border'], intensity: 0 },
      'Haifa': { keywords: ['haifa', 'akkо', 'krayot'], intensity: 0 },
      'Tel_Aviv': { keywords: ['tel aviv', 'gush dan', 'center'], intensity: 0 },
      'Jerusalem': { keywords: ['jerusalem', 'capital', 'west bank'], intensity: 0 },
      'Ashdod': { keywords: ['ashdod', 'ashkelon', 'gaza border'], intensity: 0 },
      'Beersheba': { keywords: ['beersheba', 'negev', 'south'], intensity: 0 }
    };

    // Считаем упоминания
    Object.keys(cities).forEach(city => {
      cities[city].keywords.forEach(word => {
        const matches = titles.join(' ').split(word).length - 1;
        cities[city].intensity += matches;
      });
    });

    res.status(200).json({
      heatmap: cities,
      last_update: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: 'HEATMAP_SYNC_FAILED' });
  }
}
