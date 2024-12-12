async function executeQuery(db, query, params) {
  try {
    return await db.execute(query, params);
  } catch (error) {
    if (error.message.includes('closed state')) {
      console.error('Database connection was closed. Reconnecting...');
      await db.connect();
      return await db.execute(query, params);
    }
    throw error;
  }
}

export async function responseMilestones(req, res) {
  const db = req.app.get('db');
  try {
    const [rows] = await executeQuery(db, 'SELECT * FROM milestone');
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error fetching milestones:', error);
    res.status(500).send(`An error occurred while fetching milestones: ${error.message}`);
  }
}

export async function responseMilestonesByUser(req, res) {
  const db = req.app.get('db');
  const { userID } = req.params;
  try {
    const [rows] = await executeQuery(db, 'SELECT * FROM milestone WHERE userID = ?', [userID]);
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error fetching milestones by user:', error);
    res.status(500).send(`An error occurred while fetching milestones by user: ${error.message}`);
  }
}

export async function updateMilestoneById(req, res) {
  const db = req.app.get('db');
  const { milestoneID } = req.params;
  const { userID, coinValue, dataType, milestoneAmount, milestoneProgress } = { ...req.body, ...req.query };

  const fields = [];
  const values = [];

  if (userID !== undefined) {
    fields.push('userID = ?');
    values.push(userID);
  }
  if (coinValue !== undefined) {
    fields.push('coinValue = ?');
    values.push(coinValue);
  }
  if (dataType !== undefined) {
    fields.push('dataType = ?');
    values.push(dataType);
  }
  if (milestoneAmount !== undefined) {
    fields.push('milestoneAmount = ?');
    values.push(milestoneAmount);
  }
  if (milestoneProgress !== undefined) {
    fields.push('milestoneProgress = ?');
    values.push(milestoneProgress);
  }

  if (fields.length === 0) {
    return res.status(400).send('No fields to update.');
  }

  values.push(milestoneID);

  const query = `UPDATE milestone SET ${fields.join(', ')} WHERE milestoneID = ?`;

  try {
    const [result] = await executeQuery(db, query, values);
    if (result.affectedRows === 0) {
      return res.status(404).send('Milestone not found.');
    }
    res.status(200).send('Milestone updated successfully.');
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).send(`An error occurred while updating the milestone: ${error.message}`);
  }
}

export async function deleteMilestoneById(req, res) {
  const db = req.app.get('db');
  const { milestoneID } = req.params;
  try {
    await executeQuery(db, 'DELETE FROM milestone WHERE milestoneID = ?', [milestoneID]);
    res.status(200).send(`Milestone deleted with ID: ${milestoneID}`);
  } catch (error) {
    console.error('Error deleting milestone:', error);
    res.status(500).send(`An error occurred while deleting the milestone: ${error.message}`);
  }
}

export async function addMilestone(req, res) {
  const db = req.app.get('db');
  const { userID, coinValue = null, dataType = null, milestoneAmount = null, milestoneProgress = null } = { ...req.body, ...req.query };

  if (!userID) {
    return res.status(400).send('userID is required.');
  }

  try {
    await executeQuery(db, 'INSERT INTO milestone (userID, coinValue, dataType, milestoneAmount, milestoneProgress) VALUES (?, ?, ?, ?, ?)', [userID, coinValue, dataType, milestoneAmount, milestoneProgress]);
    res.status(201).send('Milestone added successfully.');
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      res.status(400).send('An error occurred while adding the milestone: The specified userID does not exist.');
    } else {
      console.error('Error adding milestone:', error);
      res.status(500).send(`An error occurred while adding the milestone: ${error.message}`);
    }
  }
}
