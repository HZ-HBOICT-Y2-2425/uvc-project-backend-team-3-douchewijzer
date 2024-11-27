export async function responseShop(req, res) {
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