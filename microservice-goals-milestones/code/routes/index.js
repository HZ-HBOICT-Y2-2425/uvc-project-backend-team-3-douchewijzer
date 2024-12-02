import express from 'express';
import { responseMilestones, updateMilestone, responseGoals, updateGoals } from '../controllers/exampleController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('GoalsMilestonesController');
});
router.get('/milestones', responseMilestones);
router.post('/milestones', updateMilestone);

router.get('/goals', responseGoals);
router.post('/goals', updateGoals);


export default router;
