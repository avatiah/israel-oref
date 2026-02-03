export default async function handler(req, res) {
  // Имитация агрегированного анализа от OSINT-специалистов
  const reports = [
    {
      source: "ISW",
      topic: "Frontier Activity",
      impact: "HIGH",
      summary: "Зафиксировано движение элитных подразделений к границе. Подготовка артиллерийских позиций завершена на 85%."
    },
    {
      source: "S&P GLOBAL",
      topic: "Energy Risk",
      impact: "MEDIUM",
      summary: "Рынок закладывает риск закрытия Ормузского пролива. Ожидаемый скачок цен: +12% в случае начала активной фазы."
    }
  ];

  // РАСЧЕТ ИНДЕКСА БЕЗОПАСНОСТИ (0 - Безопасно, 100 - Критично)
  // В реальности здесь будет логика веса каждого отчета
  const safetyIndex = 82; 
  
  const conclusion = "Ситуация перешла в фазу 'непосредственной подготовки'. Рекомендуется проверка систем оповещения и запасов автономности. Окно предупреждения сократилось до нескольких часов.";

  res.status(200).json({
    updated: new Date().toISOString(),
    index: safetyIndex,
    status: "CRITICAL_PREPARATION",
    conclusion: conclusion,
    reports: reports
  });
}
