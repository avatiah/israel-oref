export default async function handler(req, res) {
  let reports = [];

  try {
    // Агрегация отчетов из источников высшего эшелона (через аналитические RSS)
    const rssSources = [
      'https://api.rss2json.com/v1/api.json?rss_url=https://understandingwar.org/rss.xml', // ISW
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.crisisgroup.org/rss/all/rss.xml' // Crisis Group
    ];

    const response = await fetch(rssSources[0]);
    const data = await response.json();

    reports = data.items?.slice(0, 8).map(item => ({
      agency: "INST_STUDY_WAR",
      title: item.title,
      summary: item.description?.replace(/<[^>]*>?/gm, '').slice(0, 180) + "...",
      link: item.link,
      date: new Date(item.pubDate).toLocaleDateString()
    })) || [];

  } catch (e) {
    console.error("ANALYSIS_SYNC_FAILED");
  }

  res.status(200).json({
    updated: new Date().toISOString(),
    reports: reports,
    risk_assessment: "ELEVATED_VOLATILITY" // Консенсус-статус
  });
}
