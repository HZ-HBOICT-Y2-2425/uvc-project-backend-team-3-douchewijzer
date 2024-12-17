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

export async function listUserPreferences(req, res) {
  const pool = req.app.get('db');
  try {
    const rows = await executeQuery(pool, 'SELECT * FROM user_preference');
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error listing user preferences:', error);
    res.status(500).send('An error occurred while listing the user preferences.');
  }
}

export async function getUserPreferences(req, res) {
  const pool = req.app.get('db');
  const { userID } = req.params;
  try {
    const rows = await executeQuery(pool, 'SELECT * FROM user_preference WHERE userID = ?', [userID]);
    if (rows.length === 0) {
      return res.status(404).send('User preferences not found.');
    }
    res.status(200).send(rows[0]);
  } catch (error) {
    console.error('Error getting user preferences:', error);
    res.status(500).send('An error occurred while getting the user preferences.');
  }
}

export async function updateUserPreferences(req, res) {
  const pool = req.app.get('db');
  const { userID } = req.params;
  const { leaderbordNotificationPreference, leaderbordUploadPreference, timerSetting, equipped_item } = req.body;

  try {
    const result = await executeQuery(pool, 'UPDATE user_preference SET leaderbordNotificationPreference = ?, leaderbordUploadPreference = ?, timerSetting = ?, equipped_item = ? WHERE userID = ?', [leaderbordNotificationPreference, leaderbordUploadPreference, timerSetting, equipped_item, userID]);
    if (result.affectedRows === 0) {
      return res.status(404).send('User preferences not found.');
    }
    res.status(200).send('User preferences updated successfully.');
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).send('An error occurred while updating the user preferences.');
  }
}
