import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
export function MonthlyChart({ chartData }) {
  return (
  <LineChart width={750} height={500} data={chartData}>
    <CartesianGrid stroke="#ccc" />
    <XAxis dataKey='day' />
      <YAxis type="number" domain={[0, 500]} />
    <Legend />
    <Line type="monotone" dataKey='thisMonthDebit' stroke="#8884d8" />
    <Line type="monotone" dataKey='thisMonthCredit' stroke="#82ca9d" />
  </LineChart>
  )
}
