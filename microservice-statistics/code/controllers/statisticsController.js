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

export async function responseStatistics(req, res) {
  const db = req.app.get('db');
  try {
    const [rows] = await executeQuery(db, 'SELECT * FROM statistics');
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).send(`An error occurred while fetching statistics: ${error.message}`);
  }
}

export async function getStatisticsByUser(req, res) {
  const db = req.app.get('db');
  const { userID } = req.params;
  try {
    const [rows] = await executeQuery(db, 'SELECT * FROM statistics WHERE userID = ?', [userID]);
    if (rows.length === 0) {
      return res.status(404).send(`No statistics found for user ID: ${userID}`);
    }
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error fetching statistics for user:', error);
    res.status(500).send(`An error occurred while fetching statistics for user ID: ${userID}: ${error.message}`);
  }
}

export async function updateStatisticByUser(req, res) {
  const db = req.app.get('db');
  const { userID } = req.params;
  const { gasUsage, temperature, currentCosts, waterUsage, carbonEmission, totalCost, totalGasUsage, averageTemperature, totalWaterUsage } = { ...req.body, ...req.query };

  // Build the query dynamically based on provided fields
  const fields = [];
  const values = [];

  if (gasUsage !== undefined) {
    fields.push('gasUsage = ?');
    values.push(gasUsage);
  }
  if (temperature !== undefined) {
    fields.push('temperature = ?');
    values.push(temperature);
  }
  if (currentCosts !== undefined) {
    fields.push('currentCosts = ?');
    values.push(currentCosts);
  }
  if (waterUsage !== undefined) {
    fields.push('waterUsage = ?');
    values.push(waterUsage);
  }
  if (carbonEmission !== undefined) {
    fields.push('carbonEmission = ?');
    values.push(carbonEmission);
  }
  if (totalCost !== undefined) {
    fields.push('totalCost = ?');
    values.push(totalCost);
  }
  if (totalGasUsage !== undefined) {
    fields.push('totalGasUsage = ?');
    values.push(totalGasUsage);
  }
  if (averageTemperature !== undefined) {
    fields.push('averageTemperature = ?');
    values.push(averageTemperature);
  }
  if (totalWaterUsage !== undefined) {
    fields.push('totalWaterUsage = ?');
    values.push(totalWaterUsage);
  }

  if (fields.length === 0) {
    return res.status(400).send('No fields to update.');
  }

  values.push(userID);

  const query = `UPDATE statistics SET ${fields.join(', ')} WHERE userID = ?`;

  try {
    const [result] = await executeQuery(db, query, values);
    if (result.affectedRows === 0) {
      return res.status(404).send(`No statistics found for user ID: ${userID}`);
    }
    res.status(200).send(`Statistic updated for user ID: ${userID}`);
  } catch (error) {
    console.error('Error updating statistic:', error);
    res.status(500).send(`An error occurred while updating the statistic: ${error.message}`);
  }
}