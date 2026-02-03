export default async function handler(req, res) {
  // Имитация высокоуровневого OSINT-анализа (Fallback)
  const strategicReports = [
    {
      agency: "ISW_ANALYSIS",
      title: "Эскалация северного фронта: оценка потенциала",
      summary: "Аналитики отмечают перегруппировку сил в Южном Ливане. Вероятность трансграничного удара оценивается как высокая в ближайшие 48-72 часа.",
      link: "https://understandingwar.org",
      level: "CRITICAL"
    },
    {
      agency: "S&P_GLOBAL",
      title: "Энергетический сектор: влияние на рынок нефти",
      summary: "Премия за геополитический риск в цене Brent увеличилась. Прогноз волатильности на неделю: 15-18%.",
      link: "https://spglobal.com",
      level: "ELEVATED"
    },
    {
      agency: "OSINT_DEFENDER",
      title: "Активность ВВС: данные спутникового мониторинга",
      summary: "Зафиксировано увеличение логистических рейсов на авиабазы. Индекс готовности ПВО повышен до уровня 4.",
      link: "#",
      level: "STABLE"
    }
  ];

  res.status(200).json({
    updated: new Date().toISOString(),
    index_score: 78, // ИНДЕКС ТЫЛА (0-100)
    reports: strategicReports,
    status: "RED_ZONE"
  });
}
