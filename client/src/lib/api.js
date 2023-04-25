/**
 * A fetch request to the server for this month and last months results
 * dates determined server side.
 * @returns the server response.
 */
export default async function getMonthsRecords (tokenKey) {

 try {
  const token = localStorage.getItem(tokenKey);
  const res = await fetch('/api/home', { headers: { 'Authorization': `Bearer ${token}`} });
  if (!res.ok) throw new Error(`Could not load results ${res.status}`);
  const records = await res.json();
  return records;
 } catch (err) {
  console.error(err);
 }
}
