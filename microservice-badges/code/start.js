import express from 'express';
import * as dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
dotenv.config({ path: '../../.env' }); // Ensure this path matches the mounted volume path
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

    // Check if there is data in the badges table and insert default values if empty
    const [rows] = await pool.execute('SELECT * FROM badges');
    if (rows.length === 0) {
      await pool.execute('INSERT INTO badges (itemID, itemValue, itemImage) VALUES (?, ?, ?)', [1, 0, 'default.jpg']);
      console.log('Inserted default row into badges table');
    }

  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.error('Host:', process.env.DB_HOST);
    console.error('Port:', process.env.DB_PORT);
    console.error('User:', process.env.DB_USER);
    process.exit(1);
  }
})();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Microservice Badges API",
      version: "1.0.0",
      description: "Endpoints for Microservice Badges",
    },
    servers: [
      {
        url: `http://localhost:${process.env.BADGES_PORT}`,
        description: "Microservice Local Server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to local route files
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

// Serve Swagger UI for the microservice
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.get("/data", (req, res) => {
  res.json({ message: "Microservice data response" });
});

// support json encoded and url-encoded bodies, mainly used for post and update
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.set('port', process.env.BADGES_PORT);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});