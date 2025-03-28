import express from 'express';
import { listUsers, addUser, getUser, updateUser, deleteUser, loginUser, verifyToken } from '../controllers/userController.js';
import { listUserPreferences, getUserPreferences, updateUserPreferences } from '../controllers/preferencesController.js';
import { listOwnedItems, getOwnedItems } from '../controllers/ownedItemsController.js';

const router = express.Router();

router.get('/', listUsers);
router.post('/register', addUser);
router.post('/login', loginUser);
router.get('/verify-token', verifyToken);

router.get('/preferences', listUserPreferences);

router.get('/owned-items', listOwnedItems);
router.get('/:userID/owned-items', getOwnedItems);

router.get('/:userID', getUser);
router.get('/:userID/preferences', getUserPreferences);

router.put('/:userID', updateUser);
router.put('/:userID/preferences', updateUserPreferences);

router.delete('/:userID', deleteUser);

export default router;
