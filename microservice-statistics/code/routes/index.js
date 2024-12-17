import express from 'express';
import { responseStatistics, getStatisticsByUser, updateStatisticByUser } from '../controllers/statisticsController.js';

const router = express.Router();

// Statistics routes
router.get('/', responseStatistics);
router.get('/:userID', getStatisticsByUser);
router.put('/:userID', updateStatisticByUser);

export default router;
