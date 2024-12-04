export async function listUsers(req, res) {
  const db = req.app.get('db');
  try {
    const [rows] = await db.execute('SELECT * FROM users');
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).send('An error occurred while listing the users.');
  }
}

export async function addUser(req, res) {
  const db = req.app.get('db');
  let { email, userImage, name, password, coins, userMinutes } = req.query;

  // Validate required fields
  if (!email || !name || !password) {
    return res.status(400).send('Email, name, and password are required.');
  }

  // Use null for optional fields if they are not provided
  userImage = userImage || null;
  coins = coins ? parseInt(coins, 10) : null;
  userMinutes = userMinutes ? parseInt(userMinutes, 10) : null;

  try {
    await db.execute('INSERT INTO users (email, userImage, name, password, coins, userMinutes) VALUES (?, ?, ?, ?, ?, ?)', [email, userImage, name, password, coins, userMinutes]);
    
    // Get the newly inserted userID
    const [result] = await db.execute('SELECT LAST_INSERT_ID() as userID');
    const userID = result[0].userID;

    // Insert default rows into related tables
    await db.execute('INSERT INTO user_preference (userID) VALUES (?)', [userID]);
    await db.execute('INSERT INTO statistics (userID) VALUES (?)', [userID]);
    await db.execute('INSERT INTO milestone (userID) VALUES (?)', [userID]);
    await db.execute('INSERT INTO goals (userID) VALUES (?)', [userID]);

    // Check if default item exists in shop table
    const [shopItem] = await db.execute('SELECT itemID FROM shop WHERE itemID = 1');
    if (shopItem.length > 0) {
      await db.execute('INSERT INTO owned_items (userID, itemID, itemPrice) VALUES (?, 1, 0)', [userID]); // Assuming default itemID is 1 and itemPrice is 0
    }

    res.status(201).send(`User added: ${JSON.stringify(req.query)}`);
  } catch (error) {
    console.error('Error inserting user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).send('Duplicate entry for email.');
    } else {
      res.status(500).send('An error occurred while adding the user.');
    }
  }
}

export async function listUserPreferences(req, res) {
  const db = req.app.get('db');
  try {
    const [rows] = await db.execute('SELECT * FROM user_preference');
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error listing user preferences:', error);
    res.status(500).send('An error occurred while listing the user preferences.');
  }
}

export async function addUserPreference(req, res) {
  const db = req.app.get('db');
  let { userID, leaderbordNotificationPreference, leaderbordUploadPreference, timerSetting, equipped_item } = req.query;

  if (!userID) {
    return res.status(400).send('userID is required.');
  }

  try {
    const query = 'INSERT INTO user_preference (userID, leaderbordNotificationPreference, leaderbordUploadPreference, timerSetting, equipped_item) VALUES (?, ?, ?, ?, ?)';
    const values = [userID, leaderbordNotificationPreference, leaderbordUploadPreference, timerSetting || 300, equipped_item];

    await db.execute(query, values);
    res.status(201).send(`User preference added: ${JSON.stringify(req.query)}`);
  } catch (error) {
    console.error('Error inserting user preference:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).send('Duplicate entry for userID.');
    } else {
      res.status(500).send('An error occurred while adding the user preference.');
    }
  }
}

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

export async function addOwnedItems(req, res) {
  const db = req.app.get('db');
  let { userID, itemID, itemPrice } = req.query;

  try {
    await db.execute('INSERT INTO owned_items (userID, itemID, itemPrice) VALUES (?, ?, ?)', [userID, itemID, itemPrice]);
    res.status(201).send(`Owned item added: ${JSON.stringify(req.query)}`);
  } catch (error) {
    console.error('Error inserting owned item:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).send('Duplicate entry for userID and itemID.');
    } else {
      res.status(500).send('An error occurred while adding the owned item.');
    }
  }
}