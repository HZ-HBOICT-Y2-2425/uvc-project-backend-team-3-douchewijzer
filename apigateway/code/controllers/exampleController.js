import { JSONFilePreset } from "lowdb/node";

// Read or create db.json
// defaultData specifies the structure of the database
const defaultData = { meta: {"tile": "Example Data","date": "September 2024"}, data: [] }
const db = await JSONFilePreset('db.json', defaultData)
const data = db.data.data

export async function responseExample(req, res) {
  res.status(200).send(data);
}

export async function updateExample(req, res) {
  let id = req.query.id;
  let name = req.query.name;
  let type = req.query.type;
  let time = new Date().toLocaleString();
  let example = {id: id, name: name, type: type, time: time};  
  console.log(example);
  data.push(example);
  await db.write();

  res.status(201).send(`I added this example: ${JSON.stringify(example)}?`);
}

export async function responseByIdExample(req, res) {
  let id = req.params.id;
  let example = data.find(example => example.id === id);
  if (example) {
    res.status(200).send(example);
  } else {
    res.status(404).send('Example not found');
  }
}
