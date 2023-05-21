import { months } from './catergory-data';

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

/**
 * Formats the monthly budget goals into a useable object to create a card component.
 * @param {object} budgets goals object for each category
 * @param {number} currentMonth number provided from the server.
 * @param {number} previousMonth number provided from the server.
 * @returns a cardData object for each category with default monthly totals of 0.
 */
export function formatBudgetData(budgets, currentMonth, previousMonth) {
  const cardData = {}
  for (const [key, value] of Object.entries(budgets)) {
    cardData[key] = {
      goal: value,
      [currentMonth]: 0,
      [previousMonth]: 0
    }
  }
  return cardData;
}

/**
 * Combines the budget data with the monthly totals on a cardData object.
 * @param {object} cardData object with keys for each category and values for, goal, and 2 months.
 * @param {array} totalsSpent array of objects containing a number total for a category of a specified month.
 * @param {number} currentMonth provided by the server.
 * @param {number} previousMonth provided by the server.
 * @returns The card data object with any matching data for monthly totals updated.
 */
export function combineBudgetTotals(cardData, totalsSpent, currentMonth, previousMonth) {
  for (let i = 0; i < totalsSpent.length; i++) {
    const month = currentMonth === totalsSpent[i].month ? currentMonth : previousMonth;
    cardData[totalsSpent[i].category][month] = totalsSpent[i].totalSpent;
  }
  return cardData
}
