import express from 'express';
import { responseUsers, updateUser, responseUserPreferences, updateUserPreference } from '../controllers/exampleController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('UsersController');
});

router.get('/users', responseUsers);
router.post('/users', updateUser);

router.get('/user-preferences', responseUserPreferences);
router.post('/user-preferences', updateUserPreference);

export default router;
