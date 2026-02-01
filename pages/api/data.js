export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+security+military+alert&hl=en-US&gl=US&ceid=US:en';
    const response = await fetch(RSS_URL);
    const xml = await response.text();

    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 15);
    const links = [...xml.matchAll(/<link>(.*?)<\/link>/g)].map(m => m[1]).slice(1, 15);

    let geo = { north: false, south: false, center: false, gaza: false, westbank: false };
    let criticalEvents = 0;
    
    const signals = titles.map((t, i) => {
      const text = t.toLowerCase();
      if (/north|lebanon|haifa|metula/.test(text)) geo.north = true;
      if (/gaza|hamas|rafah/.test(text)) geo.gaza = true;
      if (/south|negev|eilat/.test(text)) geo.south = true;
      if (/tel aviv|central|airport/.test(text)) geo.center = true;
      if (/west bank|jenin|nablus/.test(text)) geo.westbank = true;

      let importance = 'LOW', color = '#555';
      if (/(attack|missile|rocket|explosion|strike|hit)/.test(text)) {
        importance = 'HIGH'; color = '#ff0000'; criticalEvents += 1;
      } else if (/(alert|drone|intercept|siren|idf|hezbollah)/.test(text)) {
        importance = 'MEDIUM'; color = '#ffae00';
      }

      return { 
        title: t.split(' - ')[0], 
        link: links[i], 
        importance, 
        color,
        timestamp: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) 
      };
    });

    // Расчет составляющих
    const baseLoad = 15;
    const geoScore = Object.values(geo).filter(v => v).length * 8;
    const eventScore = Math.min(criticalEvents * 12, 45);
    const totalIndex = Math.min(baseLoad + geoScore + eventScore, 100);

    res.status(200).json({
      last_update: new Date().toISOString(),
      index: totalIndex,
      breakdown: { base: baseLoad, geo: geoScore, events: eventScore },
      geo,
      signals: signals.slice(0, 10)
    });
  } catch (e) {
    res.status(500).json({ error: "OFFLINE" });
  }
}
