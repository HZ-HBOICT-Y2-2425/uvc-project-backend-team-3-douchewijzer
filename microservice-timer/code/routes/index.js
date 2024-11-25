import express from 'express';
import { responseTimer, updateTimer } from '../controllers/exampleController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('TimerController');
});

router.get('/timer', responseTimer);
router.post('/timer', updateTimer);



export default router;
