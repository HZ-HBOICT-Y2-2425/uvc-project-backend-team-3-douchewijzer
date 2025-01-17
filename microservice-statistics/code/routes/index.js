import express from 'express';
import { responseStatistics, getStatisticsByUser, updateStatisticByUser, createStatistic } from '../controllers/statisticsController.js';

const router = express.Router();

router.get('/', responseStatistics);
router.get('/:userID', getStatisticsByUser);
router.put('/:userID', updateStatisticByUser);
router.post('/:userID', createStatistic);

export default router;
