import ClientError from './client-error.js';

/**
 * Takes the returned records and extracts all the Ids into an array and returns it.
 * @param {array} records, an array of objects.
 * @returns an array of numbers representing recordIds
 */
function getRecordIds(records) {
  if (!records) throw new ClientError(404, 'Records incomplete.');
  const recordIds = [];
  for (let i = 0; i < records.length; i++) {
    recordIds.push(records[i].recordId);
  }
  return recordIds;
}

/**
 * Writes the SQL for a varying amount of placeholders to retrieve items with
 * matching recordIds
 * @param {array} recordIds, array of numbers representing recordIds
 * @returns SQL in this format:
 * "select *
 *  from "items"
 *  where "recordId" = $1 or "recordId" = $2 //etc//;
 * "
 */
function writeGetItemsSql(recordIds) {
  const placeholders = [];
  for (let i = 0; i < recordIds.length; i++) {
    placeholders.push(`$${i + 1}`);
  }
  const sql = `
                select *
                from "items"
                where "recordId" = ${placeholders.join(' OR "recordId" = ')};
                `;
  return sql;
}

export { getRecordIds, writeGetItemsSql };
