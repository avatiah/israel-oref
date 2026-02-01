export default async function handler(req, res) {
  try {
    // Поиск по ключевым словам прогноза и анализа
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+military+intelligence+forecast+analysis+strategic+report&hl=en-US';
    const response = await fetch(RSS_URL);
    const xml = await response.text();

    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 25);
    const pubDates = [...xml.matchAll(/<pubDate>(.*?)<\/pubDate>/g)].map(m => m[1]).slice(1, 25);

    // Распределяем данные по экспертным секторам
    const sectors = {
      MILITARY_OPS: [],
      STRATEGIC_INTEL: [],
      CYBER_MARKET: []
    };

    titles.forEach((t, i) => {
      const text = t.toLowerCase();
      const signal = { 
        text: t.split(' - ')[0], 
        time: new Date(pubDates[i]).toLocaleTimeString('he-IL', {hour:'2-digit', minute:'2-digit'}) 
      };

      if (/(missile|attack|border|strike|hezbollah|hamas)/.test(text)) sectors.MILITARY_OPS.push(signal);
      else if (/(intelligence|analysis|strategic|forecast|report|isw)/.test(text)) sectors.STRATEGIC_INTEL.push(signal);
      else if (/(cyber|market|ils|economic|bank)/.test(text)) sectors.CYBER_MARKET.push(signal);
    });

    // Расчет индекса на основе "плотности" экспертных мнений
    const expertWeight = sectors.STRATEGIC_INTEL.length * 8;
    const kineticWeight = sectors.MILITARY_OPS.length * 5;
    const finalIndex = Math.min(15 + expertWeight + kineticWeight, 100);

    res.status(200).json({
      index: finalIndex,
      last_update: new Date().toISOString(),
      sectors,
      verdict: finalIndex > 75 ? "HIGH_PROBABILITY_OF_ESCALATION" : "ROUTINE_MONITORING"
    });
  } catch (e) {
    res.status(500).json({ error: "ANALYSIS_FAILED" });
  }
}
