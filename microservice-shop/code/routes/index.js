import express from 'express';
import { responseShop, updateShop } from '../controllers/exampleController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('ShopController');
});

router.get('/shop', responseShop);
router.post('/shop', updateShop);

export default router;
