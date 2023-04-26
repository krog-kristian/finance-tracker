export default function writeRecordsSql(queries) {
  console.log('writing sql params:', queries);
  const { type, category, itemsOnly, search } = queries;
  const join = itemsOnly === 'true' ? 'join "items" using ("recordId")' : '';
  let filter = '';
  const queryParams = [];
  if (type !== 'null') {
    filter = 'AND ("isDebit" = $3)';
    queryParams.push(type);
  }
  if (category !== 'null') {
    filter += ' AND ("category" = $4)';
    queryParams.push(category);
  }
  if (search !== undefined) {
    if (itemsOnly === 'true') {
      filter += ` AND ("itemname" LIKE '%' || $${queryParams.length + 3} || '%')`;
    } else {
      filter += ` AND ("source" LIKE '%' || $${queryParams.length + 3} || '%')`;
    }
    queryParams.push(search);
  }
  const sql = `
                select *
                from "records"
                ${join}
                where ("userId" = $1) ${filter}
                order by "year" desc, "month" desc, "day" desc
                limit 10
                offset $2;
                `;
  console.log('the sql in write', sql);
  console.log('the query params in write', queryParams);
  return { sql, queryParams };
}

// queries = {
//   itemsOnly: Boolean,
//   type: boolean or null,
//   category: string,
//   search: string
// }

// '%' || $1 || '%'
