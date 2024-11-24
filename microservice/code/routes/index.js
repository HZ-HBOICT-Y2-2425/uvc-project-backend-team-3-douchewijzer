import express from 'express';
import { responseExample, updateExample, responseByIdExample, responseMilestones, updateMilestone, responseShops, updateShop, responseStatistics, updateStatistic, responseTimers, updateTimer, responseUsers, updateUser, responseUserPreferences, updateUserPreference } from '../controllers/exampleController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('hi');
});
router.get('/example', checkName, responseExample);
router.post('/example', checkName, updateExample);
router.get('/example/:id', checkName, responseByIdExample);

router.get('/milestones', responseMilestones);
router.post('/milestones', updateMilestone);

router.get('/shops', responseShops);
router.post('/shops', updateShop);

router.get('/statistics', responseStatistics);
router.post('/statistics', updateStatistic);

router.get('/timers', responseTimers);
router.post('/timers', updateTimer);

router.get('/users', responseUsers);
router.post('/users', updateUser);

router.get('/user-preferences', responseUserPreferences);
router.post('/user-preferences', updateUserPreference);

export default router;
