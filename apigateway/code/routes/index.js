import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // Updated path

const router = express.Router();

// create a proxy for each microservice
const microserviceUsers = createProxyMiddleware({
  target: `http://microservice-users:${process.env.USERS_PORT}`, 
  changeOrigin: true
});

const microserviceGoalsMilestones = createProxyMiddleware({
  target: `http://microservice-goals-milestones:${process.env.GOALS_MILESTONES_PORT}`, 
  changeOrigin: true
});

const microserviceStatistics = createProxyMiddleware({
  target: `http://microservice-statistics:${process.env.STATISTICS_PORT}`, 
  changeOrigin: true
});

const microserviceBadges = createProxyMiddleware({
  target: `http://microservice-badges:${process.env.BADGES_PORT}`, 
  changeOrigin: true
});

router.use('/users', microserviceUsers);
router.use('/goalsMilestones', microserviceGoalsMilestones);
router.use('/statistics', microserviceStatistics);
router.use('/badges', microserviceBadges);

export default router;
