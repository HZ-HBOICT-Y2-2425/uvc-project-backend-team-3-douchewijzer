import express from 'express';
import { responsebadge, deleteBadge, changeBadge, getBadgeItem, addBadge } from '../controllers/badgeController.js';
// import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

router.get('/', responsebadge);

router.get('/:badgeID', getBadgeItem);

router.put('/:badgeID/update', changeBadge);

router.delete('/:badgeID/delete', deleteBadge);

router.post('/add', addBadge);

router.get("/data", (req, res) => {
  res.json({ message: "Microservice data" });
});

export default router;
