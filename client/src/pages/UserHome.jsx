import { useState, useEffect } from "react";
import getMonthsRecords from "../lib/api";
import { getMonthlyTotals, getChartData } from "../lib/dataSorting";
import MonthlyTotalsCard from "../components/MonthlyTotalsCard";

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
        const monthsTotals = getMonthlyTotals(monthlyRecords);
        setMonthlyTotals(monthsTotals);
        const monthsChartData = getChartData(monthlyRecords);
        setChartData(monthsChartData)
      } catch (err) {
        console.error(err)
      }
    }
    getMonthlyRecords();
  }, []);
  if(chartData); // REMOVE ME
  return (
    <div className='container-fluid'>
    <h1>User's Home Page</h1>
      <div className='row'>
        <div className='col d-flex justify-content-center'>
          {monthlyTotals ? <MonthlyTotalsCard monthlyTotals={monthlyTotals}/> : <h3 style={{color: 'white'}}>Loading!</h3>}
        </div>
      </div>
    </div>
  );
}
