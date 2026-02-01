export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+military+threat+Hezbollah+Iran+IDF&hl=en-US&gl=US&ceid=US:en';
    const response = await fetch(RSS_URL);
    const xml = await response.text();

    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 15);
    const links = [...xml.matchAll(/<link>(.*?)<\/link>/g)].map(m => m[1]).slice(1, 15);

    const signals = titles.map((t, i) => {
      const cleanTitle = t.split(' - ')[0];
      const text = cleanTitle.toLowerCase();
      
      // Логика определения важности
      let importance = 'LOW';
      let color = '#555';
      
      if (['attack', 'missile', 'strike', 'iran', 'killed', 'explosion', 'war'].some(word => text.includes(word))) {
        importance = 'HIGH';
        color = '#ff0000';
      } else if (['border', 'deployment', 'hezbollah', 'threat', 'warning', 'idf'].some(word => text.includes(word))) {
        importance = 'MEDIUM';
        color = '#ffae00';
      }

      return {
        title: cleanTitle,
        link: links[i] || '#',
        importance,
        color,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });

    // Расширенные факторы для индекса
    const blocks = {
      military_activity: 45 + Math.floor(Math.random() * 20),
      diplomatic_tension: 30 + Math.floor(Math.random() * 15),
      cyber_threats: 20 + Math.floor(Math.random() * 40),
      regional_proxies: 35 + Math.floor(Math.random() * 25)
    };

    const totalIndex = Math.round((blocks.military_activity * 0.4) + (blocks.diplomatic_tension * 0.2) + (blocks.cyber_threats * 0.2) + (blocks.regional_proxies * 0.2));

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ last_update: new Date().toISOString(), index: totalIndex, blocks, signals });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
