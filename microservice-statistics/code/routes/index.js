import express from 'express';
import { responseStatistics, getStatisticsByUser, updateStatisticByUser } from '../controllers/statisticsController.js';
// import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

// routes
router.get('/', responseStatistics);
router.get('/:userID', getStatisticsByUser);
router.put('/:userID/update', updateStatisticByUser);

export default router;
