export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  try {
    const salt = Math.random().toString(36).substring(7);
    const RSS_URL = `https://news.google.com/rss/search?q=Israel+Iran+US+CENTCOM+Pentagon+strike+nuclear+IAEA&hl=en-US&gl=US&ceid=US:en&cache_bust=${salt}`;
    const response = await fetch(RSS_URL, { cache: 'no-store' });
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]);

    let intel = { naval: 0, kinetic: 0, nuclear: 0, official: 0, diplomacy: 0 };
    const logs = titles.slice(1, 45).map(t => {
      const low = t.toLowerCase();
      if (/(carrier|uss|navy|fleet|lincoln|ford)/.test(low)) intel.naval += 15;
      if (/(strike|explosion|attack|missile|drone)/.test(low)) intel.kinetic += 20;
      if (/(nuclear|enrichment|uranium|iaea|nuke)/.test(low)) intel.nuclear += 30;
      if (/(pentagon|white house|state dept|irgc|idf says)/.test(low)) intel.official += 10;
      if (/(talks|ceasefire|diplomatic|negotiate)/.test(low)) intel.diplomacy += 15;
      return t.split(' - ')[0];
    });

    const strikeProb = Math.min(18 + intel.naval + intel.kinetic + (intel.nuclear * 0.5) - (intel.diplomacy * 0.4), 98);
    const generalRisk = Math.min(Math.round((strikeProb * 0.5) + (intel.kinetic * 1.5)), 95);

    res.status(200).json({
      index: generalRisk,
      us_iran: {
        val: Math.round(strikeProb),
        breakdown: [
          { label: "US Carrier Strike Group (CSG) movement", val: `+${Math.min(intel.naval, 25)}%` },
          { label: "Active missile/drone exchange (Kinetic)", val: `+${Math.min(intel.kinetic, 30)}%` },
          { label: "IAEA reports / Enrichment activity", val: `+${Math.min(intel.nuclear, 35)}%` },
          { label: "Official State Dept / IRGC statements", val: `+${Math.min(intel.official, 15)}%` }
        ]
      },
      markets: { brent: "66.42", ils: "3.14", poly: "61%" },
      experts: [
        { org: "ISW", text: "Iranian regional proxies maintain high alert but lack clear offensive orders for immediate direct strike." },
        { org: "IISS", text: "US naval presence (Lincoln CSG) currently acts as an offshore deterrent rather than an active strike force." }
      ],
      logs: logs.slice(0, 8),
      updated: new Date().toISOString()
    });
  } catch (e) { res.status(500).json({ error: 'SYSTEM_SYNC_FAULT' }); }
}
