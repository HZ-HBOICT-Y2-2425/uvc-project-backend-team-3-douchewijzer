import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
const router = express.Router();
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../variables.env' }); // Updated path

// create a proxy for each microservice
const microserviceUsers = createProxyMiddleware({
  target: `http://localhost:${process.env.USERS_PORT}`, 
  changeOrigin: true
});

const microserviceGoalsMilestones = createProxyMiddleware({
  target: `http://localhost:${process.env.GOALS_MILESTONES_PORT}`, 
  changeOrigin: true
});

const microserviceStatistics = createProxyMiddleware({
  target: `http://localhost:${process.env.STATISTICS_PORT}`, 
  changeOrigin: true
});

const microserviceShop = createProxyMiddleware({
  target: `http://localhost:${process.env.SHOP_PORT}`, 
  changeOrigin: true
});

const microserviceTimer = createProxyMiddleware({
  target: `http://localhost:${process.env.TIMER_PORT}`, 
  changeOrigin: true
});

router.use('/users', microserviceUsers);
router.use('/goalsMilestones', microserviceGoalsMilestones);
router.use('/statistics', microserviceStatistics);
router.use('/shop', microserviceShop);
router.use('/timer', microserviceTimer);

export default router;
