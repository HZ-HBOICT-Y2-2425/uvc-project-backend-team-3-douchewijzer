import express from 'express';
import { responseStatistics, updateStatistic } from '../controllers/exampleController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('StatisticsController');
});

router.get('/statistics', responseStatistics);
router.post('/statistics', updateStatistic);

export default router;
