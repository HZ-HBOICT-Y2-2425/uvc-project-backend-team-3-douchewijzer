import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
const router = express.Router();

// create a proxy for each microservice
const microserviceProxy = createProxyMiddleware({
  target: 'http://localhost:3011', // Ensure this is correct
  changeOrigin: true
});

router.use('/microservice', microserviceProxy);

export default router;
