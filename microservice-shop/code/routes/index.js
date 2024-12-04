import express from 'express';
import { responseShop, deleteShop, changeShop, getShopItem } from '../controllers/shopController.js';
// import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

// routes
router.get('/', responseShop);

router.get('/:itemID', getShopItem);
router.put('/:itemID/update', changeShop);
router.delete('/:itemID/delete', deleteShop);

export default router;
