import { useState, useEffect } from "react";
import getMonthsRecords from "../lib/api";
import { getMonthlyTotals } from "../lib/dataSorting";
import MonthlyTotalsCard from "../components/MonthlyTotalsCard";


export default function UserHome() {
  const [monthlyTotals, setMonthlyTotals] = useState();

  useEffect(() => {
    const getMonthlyRecords = async () => {
      try {
        const monthlyRecords = await getMonthsRecords();
        const monthsTotals = getMonthlyTotals(monthlyRecords);
        setMonthlyTotals(monthsTotals);
      } catch (err) {
        console.error(err)
      }
    }
    getMonthlyRecords();
  }, []);

  return (
    <div className="container-fluid">
    <h1>User's Home Page</h1>
      <div className="row">
        <div className="col d-flex justify-content-center">
          {monthlyTotals ? <MonthlyTotalsCard monthlyTotals={monthlyTotals}/> : <h3 style={{color: 'white'}}>Loading!</h3>}
        </div>
      </div>
    </div>
  );
}
