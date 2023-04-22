import { useState, useEffect } from "react";
import getMonthsRecords from "../lib/api";
import { getMonthlyTotals, getChartData, filterMonths } from "../lib/dataSorting";
import MonthlyTotalsCard from "../components/MonthlyTotalsCard";
import { MonthlyChart } from "../components/BarChart";

/**
 * Creates the users home page and displays their monthly totals.
 * @returns the home page.
 */
export default function UserHome() {
  const [monthlyTotals, setMonthlyTotals] = useState();
  const [chartData, setChartData] = useState();

  /**
   * Calls a fetch request to the server then
   * calls a function to format the response and
   * set the montlyTotals.
   */
  useEffect(() => {
    const getMonthlyRecords = async () => {
      try {
        const monthlyRecords = await getMonthsRecords();
        const filteredMonths = filterMonths(monthlyRecords)
        const monthsTotals = getMonthlyTotals(monthlyRecords, Object.assign({}, filteredMonths));
        setMonthlyTotals(monthsTotals);
        const monthsChartData = getChartData(monthlyRecords, filteredMonths);
        setChartData(monthsChartData)
      } catch (err) {
        console.error(err)
      }
    }
    getMonthlyRecords();
  }, []);
  return (
    <div className='container-fluid'>
    <h1>User's Home Page</h1>
      <div className='row'>
        <div className='col d-flex justify-content-center'>
          {monthlyTotals ? <MonthlyTotalsCard monthlyTotals={monthlyTotals}/> : <h3 style={{color: 'white'}}>Loading!</h3>}
        </div>
        <div style={{backgroundColor: 'White', display: 'flex', justifyContent: 'center'}}>
          {chartData ? <MonthlyChart chartData={chartData} /> : <h4>LOADING CHART</h4>}
        </div>
      </div>
    </div>
  );
}
