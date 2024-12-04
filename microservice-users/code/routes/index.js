import express from 'express';
import { listUsers, addUser, listUserPreferences, addUserPreference, listOwnedItems, addOwnedItems } from '../controllers/exampleController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();


router.get('/', listUsers);
router.post('/add', addUser);

router.get('/preferences', listUserPreferences);
router.post('/preferences/add', addUserPreference);

router.get('/owned-items', listOwnedItems);
router.post('/owned-items/add', addOwnedItems);
export default router;
