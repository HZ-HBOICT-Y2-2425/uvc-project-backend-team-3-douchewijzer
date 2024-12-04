import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/.env' }); // Ensure this path matches the mounted volume path
import indexRouter from './routes/index.js';

const app = express();
const port = process.env.GATEWAY_PORT;

// support json encoded and url-encoded bodies, mainly used for post and update
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.set('port', process.env.GATEWAY_PORT);
app.listen(app.get('port'), () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
