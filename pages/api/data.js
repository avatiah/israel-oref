export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+Rafah+opening+ceasefire+Iran+US+tensions&hl=en-US';
    const response = await fetch(RSS_URL);
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 40);

    let kinetic = 0, strategic = 0, deescalation = 0, usIran = 0;
    
    titles.forEach(t => {
      const text = t.toLowerCase();
      // Kinetic: only serious incidents count (IDF operations, rocket fire)
      if (/(missile|direct hit|heavy bombardment|barrage|casualty)/.test(text)) kinetic += 1.5;
      // Strategic: general noise
      if (/(warning|tension|intelligence|alert|mobilization)/.test(text)) strategic += 0.5;
      // De-escalation: HEAVY weight for ceasefire and border openings
      if (/(ceasefire|rafah opening|humanitarian aid|truce|hostage deal|reopens|pilot operation)/.test(text)) deescalation += 4.5;
      // US-Iran Theater (Isolated)
      if (/(carrier|strike group|pentagon|nuclear|iran war)/.test(text)) usIran += 5.0;
    });

    // SOBER CALCULATION: Starting at 15% (Standard regional tension)
    const baseIndex = 15 + (kinetic * 2) + (strategic * 1) - (deescalation * 5);
    const liveIndex = Math.max(15, Math.min(Math.round(baseIndex), 98));
    
    const iranStrikeIndex = Math.max(5, Math.min(Math.round(5 + usIran), 100));

    // Forecast is now more balanced: (Israel Status + 25% of Iran Threat)
    const finalForecast = Math.min(Math.round(liveIndex + (iranStrikeIndex * 0.25)), 100);

    res.status(200).json({
      live: {
        index: liveIndex,
        verdict: liveIndex > 60 ? 'HIGH_ALERT' : liveIndex > 30 ? 'NORMAL_VOLATILITY' : 'STABILIZED_ZONE',
        breakdown: [
          { name: 'ACTIVE_CONFLICT', value: Math.round(Math.min(kinetic * 2.5, 30)) },
          { name: 'REGIONAL_NOISE', value: Math.round(Math.min(strategic * 1.5, 30)) },
          { name: 'DE-ESCALATION_STRENGTH', value: Math.round(Math.min(deescalation * 5, 40)) }
        ]
      },
      forecast: { index: finalForecast, verdict: 'STRATEGIC_OUTLOOK' },
      iran_strike: { index: iranStrikeIndex, status: iranStrikeIndex > 80 ? 'CRITICAL' : 'DETERRENCE' },
      signals: titles.slice(0, 5).map(t => t.split(' - ')[0]),
      last_update: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: "CALIBRATION_OFFLINE" });
  }
}
