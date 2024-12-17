import express from 'express';
import { responsebadge, deleteBadge, changeBadge, getBadgeItem } from '../controllers/badgeController.js';
// import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

// routes
router.get('/', responsebadge);

router.get('/:itemID', getBadgeItem);
router.put('/:itemID/update', changeBadge);
router.delete('/:itemID/delete', deleteBadge);

export default router;
