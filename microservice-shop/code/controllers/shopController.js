export async function responseShop(req, res) {
  const db = req.app.get('db');
  try {
    const [rows] = await db.execute('SELECT * FROM shop');
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error fetching shop items:', error);
    res.status(500).send(`An error occurred while fetching shop items: ${error.message}`);
  }
}

export async function changeShop(req, res) {
  const db = req.app.get('db');
  const { itemID } = req.params;
  const { itemPrice, itemImage } = req.query;

  const fields = [];
  const values = [];

  if (itemPrice !== undefined) {
    fields.push('itemPrice = ?');
    values.push(itemPrice);
  }
  if (itemImage !== undefined) {
    fields.push('itemImage = ?');
    values.push(itemImage);
  }

  if (fields.length === 0) {
    return res.status(400).send('No fields to update.');
  }

  values.push(itemID);

  const query = `UPDATE shop SET ${fields.join(', ')} WHERE itemID = ?`;

  try {
    const [result] = await db.execute(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).send('Shop item not found.');
    }
    res.status(200).send('Shop item updated successfully.');
  } catch (error) {
    console.error('Error updating shop item:', error);
    res.status(500).send(`An error occurred while updating the shop item: ${error.message}`);
  }
}

export async function deleteShop(req, res) {
  const db = req.app.get('db');
  const { itemID } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM shop WHERE itemID = ?', [itemID]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Shop item not found.');
    }
    res.status(200).send(`Shop item deleted: ${itemID}`);
  } catch (error) {
    console.error('Error deleting shop item:', error);
    res.status(500).send(`An error occurred while deleting the shop item: ${error.message}`);
  }
}

export async function getShopItem(req, res) {
  const db = req.app.get('db');
  const { itemID } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM shop WHERE itemID = ?', [itemID]);
    if (rows.length === 0) {
      return res.status(404).send('Shop item not found.');
    }
    res.status(200).send(rows[0]);
  } catch (error) {
    console.error('Error fetching shop item:', error);
    res.status(500).send(`An error occurred while fetching the shop item: ${error.message}`);
  }
}