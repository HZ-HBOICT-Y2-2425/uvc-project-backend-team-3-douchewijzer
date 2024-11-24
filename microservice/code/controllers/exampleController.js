import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"tile": "Example Data","date": "September 2024"}, data: [] }
const db = await JSONFilePreset('db.json', defaultData)
const data = db.data.data

export async function responseExample(req, res) {
  const db = req.app.get('db');
  const [rows] = await db.execute('SELECT * FROM examples');
  res.status(200).send(rows);
}

export async function updateExample(req, res) {
  const db = req.app.get('db');
  let { id, name, type } = req.query;
  let time = new Date().toLocaleString();
  let example = { id, name, type, time };
  await db.execute('INSERT INTO examples (id, name, type, time) VALUES (?, ?, ?, ?)', [id, name, type, time]);
  res.status(201).send(`I added this example: ${JSON.stringify(example)}?`);
}

export async function responseByIdExample(req, res) {
  const db = req.app.get('db');
  let id = req.params.id;
  const [rows] = await db.execute('SELECT * FROM examples WHERE id = ?', [id]);
  if (rows.length > 0) {
    res.status(200).send(rows[0]);
  } else {
    res.status(404).send('Example not found');
  }
}
