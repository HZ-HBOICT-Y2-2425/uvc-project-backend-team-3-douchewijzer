import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"tile": "Example Data","date": "September 2024"}, data: [] }
const db = await JSONFilePreset('db.json', defaultData)
const data = db.data.data

export async function responseExample(req, res) {
  const db = req.app.get('db');
  const [rows] = await db.execute('SELECT * FROM goals');
  res.status(200).send(rows);
}

export async function updateExample(req, res) {
  const db = req.app.get('db');
  let { id, name, type } = req.query;
  let time = new Date().toLocaleString();
  let example = { id, name, type, time };
  await db.execute('INSERT INTO goals (goalID, userID, goalAmount, coinValue, dataType, goalProgress) VALUES (?, ?, ?, ?, ?, ?)', [id, name, type, time, null, null]);
  res.status(201).send(`I added this example: ${JSON.stringify(example)}?`);
}

export async function responseByIdExample(req, res) {
  const db = req.app.get('db');
  let id = req.params.id;
  const [rows] = await db.execute('SELECT * FROM goals WHERE goalID = ?', [id]);
  if (rows.length > 0) {
    res.status(200).send(rows[0]);
  } else {
    res.status(404).send('Example not found');
  }
}

export async function responseMilestones(req, res) {
  const db = req.app.get('db');
  const [rows] = await db.execute('SELECT * FROM milestone');
  res.status(200).send(rows);
}

export async function updateMilestone(req, res) {
  const db = req.app.get('db');
  let { id, userID, coinValue, dataType, milestoneAmount, milestoneProgress } = req.query;
  await db.execute('INSERT INTO milestone (milestoneID, userID, coinValue, dataType, milestoneAmount, milestoneProgress) VALUES (?, ?, ?, ?, ?, ?)', [id, userID, coinValue, dataType, milestoneAmount, milestoneProgress]);
  res.status(201).send(`Milestone added: ${JSON.stringify(req.query)}`);
}

export async function responseShops(req, res) {
  const db = req.app.get('db');
  const [rows] = await db.execute('SELECT * FROM shop');
  res.status(200).send(rows);
}

export async function updateShop(req, res) {
  const db = req.app.get('db');
  let { id, itemPrice, itemImage } = req.query;
  await db.execute('INSERT INTO shop (itemID, itemPrice, itemImage) VALUES (?, ?, ?)', [id, itemPrice, itemImage]);
  res.status(201).send(`Shop item added: ${JSON.stringify(req.query)}`);
}

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

export async function responseTimers(req, res) {
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

export async function responseUsers(req, res) {
  const db = req.app.get('db');
  const [rows] = await db.execute('SELECT * FROM users');
  res.status(200).send(rows);
}

export async function updateUser(req, res) {
  const db = req.app.get('db');
  let { id, userPreferenceID, email, userImage, name, coins } = req.query;
  await db.execute('INSERT INTO users (userID, userPreferenceID, email, userImage, name, coins) VALUES (?, ?, ?, ?, ?, ?)', [id, userPreferenceID, email, userImage, name, coins]);
  res.status(201).send(`User added: ${JSON.stringify(req.query)}`);
}

export async function responseUserPreferences(req, res) {
  const db = req.app.get('db');
  const [rows] = await db.execute('SELECT * FROM user_preference');
  res.status(200).send(rows);
}

export async function updateUserPreference(req, res) {
  const db = req.app.get('db');
  let { id, leaderbordNotificationPreference, leaderbordUploadPreference } = req.query;
  await db.execute('INSERT INTO user_preference (userPreferenceID, leaderbordNotificationPreference, leaderbordUploadPreference) VALUES (?, ?, ?)', [id, leaderbordNotificationPreference, leaderbordUploadPreference]);
  res.status(201).send(`User preference added: ${JSON.stringify(req.query)}`);
}
