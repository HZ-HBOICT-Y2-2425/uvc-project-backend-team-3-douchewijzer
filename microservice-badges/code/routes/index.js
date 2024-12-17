import express from 'express';
import { responsebadge, deleteBadge, changeBadge, getBadgeItem } from '../controllers/badgeController.js';
// import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

/**
 * @swagger
 * /:
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
router.get('/', responsebadge);

/**
 * @swagger
 * /{itemID}:
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
router.get('/:itemID', getBadgeItem);

/**
 * @swagger
 * /{itemID}/update:
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
router.put('/:itemID/update', changeBadge);

/**
 * @swagger
 * /{itemID}/delete:
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
router.delete('/:itemID/delete', deleteBadge);

router.get("/data", (req, res) => {
  res.json({ message: "Microservice data" });
});

export default router;
