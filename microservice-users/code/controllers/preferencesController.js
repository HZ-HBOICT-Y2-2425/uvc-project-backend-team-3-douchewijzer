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

export async function listUserPreferences(req, res) {
  const db = req.app.get('db');
  try {
    const [rows] = await executeQuery(db, 'SELECT * FROM user_preference');
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error listing user preferences:', error);
    res.status(500).send('An error occurred while listing the user preferences.');
  }
}

export async function getUserPreferences(req, res) {
  const db = req.app.get('db');
  const { userID } = req.params;
  try {
    const [rows] = await executeQuery(db, 'SELECT * FROM user_preference WHERE userID = ?', [userID]);
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
  const db = req.app.get('db');
  const { userID } = req.params;
  const { leaderbordNotificationPreference, leaderbordUploadPreference, timerSetting, equipped_item } = req.body;

  try {
    const [result] = await executeQuery(db, 'UPDATE user_preference SET leaderbordNotificationPreference = ?, leaderbordUploadPreference = ?, timerSetting = ?, equipped_item = ? WHERE userID = ?', [leaderbordNotificationPreference, leaderbordUploadPreference, timerSetting, equipped_item, userID]);
    if (result.affectedRows === 0) {
      return res.status(404).send('User preferences not found.');
    }
    res.status(200).send('User preferences updated successfully.');
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).send('An error occurred while updating the user preferences.');
  }
}
