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
    filter += ` AND ("itemName" ILIKE '%' || $${queryParams.length + 3} || '%')`;
    queryParams.push(search);
  }
  const sql = `
                select *
                from "records"
                join "items" using ("recordId")
                where ("userId" = $1) ${filter}
                order by "year" desc, "month" desc, "day" desc, "itemId" desc
                limit 15
                offset $2;
                `;
  return { sql, queryParams };
}
