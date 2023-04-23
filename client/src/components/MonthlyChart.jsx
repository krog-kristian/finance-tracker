import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import AppContext from './AppContext';
import { useContext } from 'react';

export function MonthlyChart({ chartData }) {
  const { isLargeScreen } = useContext(AppContext)
  return (
    <div style={isLargeScreen ? { width: '90%', backgroundColor: 'white', display: 'flex', justifyContent: 'center' } : { width: '100%', backgroundColor: 'white' }} className='pe-3 pb-3 pt-3 my-5 rounded'>
      <ResponsiveContainer aspect={2} width='100%'>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey='day' minTickGap={20} />
          <YAxis type="number" domain={[0, 'dataMax + 50']} />
          <Legend />
          <Line type="monotone" name='This Months Debits' dataKey='thisMonthDebit' stroke="#8884d8" />
          <Line type="monotone" name='This Months Credits' dataKey='thisMonthCredit' stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
