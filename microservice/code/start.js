import express from 'express';
import * as dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config({ path: 'variables.env' });
import indexRouter from './routes/index.js';

const app = express();

// MySQL database connection
const db = await mysql.createConnection({
  host: 'dwdb1.danieldj.nl',
  port: 3306,
  user: process.env.DB_USER,
  password: 's4VFziWxEIS5640',
  database: process.env.DB_NAME || 'douchewijzer'
});

app.set('db', db);

// support json encoded and url-encoded bodies, mainly used for post and update
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.set('port', process.env.PORT || 3011);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});
