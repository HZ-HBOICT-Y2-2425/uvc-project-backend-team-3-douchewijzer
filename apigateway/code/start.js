import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // Ensure this path matches the mounted volume path
import indexRouter from './routes/index.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const port = process.env.GATEWAY_PORT;

// support json encoded and url-encoded bodies, mainly used for post and update
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Allow requests from SvelteKit frontend

app.use('/', indexRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Resolve __filename and __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load individual service Swagger files
const badgesSwagger = yaml.load(path.join(__dirname, 'swagger', 'badges.yaml'));
const usersSwagger = yaml.load(path.join(__dirname, 'swagger', 'users.yaml'));
const goalsMilestonesSwagger = yaml.load(path.join(__dirname, 'swagger', 'goalsMilestones.yaml'));
const statisticsSwagger = yaml.load(path.join(__dirname, 'swagger', 'statistics.yaml'));

// Prefix the paths with appropriate tags
const prefixedPaths = {};
const addPrefixedPaths = (swagger, prefix, tag) => {
  for (const [path, value] of Object.entries(swagger.paths)) {
    prefixedPaths[`${prefix}${path}`] = {
      ...value,
      tags: [tag]
    };
  }
};

addPrefixedPaths(badgesSwagger, '/badges', 'Badges');
addPrefixedPaths(usersSwagger, '/users', 'Users');
addPrefixedPaths(goalsMilestonesSwagger, '/goalsMilestones', 'Goals-Milestones');
addPrefixedPaths(statisticsSwagger, '/statistics', 'Statistics');

// Merge Swagger documents
const swaggerDocument = {
  swagger: "2.0",
  info: {
    title: "Douchewijzer Backend API",
    version: "1.0.0",
    description: "This is the API Gateway for the Douchewijzer project. It aggregates the individual services' APIs into a single API.",
    contact: {
      name: "Daniël de Jonge",
      email: "prive@danieldj.nl"
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT"
    }
  },
  tags: [
    { name: 'Badges', description: 'Operations related to badges' },
    { name: 'Users', description: 'Operations related to users' },
    { name: 'Goals-Milestones', description: 'Operations related to goals and milestones' },
    { name: 'Statistics', description: 'Operations related to statistics' }
  ],
  paths: {
    ...prefixedPaths
  }
};

// Customize Swagger UI options
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true
  }
};

// Serve Swagger UI with the composite API definition
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

app.set('port', process.env.GATEWAY_PORT);
app.listen(app.get('port'), () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
