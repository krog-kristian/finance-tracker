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

/**
 * Sends the server request to sign up a new user.
 * @param {object} user object with all fields for a new user.
 * @returns the response from the server
 */
export async function sendSignUp(user) {
  const response = await fetch('/api/home/sign-up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user)
  });
  if (!response.ok) throw new Error(`Invalid New User.`, { cause: response })
  const confirm = await response.json();
  return confirm;
}
