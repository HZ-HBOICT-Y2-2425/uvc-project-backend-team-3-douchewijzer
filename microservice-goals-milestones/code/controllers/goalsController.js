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

export async function responseGoals(req, res) {
  const db = req.app.get('db');
  try {
    const [rows] = await executeQuery(db, 'SELECT * FROM goals');
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).send(`An error occurred while fetching goals: ${error.message}`);
  }
}

export async function responseGoalsByUser(req, res) {
  const db = req.app.get('db');
  const { userID } = req.params;
  try {
    const [rows] = await executeQuery(db, 'SELECT * FROM goals WHERE userID = ?', [userID]);
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error fetching goals by user:', error);
    res.status(500).send(`An error occurred while fetching goals by user: ${error.message}`);
  }
}

export async function updateGoalById(req, res) {
  const db = req.app.get('db');
  const { goalID } = req.params;
  const { name, type, goalAmount, coinValue, dataType, goalProgress } = { ...req.body, ...req.query };

  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push('name = ?');
    values.push(name);
  }
  if (type !== undefined) {
    fields.push('type = ?');
    values.push(type);
  }
  if (goalAmount !== undefined) {
    fields.push('goalAmount = ?');
    values.push(goalAmount);
  }
  if (coinValue !== undefined) {
    fields.push('coinValue = ?');
    values.push(coinValue);
  }
  if (dataType !== undefined) {
    fields.push('dataType = ?');
    values.push(dataType);
  }
  if (goalProgress !== undefined) {
    fields.push('goalProgress = ?');
    values.push(goalProgress);
  }

  if (fields.length === 0) {
    return res.status(400).send('No fields to update.');
  }

  values.push(goalID);

  const query = `UPDATE goals SET ${fields.join(', ')} WHERE goalID = ?`;

  try {
    const [result] = await executeQuery(db, query, values);
    if (result.affectedRows === 0) {
      return res.status(404).send('Goal not found.');
    }
    res.status(200).send('Goal updated successfully.');
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).send(`An error occurred while updating the goal: ${error.message}`);
  }
}

export async function deleteGoalById(req, res) {
  const db = req.app.get('db');
  const { goalID } = req.params;
  try {
    await executeQuery(db, 'DELETE FROM goals WHERE goalID = ?', [goalID]);
    res.status(200).send(`Goal deleted with ID: ${goalID}`);
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).send(`An error occurred while deleting the goal: ${error.message}`);
  }
}

export async function addGoal(req, res) {
  const db = req.app.get('db');
  const { userID, goalAmount = null, coinValue = null, dataType = null, goalProgress = null } = req.body;

  if (!userID) {
    return res.status(400).send('userID is required.');
  }

  try {
    await executeQuery(db, 'INSERT INTO goals (userID, goalAmount, coinValue, dataType, goalProgress) VALUES (?, ?, ?, ?, ?)', [userID, goalAmount, coinValue, dataType, goalProgress]);
    res.status(201).send('Goal added successfully.');
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      res.status(400).send('An error occurred while adding the goal: The specified userID does not exist.');
    } else {
      console.error('Error adding goal:', error);
      res.status(500).send(`An error occurred while adding the goal: ${error.message}`);
    }
  }
}