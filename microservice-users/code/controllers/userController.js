import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
    return res.status(400).json({ error: 'Email, name, and password are required.' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Use null for optional fields if they are not provided
  userImage = userImage || null;
  coins = coins ? parseInt(coins, 10) : null;
  userMinutes = userMinutes ? parseInt(userMinutes, 10) : null;

  try {
    await db.execute('INSERT INTO users (email, userImage, name, password, coins, userMinutes) VALUES (?, ?, ?, ?, ?, ?)', [email, userImage, name, hashedPassword, coins, userMinutes]);
    
    // Get the newly inserted userID
    const [result] = await db.execute('SELECT LAST_INSERT_ID() as userID');
    const userID = result[0].userID;

    // Insert default rows into related tables
    await db.execute('INSERT INTO user_preference (userID) VALUES (?)', [userID]);
    await db.execute('INSERT INTO statistics (userID) VALUES (?)', [userID]);

    // Insert default rows into goals and milestones tables
    await db.execute('INSERT INTO goals (userID) VALUES (?)', [userID]);
    await db.execute('INSERT INTO milestone (userID) VALUES (?)', [userID]);

    // Check if default item exists in shop table
    const [shopItem] = await db.execute('SELECT itemID FROM shop WHERE itemID = 1');
    if (shopItem.length > 0) {
      await db.execute('INSERT INTO owned_items (userID, itemID, itemPrice) VALUES (?, 1, 0)', [userID]); // Assuming default itemID is 1 and itemPrice is 0
    }
    // Generate JWT token
    const token = jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully.', token, userID });
    } catch (error) {
    console.error('Error inserting user:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Duplicate entry for email.' });
    } else {
      res.status(500).json({ error: 'An error occurred while adding the user.' });
    }
  }
}

export async function loginUser(req, res) {
  const db = req.app.get('db');
  const { email, password } = req.query;

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Email not found.' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    const token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, userID: user.userID });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'An error occurred while logging in the user.' });
  }
}

export async function verifyToken(req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  const { userID } = req.query;

  if (!token) {
    return res.status(401).send('Access Denied');
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified.userID !== parseInt(userID, 10)) {
      return res.status(400).send('Invalid User ID');
    }
    res.status(200).send('Token is valid');
  } catch (err) {
    res.status(400).send('Invalid Token');
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
  const { email, userImage, name, password, coins, userMinutes } = req.query;

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
    const hashedPassword = await bcrypt.hash(password, 10);
    fields.push('password = ?');
    values.push(hashedPassword);
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