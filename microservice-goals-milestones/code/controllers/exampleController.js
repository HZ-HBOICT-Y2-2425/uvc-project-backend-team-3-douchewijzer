import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"tile": "Example Data","date": "September 2024"}, data: [] }
const db = await JSONFilePreset('db.json', defaultData)
const data = db.data.data

export async function responseGoals(req, res) {
  const db = req.app.get('db');
  const [rows] = await db.execute('SELECT * FROM goals');
  res.status(200).send(rows);
}

export async function updateGoals(req, res) {
  const db = req.app.get('db');
  let { id, name, type } = req.query;
  let time = new Date().toLocaleString();
  let example = { id, name, type, time };
  await db.execute('INSERT INTO goals (goalID, userID, goalAmount, coinValue, dataType, goalProgress) VALUES (?, ?, ?, ?, ?, ?)', [id, name, type, time, null, null]);
  res.status(201).send(`I added this example: ${JSON.stringify(example)}?`);
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
