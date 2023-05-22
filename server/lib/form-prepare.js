import ClientError from './client-error.js';

/**
 * Creates an array of all the items values from the request object.
 * @param {object} req, the request.
 * @param {number} numberOfItems, total number of items to be extracted.
 * @param {number} recordId, the foreign key to attach all the items to.
 * @returns an array of items taken from the request body.
 */
function createItemsList(req, numberOfItems, recordId) {
  const items = [];
  for (let i = 0; i < numberOfItems; i++) {
    items.push(recordId, req.body[`item${i}`], req.body[`itemCat${i}`], req.body[`itemAmt${i}`]);
  }
  if (items.includes(undefined) || items.includes(null)) throw new ClientError(400, 'Incomplete form.');
  return items;
}

/**
 * Creates the SQl for inserting a dynamic amount of rows by
 * by grouping an array of item properties into groups.
 * Example ($1, $2, $3, $4), ($5, $6, $7, $8)
 * @param {number} numberOfItems being inserted into the table.
 * @returns SQL string.
 */
function createItemsSql(numberOfItems) {
  const values = (numberOfItems) => {
    let stringValues = '(';
    for (let i = 0; i < (numberOfItems * 4); i++) {
      if ((i + 1) === (numberOfItems * 4)) {
        stringValues += `$${i + 1})`;
      } else if ((i + 1) % 4 === 0) {
        stringValues += `$${i + 1}), (`;
      } else {
        stringValues += `$${i + 1}, `;
      }
    }
    return stringValues;
  };
  const sql = `
              insert into "items" ("recordId", "itemName", "category", "amount")
              values ${values(numberOfItems)}
              returning *;
              `;
  return sql;
}

export { createItemsList, createItemsSql };
