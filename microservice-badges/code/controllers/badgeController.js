async function executeQuery(pool, query, params) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

export async function responsebadge(req, res) {
  const pool = req.app.get('db');
  try {
    const rows = await executeQuery(pool, 'SELECT * FROM badges');
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error fetching badge items:', error);
    res.status(500).send(`An error occurred while fetching badge items: ${error.message}`);
  }
}

export async function changeBadge(req, res) {
  const pool = req.app.get('db');
  const { itemID } = req.params;
  const { itemValue, itemImage } = req.query;

  const fields = [];
  const values = [];

  if (itemValue !== undefined) {
    fields.push('itemValue = ?');
    values.push(itemValue);
  }
  if (itemImage !== undefined) {
    fields.push('itemImage = ?');
    values.push(itemImage);
  }

  if (fields.length === 0) {
    return res.status(400).send('No fields to update.');
  }

  values.push(itemID);

  const query = `UPDATE badges SET ${fields.join(', ')} WHERE itemID = ?`;

  try {
    const result = await executeQuery(pool, query, values);
    if (result.affectedRows === 0) {
      return res.status(404).send('badge item not found.');
    }
    res.status(200).send('badge item updated successfully.');
  } catch (error) {
    console.error('Error updating badge item:', error);
    res.status(500).send(`An error occurred while updating the badge item: ${error.message}`);
  }
}

export async function deleteBadge(req, res) {
  const pool = req.app.get('db');
  const { itemID } = req.params;
  try {
    const result = await executeQuery(pool, 'DELETE FROM badges WHERE itemID = ?', [itemID]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Badge item not found.');
    }
    res.status(200).send(`Badge item deleted: ${itemID}`);
  } catch (error) {
    console.error('Error deleting badge item:', error);
    res.status(500).send(`An error occurred while deleting the badge item: ${error.message}`);
  }
}

export async function getBadgeItem(req, res) {
  const pool = req.app.get('db');
  const { itemID } = req.params;
  try {
    const rows = await executeQuery(pool, 'SELECT * FROM badges WHERE itemID = ?', [itemID]);
    if (rows.length === 0) {
      return res.status(404).send('badge item not found.');
    }
    res.status(200).send(rows[0]);
  } catch (error) {
    console.error('Error fetching badge item:', error);
    res.status(500).send(`An error occurred while fetching the badge item: ${error.message}`);
  }
}