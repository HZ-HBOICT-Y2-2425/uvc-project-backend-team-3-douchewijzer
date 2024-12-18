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

/**
 * @swagger
 * /badges:
 *   get:
 *     summary: Retrieve a list of badges
 *     responses:
 *       200:
 *         description: A list of badges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   badgeID:
 *                     type: integer
 *                     description: The badge ID
 *                   badgeName:
 *                     type: string
 *                     description: The badge name
 *                   badgeDescription:
 *                     type: string
 *                     description: The badge description
 *                   badgeImage:
 *                     type: string
 *                     description: The badge image URL
 */
export async function responsebadge(req, res) {
  const pool = req.app.get('db');
  try {
    const rows = await executeQuery(pool, 'SELECT * FROM badges');
    res.status(200).send(rows);
  } catch (error) {
    console.error('Error fetching badge items:', error);
    res.status(500).send(`An error occurred while fetching badge items: ${error.message}`);
  }
}

/**
 * @swagger
 * /badges/{badgeID}:
 *   get:
 *     summary: Retrieve a specific badge
 *     parameters:
 *       - in: path
 *         name: badgeID
 *         required: true
 *         description: The badge ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A badge item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 badgeID:
 *                   type: integer
 *                   description: The badge ID
 *                 badgeName:
 *                   type: string
 *                   description: The badge name
 *                 badgeDescription:
 *                   type: string
 *                   description: The badge description
 *                 badgeImage:
 *                   type: string
 *                   description: The badge image URL
 *       404:
 *         description: Badge item not found
 */
export async function getBadgeItem(req, res) {
  const pool = req.app.get('db');
  const { badgeID } = req.params;
  try {
    const rows = await executeQuery(pool, 'SELECT * FROM badges WHERE badgeID = ?', [badgeID]);
    if (rows.length === 0) {
      return res.status(404).send('badge item not found.');
    }
    res.status(200).send(rows[0]);
  } catch (error) {
    console.error('Error fetching badge item:', error);
    res.status(500).send(`An error occurred while fetching the badge item: ${error.message}`);
  }
}

/**
 * @swagger
 * /badges/{badgeID}/update:
 *   put:
 *     summary: Update a specific badge
 *     parameters:
 *       - in: path
 *         name: badgeID
 *         required: true
 *         description: The badge ID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: badgeName
 *         description: The new badge name
 *         schema:
 *           type: string
 *       - in: query
 *         name: badgeDescription
 *         description: The new badge description
 *         schema:
 *           type: string
 *       - in: query
 *         name: badgeImage
 *         description: The new badge image URL
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Badge item updated successfully
 *       400:
 *         description: No fields to update
 *       404:
 *         description: Badge item not found
 */
export async function changeBadge(req, res) {
  const pool = req.app.get('db');
  const { badgeID } = req.params;
  const { badgeName, badgeDescription, badgeImage } = req.query;

  const fields = [];
  const values = [];

  if (badgeName !== undefined) {
    fields.push('badgeName = ?');
    values.push(badgeName);
  }
  if (badgeDescription !== undefined) {
    fields.push('badgeDescription = ?');
    values.push(badgeDescription);
  }
  if (badgeImage !== undefined) {
    fields.push('badgeImage = ?');
    values.push(badgeImage);
  }

  if (fields.length === 0) {
    return res.status(400).send('No fields to update.');
  }

  values.push(badgeID);

  const query = `UPDATE badges SET ${fields.join(', ')} WHERE badgeID = ?`;

  try {
    const result = await executeQuery(pool, query, values);
    if (result.affectedRows === 0) {
      return res.status(404).send('badge item not found.');
    }
    res.status(200).send('badge item updated successfully.');
  } catch (error) {
    console.error('Error updating badge item:', error);
    res.status(500).send(`An error occurred while updating the badge item: ${error.message}`);
  }
}

/**
 * @swagger
 * /badges/{badgeID}/delete:
 *   delete:
 *     summary: Delete a specific badge
 *     parameters:
 *       - in: path
 *         name: badgeID
 *         required: true
 *         description: The badge ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Badge item deleted
 *       404:
 *         description: Badge item not found
 */
export async function deleteBadge(req, res) {
  const pool = req.app.get('db');
  const { badgeID } = req.params;
  try {
    const result = await executeQuery(pool, 'DELETE FROM badges WHERE badgeID = ?', [badgeID]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Badge item not found.');
    }
    res.status(200).send(`Badge item deleted: ${badgeID}`);
  } catch (error) {
    console.error('Error deleting badge item:', error);
    res.status(500).send(`An error occurred while deleting the badge item: ${error.message}`);
  }
}