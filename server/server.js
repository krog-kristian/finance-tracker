import 'dotenv/config';
import express from 'express';
import errorMiddleware from './lib/error-middleware.js';
import pg from 'pg';

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
app.post('/getsome/fires', async (req, res, next) => {
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
 * Post for a record entry, no auth required till user accounts feature added.
 * Requires userId added to body at this point in time.
 */
app.post('/getsome/fires/record', async (req, res, next) => {
  const { inOut, source, numberOfItems, total, date } = req.body;
  const dateArray = date.split('-');
  const [year, month, day] = dateArray;
  console.log('the form', req.body);
  const items = createItemsList(req, numberOfItems);
  console.log('The items!', items);
  // const itemsSql = createItemsSql(numberOfItems, recordId);
  const sql = `
              insert into "records" ("userId", "month", "day", "year", "source", "inOut", "numberOfItems", "totalSpent")
              values ($1, $2, $3, $4, $5, $6, $7, $8)
              returning *;
              `;
  const params = [1, month, day, year, source, inOut, numberOfItems, total];
  try {
    console.log('adding record as:', params);
    const data = await db.query(sql, params);
    const { recordId } = data.rows[0];
    const itemsSql = createItemsSql(numberOfItems, recordId);
    console.log(data.rows);
    console.log('The item sql', itemsSql);
    console.log('the record:', recordId);
    const response = { record: data.rows[0] };
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

function createItemsList(req, numberOfItems) {
  const items = [];
  for (let i = 0; i < numberOfItems; i++) {
    const item = [req.body[`item${i}`], req.body[`itemCat${i}`], req.body[`itemAmt${i}`]
    ];
    items.push(item);
  }
  return items;
}

function createItemsSql(numberOfItems, recordId) {
  const values = (numberOfItems) => {
    let stringValues = '';
    for (let i = 0; i < numberOfItems; i++) {
      if ((i + 1) === Number(numberOfItems)) {
        stringValues += `($${i + 1})`;
      } else {
        stringValues += `($${i + 1}),`;
      }
    }
    return stringValues;
  };
  const sql = `
              insert into "items" ("recordId", "category", "amount", "itemname")
              values (${values(numberOfItems)})
              returning *;
              `;
  return sql;
}
