
/**
 * Takes the records from the server and calcutlates the totals for each month and
 * assigns the months names as properties.
 * @param {object} monthsRecords object from the database.
 * @returns a modifified object with three properties, totals, thisMonth and lastMonth.
 */
export function getMonthlyTotals(monthsRecords) {
  const thisMonthsDebits = monthsRecords.records.filter((r) => r.month === monthsRecords.thisMonth && r.inOut);
  const thisMonthsCredits = monthsRecords.records.filter((r) => r.month === monthsRecords.thisMonth && !r.inOut);
  const lastMonthsDebits = monthsRecords.records.filter((r) => r.month === monthsRecords.lastMonth && r.inOut);
  const lastMonthsCredits = monthsRecords.records.filter((r) => r.month === monthsRecords.lastMonth && !r.inOut);
  const totalZero = 0;
  const  allMonths = { thisMonthsDebits, thisMonthsCredits, lastMonthsDebits, lastMonthsCredits };
  for (let month in allMonths) {
    const total = allMonths[month].reduce(
      (accumulator, record) => accumulator + Number(record.totalSpent),
      totalZero
    );
    allMonths[month] = total.toFixed(2);
  }
  return { totals: allMonths, thisMonth: months[monthsRecords.thisMonth], lastMonth: months[monthsRecords.lastMonth]};
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'Jul', 'August', 'September', 'October', 'November', 'December'];
