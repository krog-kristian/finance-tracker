import 'dotenv/config';
import express from 'express';
import errorMiddleware from './lib/error-middleware.js';
import pg from 'pg';
import ClientError from './lib/client-error.js';
import { createItemsList, createItemsSql } from './lib/form-prepare.js';
import { writeGetItemsSql, getRecordIds } from './lib/items-request.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import authorizationMiddleware from './lib/authorization-middleware.js';

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

/**
 * Registers a user, error middleware handles if username is not unique.
 * All fields are required.
 */
app.post('/api/home/sign-up', async (req, res, next) => {
  try {
    const { username, password, firstname, lastname, email } = req.body;
    if (!username || !password || !firstname || !lastname || !email) {
      throw new ClientError(400, 'all fields are required.');
    }
    const sql = `
                insert into "users" ("firstname", "lastname", "password", "username", "email")
                values ($1, $2, $3, $4, $5)
                returning *;
                `;
    const hashedPassword = await argon2.hash(password);
    const params = [firstname, lastname, hashedPassword, username, email];
    const data = await db.query(sql, params);
    if (!data.rows[0]) throw new ClientError(500, 'could not register user.');
    res.status(201).json(data.rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Authenticates a user an send them a token for user specific requests.
 */
app.post('/api/home/sign-in', async (req, res, next) => {
  try {
    const { username, passwordVerify } = req.body;
    if (!username || !passwordVerify) throw new ClientError(401, 'invalid login');
    const sql = `
                select "userId", "password"
                from "users"
                where "username" = $1
                `;
    const userData = await db.query(sql, [username]);
    if (!userData.rows[0]) throw new ClientError(404, 'incorrect login');
    const { userId, password } = userData.rows[0];
    const auth = await argon2.verify(password, passwordVerify);
    if (!auth) throw new ClientError(404, 'incorrect login');
    const payload = {
      userId,
      username
    };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET);
    res.status(200).json({ user: payload, token });
  } catch (err) {
    next(err);
  }
});

app.use(authorizationMiddleware);

/**
 * Determines the current and previous months,
 * and queries the database for all records and
 * returns a response with them aswell as the months 0 indexed number.
 */
app.get('/api/home', async (req, res, next) => {
  try {
    const { userId } = req.user;
    const date = new Date();
    const thisMonth = date.getMonth();
    const lastMonth = thisMonth - 1;
    const thisYear = date.getFullYear();
    const sql = `
                select "month", "year", "totalSpent", "isDebit", "day"
                from "records"
                where "userId" = $1 AND "year" = $2 AND "month" = $3 OR "month" = $4;
                `;
    const params = [userId, thisYear, thisMonth, lastMonth];
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
  try {
    const { userId } = req.user;
    const { isDebit, source, numberOfItems, total, date } = req.body;
    const dateArray = date.split('-');
    let [year, month, day] = dateArray;
    month = month - 1;
    day = day - 1;
    const sql = `
              insert into "records" ("userId", "month", "day", "year", "source", "isDebit", "numberOfItems", "totalSpent")
              values ($1, $2, $3, $4, $5, $6, $7, $8)
              returning *;
              `;
    const params = [userId, month, day, year, source, isDebit, numberOfItems, total];
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
app.get('/api/records/:page/:type/:category', async (req, res, next) => {
  try {
    let filter = '';
    const { userId } = req.user;
    const page = Number(req.params.page);
    const offset = page * 10;
    const params = [userId, offset];
    const { type, category } = req.params;
    if (type !== 'null') {
      filter = 'AND "isDebit" = $3';
      params.push(type);
    }
    const sql = `
                select *
                from "records"
                where "userId" = $1 ${filter}
                order by "year" desc, "month" desc, "day" desc
                limit 10
                offset $2;
                `;
    if (offset === null || offset === undefined) throw new ClientError(400, 'Improper record request.');
    const records = await db.query(sql, params);
    const recordIds = getRecordIds(records.rows);
    if (!recordIds.length) {
      res.status(200).json({ nextPage: undefined });
      return;
    }
    const getItemsSql = writeGetItemsSql(recordIds, category);
    if (category !== 'null') recordIds.push(category);
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
