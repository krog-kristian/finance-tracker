import 'dotenv/config';
import express from 'express';
import errorMiddleware from './lib/error-middleware.js';
import pg from 'pg';
import ClientError from './lib/client-error.js';
import { createItemsList, createItemsSql } from './lib/form-prepare.js';
import { writeGetItemsSql, getRecordIds } from './lib/items-request.js';

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
 * Determines the current and previous months,
 * and queries the database for all records and
 * returns a response with them aswell as the months 0 indexed number.
 */
app.get('/api/home', async (req, res, next) => {
  try {
    const user = 1;
    const date = new Date();
    const thisMonth = date.getMonth();
    const lastMonth = thisMonth - 1;
    const thisYear = date.getFullYear();
    const sql = `
                select "month", "year", "totalSpent", "inOut", "day"
                from "records"
                where "userId" = $1 AND "year" = $2 AND "month" = $3 OR "month" = $4;
                `;
    const params = [user, thisYear, thisMonth, lastMonth];
    const dataRecords = await db.query(sql, params);
    res.status(200).json({ records: dataRecords.rows, thisMonth, lastMonth });
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
  let [year, month, day] = dateArray;
  month = month - 1;
  try {
    const sql = `
              insert into "records" ("userId", "month", "day", "year", "source", "inOut", "numberOfItems", "totalSpent")
              values ($1, $2, $3, $4, $5, $6, $7, $8)
              returning *;
              `;
    const params = [1, month, day, year, source, inOut, numberOfItems, total];
    if (params.includes(undefined) || params.includes(null)) throw new ClientError(400, 'Incomplete form.');
    const dataRecords = await db.query(sql, params);
    if (!dataRecords.rows[0]) throw new ClientError(500, 'Database failure, aborting.');
    const { recordId } = dataRecords.rows[0];
    const itemsSql = createItemsSql(numberOfItems, recordId);
    const items = createItemsList(req, numberOfItems, recordId);
    const dataItems = await db.query(itemsSql, items);
    const response = { record: dataRecords.rows[0], items: dataItems.rows[0] };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
});

/**
 * Takes a page number from the request parameters and multiplies by 5 for the offset.
 * Requests a limit of 5 records and extracts records Ids to generate SQL
 * to request matching items.
 * Returns records, items and next page to the client.
 * If end of database returns next page as undefined.
 */
app.get('/api/records/:page', async (req, res, next) => {
  try {
    const user = 1;
    const page = Number(req.params.page);
    const offset = page * 5;
    const sql = `
                select *
                from "records"
                where "userId" = $1
                order by "year" desc, "month" desc, "day" desc
                limit 5
                offset $2;
                `;
    const params = [user, offset];
    if (offset === null || offset === undefined) throw new ClientError(400, 'Improper record request.');
    const records = await db.query(sql, params);
    const recordIds = getRecordIds(records.rows);
    if (!recordIds.length) {
      res.status(200).json({ nextPage: undefined });
      return;
    }
    const getItemsSql = writeGetItemsSql(recordIds);
    const items = await db.query(getItemsSql, recordIds);
    const response = { records: records.rows, items: items.rows, nextPage: page + 1 };
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
