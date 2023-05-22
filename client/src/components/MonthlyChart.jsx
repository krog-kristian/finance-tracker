import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import { useMediaQuery } from 'react-responsive';

/**
 * Creates a line chart with four line for this month and the previous month.
 * @param {array} chart data, an array of objects with data for the chart.
 * @returns a chart component.
 */
export function MonthlyChart({ chartData }) {
  const isLargeScreen = useMediaQuery({
    query: '(min-width: 900px)'
  });

  return (
    <div style={isLargeScreen ? { width: '75%', backgroundColor: 'white'} : { width: '100%', backgroundColor: 'white' }} className='pe-3 pb-3 pt-3 my-5 rounded'>
      <h3>Daily Totals</h3>
      <ResponsiveContainer aspect={2} width='100%'>
        <LineChart data={chartData}>
          <CartesianGrid stroke='#ccc' />
          <XAxis dataKey='day' minTickGap={40} />
          <YAxis type='number' domain={[0, 'dataMax + 50']} />
          <Legend />
          <Line type='monotone' name='This Months Debits' dataKey='thisMonthDebit' stroke='#eb7134' strokeWidth={2} dot={false} />
          <Line type='monotone' name='This Months Credits' dataKey='thisMonthCredit' stroke='#37eb34' strokeWidth={2} dot={false} />
          <Line type='monotone' name='Last Months Debits' dataKey='lastMonthDebit' stroke='#3f4704' strokeWidth={2} dot={false} />
          <Line type='monotone' name='Last Months Credits' dataKey='lastMonthCredit' stroke='#3493eb' strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
