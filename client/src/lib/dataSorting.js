
/**
 * Takes the records from the server and calcutlates the totals for each month and
 * assigns the months names as properties.
 * @param {object} monthsRecords object from the database.
 * @returns a modifified object with three properties, totals, thisMonth and lastMonth.
 */
export function getMonthlyTotals(monthsRecords, filteredMonths) {
  const allMonths = filteredMonths
  const totalZero = 0;
  for (let month in allMonths) {
    const total = allMonths[month].reduce(
      (accumulator, record) => accumulator + Number(record.totalSpent),
      totalZero
    );
    allMonths[month] = total.toFixed(2);
  }
  return { totals: allMonths, thisMonth: months[monthsRecords.thisMonth].name, lastMonth: months[monthsRecords.lastMonth].name};
}

const months = [{ name: 'January', length: 31 }, { name: 'February', length: 28 }, { name: 'March', length: 31 }, { name: 'April', length: 30 }, { name: 'May', length: 31 }, { name: 'June', length: 30 }, { name: 'Jul', length: 31 }, { name: "August", length: 31 }, { name: "September", length: 30 }, { name: "October", length: 31 }, { name: "November", length: 30 }, { name: "December", length: 31 }];

/**
 * Filters the two months into this month and last month and by debits or credits.
 * @param {object} monthsRecords object from the server.
 * @returns an object with 4 properties.
 */
export function filterMonths(monthsRecords) {
  const thisMonthsDebits = monthsRecords.records.filter((r) => r.month === monthsRecords.thisMonth && r.inOut);
  const thisMonthsCredits = monthsRecords.records.filter((r) => r.month === monthsRecords.thisMonth && !r.inOut);
  const lastMonthsDebits = monthsRecords.records.filter((r) => r.month === monthsRecords.lastMonth && r.inOut);
  const lastMonthsCredits = monthsRecords.records.filter((r) => r.month === monthsRecords.lastMonth && !r.inOut);
  const monthsFiltered = { thisMonthsDebits, thisMonthsCredits, lastMonthsDebits, lastMonthsCredits };
  return monthsFiltered;
}



export function getChartData (monthsRecords, filteredMonths) {
  const { thisMonth, lastMonth } = monthsRecords;
  const longestMonth = months[thisMonth].length >= months[lastMonth].length ? months[thisMonth].length : months[lastMonth].length;
  const chartData = [];
  const zeroValue = 0;
  for (let i = 0; i < longestMonth; i ++) {
    chartData.push({day: i})
    chartData[i].thisMonthDebit = filteredMonths.thisMonthsDebits.filter((m) => m.day - 1 === i).reduce((accumulator, record) => accumulator + Number(record?.totalSpent), zeroValue);
    chartData[i].thisMonthCredit = filteredMonths.thisMonthsCredits.filter((m) => m.day - 1 === i).reduce((accumulator, record) => accumulator + Number(record?.totalSpent), zeroValue);
  }
  console.log('chart data totals', chartData)
  return chartData
}

const dataPoint = {
  day: 1,
  thisMonthDebit: 3,
  thisMonthCredit: 4,
}
