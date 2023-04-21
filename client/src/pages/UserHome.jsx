import { useState, useEffect } from "react";
import getMonthsRecords from "../lib/api";
import { getMonthlyTotals } from "../lib/dataSorting";
import MonthlyTotalsCard from "../components/MonthlyTotalsCard";


export default function UserHome() {
  const [monthlyTotals, setMonthlyTotals] = useState();
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    console.log('entering use effect.')
    const getMonthlyRecords = async () => {
      setIsLoading(true)
      try {
        console.log('sending fetch');
        const monthlyRecords = await getMonthsRecords();
        const monthsTotals = getMonthlyTotals(monthlyRecords);
        setMonthlyTotals(monthsTotals);
        setIsLoading(false)
      } catch (err) {
        console.error(err)
      }
    }
    if(isLoading) getMonthlyRecords();
    if (isLoading === undefined) setIsLoading(() => !isLoading);
  }, [isLoading]);



  return (
    <div className="container-fluid">
    <h1>User's Home Page</h1>
      <div className="row">
        <div className="col d-flex justify-content-center">
          <MonthlyTotalsCard monthlyTotals={monthlyTotals}/>
        </div>
      </div>
    </div>
  );
}
