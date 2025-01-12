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
    res.status(500).send(`An error occurred while fetching badge items: ${error.message}`);
  }
}

export async function getBadgeItem(req, res) {
  const pool = req.app.get('db');
  const { badgeID } = req.params;
  try {
    const rows = await executeQuery(pool, 'SELECT * FROM badges WHERE badgeID = ?', [badgeID]);
    if (rows.length === 0) {
      return res.status(404).send('badge item not found.');
    }
    res.status(200).send(rows[0]);
  } catch (error) {
    res.status(500).send(`An error occurred while fetching the badge item: ${error.message}`);
  }
}

export async function changeBadge(req, res) {
  const pool = req.app.get('db');
  const { badgeID } = req.params;
  const { badgeName, badgeDescription, badgeImage } = req.query;

  const fields = [];
  const values = [];

  if (badgeName !== undefined) {
    fields.push('badgeName = ?');
    values.push(badgeName);
  }
  if (badgeDescription !== undefined) {
    fields.push('badgeDescription = ?');
    values.push(badgeDescription);
  }
  if (badgeImage !== undefined) {
    fields.push('badgeImage = ?');
    values.push(badgeImage);
  }

  if (fields.length === 0) {
    return res.status(400).send('No fields to update.');
  }

  values.push(badgeID);

  const query = `UPDATE badges SET ${fields.join(', ')} WHERE badgeID = ?`;

  try {
    const result = await executeQuery(pool, query, values);
    if (result.affectedRows === 0) {
      return res.status(404).send('badge item not found.');
    }
    res.status(200).send('badge item updated successfully.');
  } catch (error) {
    res.status(500).send(`An error occurred while updating the badge item: ${error.message}`);
  }
}

export async function deleteBadge(req, res) {
  const pool = req.app.get('db');
  const { badgeID } = req.params;
  try {
    const result = await executeQuery(pool, 'DELETE FROM badges WHERE badgeID = ?', [badgeID]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Badge item not found.');
    }
    res.status(200).send(`Badge item deleted: ${badgeID}`);
  } catch (error) {
    res.status(500).send(`An error occurred while deleting the badge item: ${error.message}`);
  }
}

export async function addBadge(req, res) {
  const pool = req.app.get('db');
  const { badgeName, badgeDescription, badgeImage } = req.query;

  if (!badgeName || !badgeDescription || !badgeImage) {
    return res.status(400).send('All fields (badgeName, badgeDescription, badgeImage) are required.');
  }

  const query = 'INSERT INTO badges (badgeName, badgeDescription, badgeImage) VALUES (?, ?, ?)';
  const values = [badgeName, badgeDescription, badgeImage];

  try {
    const result = await executeQuery(pool, query, values);
    res.status(201).send(`Badge item added with ID: ${result.insertId}`);
  } catch (error) {
    res.status(500).send(`An error occurred while adding the badge item: ${error.message}`);
  }
}