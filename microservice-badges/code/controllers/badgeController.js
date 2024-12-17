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
 *                   itemID:
 *                     type: integer
 *                     description: The badge ID
 *                   itemValue:
 *                     type: string
 *                     description: The badge value
 *                   itemImage:
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
 * /badges/{itemID}:
 *   get:
 *     summary: Retrieve a specific badge
 *     parameters:
 *       - in: path
 *         name: itemID
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
 *                 itemID:
 *                   type: integer
 *                   description: The badge ID
 *                 itemValue:
 *                   type: string
 *                   description: The badge value
 *                 itemImage:
 *                   type: string
 *                   description: The badge image URL
 *       404:
 *         description: Badge item not found
 */
export async function getBadgeItem(req, res) {
  const pool = req.app.get('db');
  const { itemID } = req.params;
  try {
    const rows = await executeQuery(pool, 'SELECT * FROM badges WHERE itemID = ?', [itemID]);
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
 * /badges/{itemID}/update:
 *   put:
 *     summary: Update a specific badge
 *     parameters:
 *       - in: path
 *         name: itemID
 *         required: true
 *         description: The badge ID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: itemValue
 *         description: The new badge value
 *         schema:
 *           type: string
 *       - in: query
 *         name: itemImage
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
  const { itemID } = req.params;
  const { itemValue, itemImage } = req.query;

  const fields = [];
  const values = [];

  if (itemValue !== undefined) {
    fields.push('itemValue = ?');
    values.push(itemValue);
  }
  if (itemImage !== undefined) {
    fields.push('itemImage = ?');
    values.push(itemImage);
  }

  if (fields.length === 0) {
    return res.status(400).send('No fields to update.');
  }

  values.push(itemID);

  const query = `UPDATE badges SET ${fields.join(', ')} WHERE itemID = ?`;

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
 * /badges/{itemID}/delete:
 *   delete:
 *     summary: Delete a specific badge
 *     parameters:
 *       - in: path
 *         name: itemID
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
  const { itemID } = req.params;
  try {
    const result = await executeQuery(pool, 'DELETE FROM badges WHERE itemID = ?', [itemID]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Badge item not found.');
    }
    res.status(200).send(`Badge item deleted: ${itemID}`);
  } catch (error) {
    console.error('Error deleting badge item:', error);
    res.status(500).send(`An error occurred while deleting the badge item: ${error.message}`);
  }
}