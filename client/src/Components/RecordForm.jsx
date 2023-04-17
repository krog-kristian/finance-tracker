
export default function RecordForm() {
  return (
    <div>
      <h1>New Record</h1>
    <form style={{backgroundColor: 'gray', color: 'black'}}>

    <div>
      <label htmlFor="inOut">Select Type</label>
      <select name="inOut" id="inOut">
        <option value={true}>Money Out</option>
        <option value={false}>Money In</option>
      </select>
    </div>

    <div>
      <label htmlFor="source">Source:</label>
      <input type="text" id="source" name="source" />
    </div>

    <div>
      <label htmlFor="numberOfItems"># of Items</label>
      <input type="number" name="numberOfIems" id="numberOfItems" min={1} max={20} />
    </div>
    </form>
    </div>
  )
}
