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

export async function getUser(req, res) {
  const db = req.app.get('db');
  const { userID } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE userID = ?', [userID]);
    if (rows.length === 0) {
      return res.status(404).send('User not found.');
    }
    res.status(200).send(rows[0]);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).send('An error occurred while getting the user.');
  }
}

export async function updateUser(req, res) {
  const db = req.app.get('db');
  const { userID } = req.params;
  const { email, userImage, name, password, coins, userMinutes } = { ...req.body, ...req.query };

  // Build the query dynamically based on provided fields
  const fields = [];
  const values = [];

  if (email !== undefined) {
    fields.push('email = ?');
    values.push(email);
  }
  if (userImage !== undefined) {
    fields.push('userImage = ?');
    values.push(userImage);
  }
  if (name !== undefined) {
    fields.push('name = ?');
    values.push(name);
  }
  if (password !== undefined) {
    fields.push('password = ?');
    values.push(password);
  }
  if (coins !== undefined) {
    fields.push('coins = ?');
    values.push(coins);
  }
  if (userMinutes !== undefined) {
    fields.push('userMinutes = ?');
    values.push(userMinutes);
  }

  if (fields.length === 0) {
    return res.status(400).send('No fields to update.');
  }

  values.push(userID);

  const query = `UPDATE users SET ${fields.join(', ')} WHERE userID = ?`;

  try {
    const [result] = await db.execute(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).send('User not found.');
    }
    res.status(200).send('User updated successfully.');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send(`An error occurred while updating the user: ${error.message}`);
  }
}

export async function deleteUser(req, res) {
  const db = req.app.get('db');
  const { userID } = req.params;

  try {
    // Delete related rows in other tables
    await db.execute('DELETE FROM user_preference WHERE userID = ?', [userID]);
    await db.execute('DELETE FROM statistics WHERE userID = ?', [userID]);
    await db.execute('DELETE FROM milestone WHERE userID = ?', [userID]);
    await db.execute('DELETE FROM goals WHERE userID = ?', [userID]);
    await db.execute('DELETE FROM owned_items WHERE userID = ?', [userID]);

    // Delete the user
    const [result] = await db.execute('DELETE FROM users WHERE userID = ?', [userID]);
    if (result.affectedRows === 0) {
      return res.status(404).send('User not found.');
    }

    res.status(200).send('User and related data deleted successfully.');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('An error occurred while deleting the user.');
  }
}