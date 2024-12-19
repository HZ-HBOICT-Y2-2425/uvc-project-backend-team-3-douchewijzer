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

export async function responseStatistics(req, res) {
  const pool = req.app.get('db');
  try {
    const rows = await executeQuery(pool, 'SELECT * FROM statistics');
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).send(`An error occurred while fetching statistics: ${error.message}`);
  }
}

export async function getStatisticsByUser(req, res) {
  const pool = req.app.get('db');
  const { userID } = req.params;
  try {
    const rows = await executeQuery(pool, 'SELECT * FROM statistics WHERE userID = ?', [userID]);
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
  const pool = req.app.get('db');
  const { userID } = req.params;
  const { gasUsage, temperature, currentCosts, waterUsage, carbonEmission, totalCost, totalGasUsage, averageTemperature, totalWaterUsage, lastTime, averageTime } = req.query;

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
  if (lastTime !== undefined) {
    fields.push('lastTime = ?');
    values.push(lastTime);
  }
  if (averageTime !== undefined) {
    fields.push('averageTime = ?');
    values.push(averageTime);
  }

  if (fields.length === 0) {
    return res.status(400).send('No fields to update.');
  }

  values.push(userID);

  const query = `UPDATE statistics SET ${fields.join(', ')} WHERE userID = ?`;

  try {
    const result = await executeQuery(pool, query, values);
    if (result.affectedRows === 0) {
      return res.status(404).send(`No statistics found for user ID: ${userID}`);
    }
    res.status(200).send(`Statistic updated for user ID: ${userID}`);
  } catch (error) {
    console.error('Error updating statistic:', error);
    res.status(500).send(`An error occurred while updating the statistic: ${error.message}`);
  }
}