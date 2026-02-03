export default async function handler(req, res) {
  try {
    const data = {
      updated: new Date().toISOString(),
      total_index: 82,
      strategic_summary: "Региональный конфликт перешел в стадию синхронизации фронтов. Иран координирует действия прокси-сил.",
      fronts: {
        iran: {
          score: 88,
          forces: "КСИР / Аэрокосмические силы",
          threat: "Баллистические пуски, блокада Ормуза.",
          analyst_view: "Повышенная готовность в шахтных пусковых установках."
        },
        north_front: {
          score: 84,
          forces: "Хезболла (Радван)",
          threat: "Прорыв границы, массированный обстрел.",
          analyst_view: "Завершено развертывание полевых госпиталей в Южном Ливане."
        }
      }
    };
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "INTERNAL_NODE_FAILURE" });
  }
}
