import express from 'express';
import * as dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config({ path: '../../.env' }); // Updated path
import indexRouter from './routes/index.js';

const app = express();

// MySQL database connection pool
let pool;
(async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    app.set('db', pool);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.error('Host:', process.env.DB_HOST);
    console.error('Port:', process.env.DB_PORT);
    console.error('User:', process.env.DB_USER);
    process.exit(1);
  }
})();

// support json encoded and url-encoded bodies, mainly used for post and update
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.set('port', process.env.STATISTICS_PORT);
const server = app.listen(app.get('port'), () => {
  console.log(`📊 Express running → PORT ${server.address().port}`);
});
