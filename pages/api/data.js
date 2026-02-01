import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "signals.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const signals = JSON.parse(rawData);

    const blocks = {
      military: 0,
      rhetoric: 0,
      osint_activity: 0,
      regional: 0
    };

    const now = new Date();

    signals.forEach(signal => {
      const signalDate = new Date(signal.date);
      const hoursDiff = (now - signalDate) / (1000 * 60 * 60);

      if (hoursDiff <= 24) {
        if (signal.title.toLowerCase().includes("forces") || signal.title.toLowerCase().includes("troops")) blocks.military += 10;
        if (signal.title.toLowerCase().includes("tension") || signal.title.toLowerCase().includes("rhetoric")) blocks.rhetoric += 10;
        blocks.osint_activity += 10;
        if (signal.title.toLowerCase().includes("region") || signal.title.toLowerCase().includes("border")) blocks.regional += 10;
      }
    });

    // Ограничиваем блоки до 100
    Object.keys(blocks).forEach(key => { if (blocks[key] > 100) blocks[key] = 100; });

    const index = Math.round(
      blocks.military * 0.4 +
      blocks.rhetoric * 0.3 +
      blocks.osint_activity * 0.2 +
      blocks.regional * 0.1
    );

    res.status(200).json({
      last_update: now.toISOString(),
      index,
      blocks,
      signals
    });
  } catch (error) {
    res.status(500).json({ error: "Ошибка генерации данных", details: error.message });
  }
}
