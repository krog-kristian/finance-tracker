import 'dotenv/config';
import express from 'express';
import errorMiddleware from './lib/error-middleware.js';
import pg from 'pg';
import ClientError from './lib/client-error.js';
import { createItemsList, createItemsSql } from './lib/form-prepare.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/build', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

// Sign up post to insert a user, incomplete just for testing purposes.
app.post('/api/user', async (req, res, next) => {
  console.log('hello');
  const upload = req.body;
  try {
    const sql = `
                insert into "users" ("firstname", "lastname", "password", "username", "email")
                values ($1, $2, $3, $4, $5)
                returning *;
                `;
    const params = [upload.firstname, upload.lastname, upload.password, upload.username, upload.email];
    console.log('my params', params);
    const data = await db.query(sql, params);
    res.status(201).json(data.rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Inserts the record in the records table and uses the ID returned,
 * to insert aa varying amount of item rows into the items table.
 * Requires userId, hard coded a demo userId into params for now.
 */
app.post('/api/record', async (req, res, next) => {
  const { inOut, source, numberOfItems, total, date } = req.body;
  const dateArray = date.split('-');
  const [year, month, day] = dateArray;
  try {
    const sql = `
              insert into "records" ("userId", "month", "day", "year", "source", "inOut", "numberOfItems", "totalSpent")
              values ($1, $2, $3, $4, $5, $6, $7, $8)
              returning *;
              `;
    const params = [1, month, day, year, source, inOut, numberOfItems, total];
    if (params.includes(undefined) || params.includes(null)) throw new ClientError(400, 'Incomplete form.');
    const data = await db.query(sql, params);
    if (!data.rows[0]) throw new ClientError(500, 'Database failure, aborting.');
    const { recordId } = data.rows[0];
    const itemsSql = createItemsSql(numberOfItems, recordId);
    const items = createItemsList(req, numberOfItems, recordId);
    const dataItems = await db.query(itemsSql, items);
    const response = { record: data.rows[0], items: dataItems.rows[0] };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
