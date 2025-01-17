import express from 'express';
import { responseMilestones, responseMilestonesByUser, updateMilestoneById, deleteMilestoneById, addMilestone } from '../controllers/milestonesController.js';
import { responseGoals, responseGoalsByUser, updateGoalById, deleteGoalById, addGoal } from '../controllers/goalsController.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Microservice goals and milestones is running, use /milestones or /goals to access the data');
});

// Goals routes
router.get('/goals', responseGoals);
router.get('/goals/user/:userID', responseGoalsByUser);
router.put('/goals/:goalID', updateGoalById);
router.delete('/goals/:goalID', deleteGoalById);
router.post('/goals', addGoal);

// Milestones routes
router.get('/milestones', responseMilestones);
router.get('/milestones/user/:userID', responseMilestonesByUser);
router.put('/milestones/:milestoneID', updateMilestoneById);
router.delete('/milestones/:milestoneID', deleteMilestoneById);
router.post('/milestones', addMilestone);

export default router;
