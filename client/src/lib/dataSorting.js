
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
  const thisMonthsDebits = monthsRecords.records.filter((r) => r.month === monthsRecords.thisMonth && r.isDebit);
  const thisMonthsCredits = monthsRecords.records.filter((r) => r.month === monthsRecords.thisMonth && !r.isDebit);
  const lastMonthsDebits = monthsRecords.records.filter((r) => r.month === monthsRecords.lastMonth && r.isDebit);
  const lastMonthsCredits = monthsRecords.records.filter((r) => r.month === monthsRecords.lastMonth && !r.isDebit);
  const monthsFiltered = { thisMonthsDebits, thisMonthsCredits, lastMonthsDebits, lastMonthsCredits };
  return monthsFiltered;
}


/**
 * Creates an object for the chart component with 4 data points for each day of the month, defaulting to zero if no data.
 * @param {object} monthsRecords containing the current and previous month.
 * @param {object} filteredMonths an object with presorted records in arrays.
 * @returns an object that is compatible with recharts.
 */
export function getChartData (monthsRecords, filteredMonths) {
  const { thisMonth, lastMonth } = monthsRecords;
  const longestMonth = months[thisMonth].length >= months[lastMonth].length ? months[thisMonth].length : months[lastMonth].length;
  const chartData = [];
  for (let i = 1; i < longestMonth + 1; i ++) {
    chartData.push({day: i})
    chartData[i - 1].thisMonthDebit = getDay(filteredMonths.thisMonthsDebits, i);
    chartData[i - 1].thisMonthCredit = getDay(filteredMonths.thisMonthsCredits, i);
    chartData[i - 1].lastMonthDebit = getDay(filteredMonths.lastMonthsDebits, i);
    chartData[i - 1].lastMonthCredit = getDay(filteredMonths.lastMonthsCredits, i);
  }
  return chartData
}

/**
 * Gets the total spent for a specific day from a month.
 * @param {array} filteredMonth records of specific type for a month.
 * @param {number} day of month.
 * @returns a number representing the total spent for the day.
 */
function getDay(month, day) {
  const zeroValue = 0;
  const dayRecords = month.filter((m) => m.day + 1 === day);
  const dayTotal = dayRecords.reduce((accumulator, record) => accumulator + Number(record?.totalSpent), zeroValue);
  return dayTotal;
}

/**
 * Turns an object containing an array of record object and an array of item objects,
 * and adds matching items as a propety of the corresponding object.
 * @param {object} records is the object returned from the database.
 * @returns an array of record objects.
 */
export function sortRecords(records) {
  const newRecords = records.records
  for (let i = 0; i < newRecords.length; i++) {
    const sortedItems = records.items.filter(item => item.recordId === newRecords[i].recordId)
    newRecords[i].items = sortedItems;
  }
  return newRecords;
}
