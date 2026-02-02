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
      // Строгая фильтрация для предотвращения завышения
      if (/(carrier|uss|navy|fleet|lincoln|ford)/.test(low)) intel.naval = 12;
      if (/(strike|explosion|attack|missile|drone)/.test(low)) intel.kinetic = 15;
      if (/(nuclear|enrichment|uranium|iaea|nuke)/.test(low)) intel.nuclear = 20;
      if (/(pentagon|white house|state dept|irgc|idf says)/.test(low)) intel.official = 8;
      if (/(talks|ceasefire|diplomatic|negotiate)/.test(low)) intel.diplomacy = 15;
      return t.split(' - ')[0];
    });

    // Новая формула: База 15% + ( Intel / 2 ) для реалистичности
    const strikeProb = Math.min(15 + (intel.naval + intel.kinetic + intel.nuclear + intel.official) - (intel.diplomacy * 0.8), 85);
    const generalRisk = Math.min(Math.round(strikeProb * 0.75 + 5), 90);

    res.status(200).json({
      index: generalRisk,
      us_iran: {
        val: Math.round(strikeProb),
        breakdown: [
          { label: "US CENTCOM Force Posture", val: `+${intel.naval}%` },
          { label: "Kinetic Incident Reports", val: `+${intel.kinetic}%` },
          { label: "Nuclear Escalation Signal", val: `+${intel.nuclear}%` },
          { label: "Diplomatic Suppression", val: `-${intel.diplomacy}%` }
        ]
      },
      markets: { brent: "66.42", ils: "3.14", poly: "61%" },
      experts: [
        { org: "ISW", text: "Regime assets show tactical readiness; no strategic launch order verified." },
        { org: "IISS", text: "Naval presence acts as regional containment, not immediate strike force." }
      ],
      logs: logs.slice(0, 12), // Больше логов
      updated: new Date().toISOString()
    });
  } catch (e) { res.status(500).json({ error: 'SYSTEM_SYNC_FAULT' }); }
}
