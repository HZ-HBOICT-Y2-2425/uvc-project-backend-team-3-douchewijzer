export async function responseStatistics(req, res) {
  const db = req.app.get('db');
  const [rows] = await db.execute('SELECT * FROM statistics');
  res.status(200).send(rows);
}

export async function updateStatistic(req, res) {
  const db = req.app.get('db');
  let { id, userID, gasUsage, temperature, currentCosts, waterUsage, carbonEmission, totalCost, totalGasUsage, averageTemperature, totalWaterUsage } = req.query;
  await db.execute('INSERT INTO statistics (statisticsID, userID, gasUsage, temperature, currentCosts, waterUsage, carbonEmission, totalCost, totalGasUsage, averageTemperature, totalWaterUsage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, userID, gasUsage, temperature, currentCosts, waterUsage, carbonEmission, totalCost, totalGasUsage, averageTemperature, totalWaterUsage]);
  res.status(201).send(`Statistic added: ${JSON.stringify(req.query)}`);
}