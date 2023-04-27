export default function writeRecordsSql(queries) {
  const { type, category, search } = queries;
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
    filter += ` AND ("itemname" LIKE '%' || $${queryParams.length + 3} || '%') OR ("source" LIKE '%' || $${queryParams.length + 3} || '%')`;
    queryParams.push(search);
  }
  const sql = `
                select *
                from "records"
                join "items" using ("recordId")
                where ("userId" = $1) ${filter}
                order by "year" desc, "month" desc, "day" desc
                limit 10
                offset $2;
                `;
  return { sql, queryParams };
}

// queries = {
//   type: boolean or null,
//   category: string,
//   search: string
// }

// '%' || $1 || '%'