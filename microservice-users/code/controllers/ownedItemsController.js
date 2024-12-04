export async function listOwnedItems(req, res) {
  const db = req.app.get('db');
  try {
    const [rows] = await db.execute('SELECT * FROM owned_items');
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error listing owned items:', error);
    res.status(500).send('An error occurred while listing the owned items.');
  }
}


export async function getOwnedItems(req, res) {
  const db = req.app.get('db');
  const { userID } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM owned_items WHERE userID = ?', [userID]);
    if (rows.length === 0) {
      return res.status(404).send('Owned items not found.');
    }
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error getting owned items:', error);
    res.status(500).send('An error occurred while getting the owned items.');
  }
}

export async function updateOwnedItems(req, res) {
  const db = req.app.get('db');
  const { userID } = req.params;
  const { itemID, itemPrice } = req.body;

  try {
    const [result] = await db.execute('UPDATE owned_items SET itemPrice = ? WHERE userID = ? AND itemID = ?', [itemPrice, userID, itemID]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Owned item not found.');
    }
    res.status(200).send('Owned item updated successfully.');
  } catch (error) {
    console.error('Error updating owned item:', error);
    res.status(500).send('An error occurred while updating the owned item.');
  }
}
