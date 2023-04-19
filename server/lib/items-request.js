import ClientError from './client-error.js';

function getRecordIds(records) {
  if (!records) throw new ClientError(404, 'Records incomplete.');
  const recordIds = [];
  for (let i = 0; i < records.length; i++) {
    recordIds.push(records[i].recordId);
  }
  return recordIds;
}

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
