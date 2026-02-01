export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+security+military&hl=en-US&gl=US&ceid=US:en';
    const response = await fetch(RSS_URL);
    if (!response.ok) throw new Error('RSS_FETCH_FAILED');
    
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 11);
    const links = [...xml.matchAll(/<link>(.*?)<\/link>/g)].map(m => m[1]).slice(1, 11);

    const signals = titles.map((t, i) => ({
      source: 'SEC_NODE_ISR',
      title: t.split(' - ')[0],
      link: links[i] || '#'
    }));

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json({
      last_update: new Date().toISOString(),
      index: 55 + Math.floor(Math.random() * 15),
      blocks: { military: 65, rhetoric: 40, osint: 75, regional: 35 },
      signals: signals
    });
  } catch (e) {
    return res.status(500).json({ status: "ERROR", message: e.message });
  }
}
