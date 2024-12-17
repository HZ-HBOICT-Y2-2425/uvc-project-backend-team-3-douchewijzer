import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import express from 'express';
import axios from 'axios';
import lodash from 'lodash';

const { merge } = lodash;

const router = express.Router();

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gateway',
      version: '1.0.0',
      description: 'API Gateway for microservices',
    },
    servers: [
      {
        url: `http://localhost:${process.env.GATEWAY_PORT}`,
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

async function fetchSwaggerDocs() {
  const urls = [
    `http://microservice-users:${process.env.USERS_PORT}/api-docs/swagger.json`,
    `http://microservice-goals-milestones:${process.env.GOALS_MILESTONES_PORT}/api-docs/swagger.json`,
    `http://microservice-statistics:${process.env.STATISTICS_PORT}/api-docs/swagger.json`,
    `http://microservice-badges:${process.env.BADGES_PORT}/api-docs/swagger.json`,
  ];

  const docs = await Promise.all(urls.map(url => axios.get(url).then(res => res.data).catch(() => null)));
  return docs.filter(doc => doc !== null).reduce((acc, doc) => merge(acc, doc), swaggerDocs);
}

router.get('/swagger.json', async (req, res) => {
  const docs = await fetchSwaggerDocs();
  res.json(docs);
});

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));

export default router;
