import express from 'express';
import * as dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config({ path: 'variables.env' });
import indexRouter from './routes/index.js';

const app = express();

// Log environment variables to verify they are loaded correctly
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('PORT:', process.env.PORT);

// MySQL database connection
let db;
try {
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  app.set('db', db);
} catch (error) {
  console.error('Unable to connect to the database:', error);
  console.error('Host:', process.env.DB_HOST);
  console.error('Port:', process.env.DB_PORT);
  console.error('User:', process.env.DB_USER);
  process.exit(1);
}

// support json encoded and url-encoded bodies, mainly used for post and update
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.set('port', process.env.PORT || 3011);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});
