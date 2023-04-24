import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import AppContext from './AppContext';
import { useContext } from 'react';

/**
 * Creates a line chart with four line for this month and the previous month.
 * @param {array} chart data, an array of objects with data for the chart.
 * @returns a chart component.
 */
export function MonthlyChart({ chartData }) {
  const { isLargeScreen } = useContext(AppContext)
  return (
    <div style={isLargeScreen ? { width: '75%', backgroundColor: 'white', display: 'flex', justifyContent: 'center' } : { width: '100%', backgroundColor: 'white' }} className='pe-3 pb-3 pt-3 my-5 rounded'>
      <ResponsiveContainer aspect={2} width='100%'>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey='day' minTickGap={30} />
          <YAxis type="number" domain={[0, 'dataMax + 50']} />
          <Legend />
          <Line type="monotone" name='This Months Debits' dataKey='thisMonthDebit' stroke="#eb7134" strokeWidth={2} />
          <Line type="monotone" name='This Months Credits' dataKey='thisMonthCredit' stroke="#37eb34" strokeWidth={2} />
          <Line type="monotone" name='Last Months Debits' dataKey='lastMonthDebit' stroke="#3f4704" strokeWidth={2} />
          <Line type="monotone" name='Last Months Credits' dataKey='lastMonthCredit' stroke="#3493eb" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
