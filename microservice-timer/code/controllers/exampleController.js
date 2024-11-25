export async function responseTimer(req, res) {
  const db = req.app.get('db');
  const [rows] = await db.execute('SELECT * FROM timer');
  res.status(200).send(rows);
}

export async function updateTimer(req, res) {
  const db = req.app.get('db');
  let { id, userID, userMinutes, currentCost, currentTemperature, timeSetting } = req.query;
  await db.execute('INSERT INTO timer (timerID, userID, userMinutes, currentCost, currentTemperature, timeSetting) VALUES (?, ?, ?, ?, ?, ?)', [id, userID, userMinutes, currentCost, currentTemperature, timeSetting]);
  res.status(201).send(`Timer added: ${JSON.stringify(req.query)}`);
}