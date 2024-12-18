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
router.get('/', responsebadge);

/**
 * @swagger
 * /{badgeID}:
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
router.get('/:badgeID', getBadgeItem);

/**
 * @swagger
 * /{badgeID}/update:
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
router.put('/:badgeID/update', changeBadge);

/**
 * @swagger
 * /{badgeID}/delete:
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
router.delete('/:badgeID/delete', deleteBadge);

router.get("/data", (req, res) => {
  res.json({ message: "Microservice data" });
});

export default router;
