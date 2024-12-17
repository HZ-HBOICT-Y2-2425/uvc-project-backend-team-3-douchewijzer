import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/.env' }); // Ensure this path matches the mounted volume path
import indexRouter from './routes/index.js';
import bodyParser from 'body-parser';
import cors from 'cors';

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

// Swagger documentation route
app.use('/api-docs', indexRouter);

app.set('port', process.env.GATEWAY_PORT);
app.listen(app.get('port'), () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
