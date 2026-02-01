export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+military+intelligence+analysis+forecast&hl=en-US';
    const response = await fetch(RSS_URL);
    const xml = await response.text();

    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 20);
    const pubDates = [...xml.matchAll(/<pubDate>(.*?)<\/pubDate>/g)].map(m => m[1]).slice(1, 20);

    // 1. Детектор "Информационного взрыва"
    const now = new Date();
    const burstCount = pubDates.filter(d => (now - new Date(d)) / 60000 < 45).length;
    const burstFactor = Math.min(burstCount * 7, 40);

    // 2. Sentiment Analysis (Прогноз экспертов)
    let sentimentScore = 0;
    let expertVerdict = "DATA_STREAM_STABLE";

    titles.forEach(t => {
      const text = t.toLowerCase();
      if (/(imminent|high+probability|escalation|expected)/.test(text)) sentimentScore += 2;
      if (/(strike|attack|offensive|war)/.test(text)) sentimentScore += 3;
    });

    if (sentimentScore > 15) expertVerdict = "HIGH_PROBABILITY_OF_ESCALATION";
    else if (sentimentScore > 7) expertVerdict = "ELEVATED_TENSION_DETECTED";
    else if (burstFactor > 25) expertVerdict = "SUDDEN_DATA_BURST_MONITORING";

    const signals = titles.map((t, i) => ({
      title: t.split(' - ')[0],
      isExpert: /(analysis|report|isw|expert)/.test(t.toLowerCase()),
      time: new Date(pubDates[i]).toLocaleTimeString('he-IL', {hour:'2-digit', minute:'2-digit'})
    }));

    res.status(200).json({
      index: Math.min(15 + burstFactor + (sentimentScore * 2), 100),
      verdict: expertVerdict,
      factors: { burst: burstFactor, sentiment: sentimentScore },
      signals: signals.slice(0, 10)
    });
  } catch (e) {
    res.status(500).json({ error: "NODE_ERR" });
  }
}
