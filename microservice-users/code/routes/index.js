import express from 'express';
import { listUsers, updateUser, listUserPreferences, updateUserPreference, listOwnedItems, updateOwnedItems } from '../controllers/exampleController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();


router.get('/', listUsers);
router.post('/update', updateUser);

router.get('/preferences', listUserPreferences);
router.post('/preferences/update', updateUserPreference);

router.get('/owned-items', listOwnedItems);
router.post('/owned-items/update', updateOwnedItems);
export default router;
