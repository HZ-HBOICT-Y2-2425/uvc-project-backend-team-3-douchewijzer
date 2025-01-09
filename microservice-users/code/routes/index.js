import express from 'express';
import { listUsers, addUser, getUser, updateUser, deleteUser, loginUser, verifyToken } from '../controllers/userController.js';
import { listUserPreferences, getUserPreferences, updateUserPreferences } from '../controllers/preferencesController.js';
import { listOwnedItems, getOwnedItems, updateOwnedItems, addOwnedItem } from '../controllers/ownedItemsController.js';
// import { checkName } from '../middleware/exampleMiddleware.js';

const router = express.Router();

router.get('/', listUsers);
router.post('/register', addUser);
router.post('/login', loginUser);
router.get('/verify-token', verifyToken);


router.get('/preferences', listUserPreferences);

router.get('/owned-items', listOwnedItems);

router.get('/:userID', getUser);
router.get('/:userID/preferences', getUserPreferences);
router.get('/:userID/owned-items', getOwnedItems);

router.put('/:userID', updateUser);
router.put('/:userID/preferences', updateUserPreferences);
router.put('/:userID/owned-items', updateOwnedItems);

router.post('/:userID/owned-items', addOwnedItem);

router.delete('/:userID', deleteUser);

export default router;
