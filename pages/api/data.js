export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+security+military+strategic+analysis+forecast&hl=en-US';
    const response = await fetch(RSS_URL);
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 30);

    let kinetic = 0;   // Боевые действия
    let strategic = 0; // Аналитика
    let deescalation = 0; // Смягчающие факторы (новое!)

    titles.forEach(t => {
      const text = t.toLowerCase();
      // Угрозы
      if (/(missile|attack|clash|bombardment|killing|explosion)/.test(text)) kinetic += 2;
      if (/(intelligence|forecast|warning|threat|alert|iran|hezbollah)/.test(text)) strategic += 1.5;
      
      // Смягчающие факторы (снижают индекс)
      if (/(ceasefire|reopening|negotiations|humanitarian|opening|truce|peace)/.test(text)) deescalation += 3;
    });

    // Расчет весов (теперь они более сбалансированы)
    const f1 = Math.min(kinetic * 3, 35);   
    const f2 = Math.min(strategic * 4, 35); 
    const f3 = Math.max(0, deescalation * 2); // Бонус за мирные новости

    // Формула: База 20% + Угрозы - Смягчение
    let finalIndex = 20 + f1 + f2 - f3;
    
    // Ограничитель: Индекс не может быть > 85%, если нет слов "Massive" или "War declared"
    if (finalIndex > 85 && !titles.some(t => /massive|all-out war|declaration/i.test(t))) {
      finalIndex = 82;
    }

    res.status(200).json({
      index: Math.max(15, Math.round(finalIndex)), // Минимум 15%
      breakdown: [
        { name: 'KINETIC_ACTIVITY', value: Math.round(f1), desc: 'Direct combat and strikes.' },
        { name: 'STRATEGIC_PRESSURE', value: Math.round(f2), desc: 'Threat assessments and intel.' },
        { name: 'DE-ESCALATION_SIGNS', value: Math.round(f3), desc: 'Active diplomatic or humanitarian progress.' }
      ],
      key_argument: titles.find(t => /analysis|indicates|opening|reopens/i.test(t))?.split(' - ')[0] || "Regional stabilization efforts detected.",
      last_update: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: "CALIBRATION_OFFLINE" });
  }
}
