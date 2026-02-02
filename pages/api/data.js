export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+Iran+Hezbollah+US+strike+Pentagon&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]);

    // Методология IGTI
    let a_score = 15; // Events
    let b_score = 12; // Media
    titles.forEach(t => {
      const low = t.toLowerCase();
      if (/(siren|alarm|rocket|explosion|strike|attack)/.test(low)) a_score += 6;
      if (/(warns|vows|threatens|pentagon|white house|irgc)/.test(low)) b_score += 5;
    });

    const poly = 61;
    const igti = Math.round((0.5 * Math.min(a_score, 100)) + (0.3 * Math.min(b_score, 100)) + (0.2 * poly));
    const us_strike = Math.round((poly * 0.7) + (b_score * 0.3));

    const getLevel = (v) => v > 60 ? "Severe" : v > 40 ? "High" : "Elevated";

    res.status(200).json({
      igti,
      level: getLevel(igti),
      us_strike,
      breakdown: { events: Math.min(a_score, 100), media: Math.min(b_score, 100), markets: poly },
      markets: { brent: "66.42", ils: "3.14", poly: "61%" },
      experts: [
        { org: "ISW", text: "Tactical repositioning of IRGC assets detected in western corridors." },
        { org: "IISS", text: "US naval assets positioning suggests deterrent posture, not imminent action." },
        { org: "SOUFAN", text: "Regional proxy activity remains elevated; coordination spikes noted." }
      ],
      logs: titles.slice(0, 10).map(t => t.split(' - ')[0]),
      updated: new Date().toISOString()
    });
  } catch (e) { res.status(500).json({ error: 'SYNC_ERROR' }); }
}
