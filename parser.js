const Parser = require('rss-parser');
const fs = require('fs');
const parser = new Parser();

const feeds = [
  { url: 'https://www.understandingwar.org/rss.xml', source: 'ISW' },
  { url: 'https://www.bellingcat.com/feed/', source: 'Bellingcat' },
  { url: 'https://warontherocks.com/feed/', source: 'WarOnTheRocks' },
  { url: 'https://www.al-monitor.com/rss', source: 'AlMonitor' },
  { url: 'https://www.reutersagency.com/feed/?best-topics=middle-east', source: 'ReutersME' }
];

const militaryWords = ['missile','strike','attack','air defense','deployment','forces','military'];
const rhetoricWords = ['threat','warning','retaliation','ultimatum','response'];
const regionalWords = ['iran','israel','hezbollah','syria','gulf','lebanon'];

function countMatches(text, words) {
  text = text.toLowerCase();
  return words.filter(w => text.includes(w)).length;
}

(async () => {
  let militaryCount = 0;
  let rhetoricCount = 0;
  let regionalCount = 0;
  let totalArticles = 0;
  let signals = [];

  for (const feed of feeds) {
    const data = await parser.parseURL(feed.url);
    data.items.slice(0,5).forEach(item => {
      const text = (item.title + ' ' + item.contentSnippet).toLowerCase();
      militaryCount += countMatches(text, militaryWords);
      rhetoricCount += countMatches(text, rhetoricWords);
      regionalCount += countMatches(text, regionalWords);
      totalArticles++;

      signals.push({
        source: feed.source,
        title: item.title,
        link: item.link,
        date: item.pubDate
      });
    });
  }

  const avg = 5; // базовый фон
  const calc = c => c <= avg ? 25 : c <= avg*1.5 ? 50 : c <= avg*2 ? 75 : 100;

  const militaryScore = calc(militaryCount);
  const rhetoricScore = calc(rhetoricCount);
  const regionalScore = calc(regionalCount);
  const osintScore = calc(totalArticles);

  const index = militaryScore*0.35 + rhetoricScore*0.25 + osintScore*0.2 + regionalScore*0.2;

  const output = {
    last_update: new Date().toISOString(),
    index: Math.round(index),
    trend: 0,
    blocks: {
      military: militaryScore,
      rhetoric: rhetoricScore,
      osint_activity: osintScore,
      regional: regionalScore
    },
    signals: signals.slice(0,5)
  };

  fs.writeFileSync('./data/data.json', JSON.stringify(output, null, 2));
})();
