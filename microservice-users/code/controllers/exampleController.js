export async function responseUsers(req, res) {
  const db = req.app.get('db');
  const [rows] = await db.execute('SELECT * FROM users');
  res.status(200).send(rows);
}

export async function updateUser(req, res) {
  const db = req.app.get('db');
  let { id, userPreferenceID, email, userImage, name, coins } = req.query;
  await db.execute('INSERT INTO users (userID, userPreferenceID, email, userImage, name, coins) VALUES (?, ?, ?, ?, ?, ?)', [id, userPreferenceID, email, userImage, name, coins]);
  res.status(201).send(`User added: ${JSON.stringify(req.query)}`);
}

export async function responseUserPreferences(req, res) {
  const db = req.app.get('db');
  const [rows] = await db.execute('SELECT * FROM user_preference');
  res.status(200).send(rows);
}

export async function updateUserPreference(req, res) {
  const db = req.app.get('db');
  let { id, leaderbordNotificationPreference, leaderbordUploadPreference } = req.query;
  await db.execute('INSERT INTO user_preference (userPreferenceID, leaderbordNotificationPreference, leaderbordUploadPreference) VALUES (?, ?, ?)', [id, leaderbordNotificationPreference, leaderbordUploadPreference]);
  res.status(201).send(`User preference added: ${JSON.stringify(req.query)}`);
}