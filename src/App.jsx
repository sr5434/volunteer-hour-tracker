import './App.css';
import { useState, useEffect } from 'react';

//To view app, visit this URL: https://solid-memory-7q7wwqrppx9hpxpv-3000.app.github.dev/

function Item({ data }) {
  return (
    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {data.location}
        </th>
        <td class="px-6 py-4">
            {data.duration}
        </td>
        <td class="px-6 py-4">
            {data.dateOfService.slice(0,-14)}
        </td>
        <td class="px-6 py-4">
        <button type="button" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={async () => {
          await fetch(`http://localhost:8000/delete/${data.id}`, {
            method: 'DELETE'
          });
          window.location.reload();
        }}>Delete</button>
        </td>
    </tr>
  );
}

function App() {
  //Placeholder data; in the future we will fetch data from DB2
  const [data, setData] = useState([]);
  const [hours, setHours] = useState(0);
  useEffect(() => {
    fetch('http://localhost:8000/volunteerData')
      .then(response => response.json())
      .then(data => setData(data))
      .then(console.log(data));
  }, []);
  useEffect(() => {
    let totalHours = 0;
    data.forEach(event => {
      totalHours += parseInt(event.duration);
    });
    setHours(totalHours);
  }, [data]);
  const [ location, setLocation ] = useState("");
  const [ timeSpent, setTimeSpent ] = useState("");
  const [ date, setDate ] = useState("");
  const handleLocationInput = async (e) => {
    const fieldValue = e.target.value;

    await setLocation(fieldValue);
  }
  const handleTimeSpentInput = async (e) => {
    const fieldValue = e.target.value;

    await setTimeSpent(fieldValue);
  }

  const handleDateInput = async (e) => {
    const fieldValue = e.target.value;

    await setDate(fieldValue);
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setData([...data, {
      "id": "abcdef-ghijk-lmnop-qrstuv-wxyz",
      "location": location,
      "duration": timeSpent,
      "dateOfService": date + "T00:00:00.000Z"
    }]);
    const response = await fetch('http://localhost:8000/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
      },
      body: JSON.stringify({
        location: location,
        timeSpent: timeSpent,
        date: date
      })
    });
  }
  return (
    <div className="App">
      <h1 className='text-3xl font-bold text-center'>Volunteer hours tracker</h1>
      <h2 className='text-center'>You have volunteered for {hours} hours!</h2>
      <form onSubmit={submitHandler}>
        <label className="block mb-2 pt-6 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Location</label>
        <textarea
          id="locationInput"
          value={location}
          onChange={handleLocationInput}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <br />
        <label className="block mb-2 pt-6 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Duration</label>
        <input
          id="timeSpentInput"
          type="number"
          value={timeSpent}
          onChange={handleTimeSpentInput}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <br />
        <label className="block mb-2 pt-6 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Date</label>
        <input
          id="locationInput"
          type="date"
          value={date}
          onChange={handleDateInput}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <br />
        <button 
          type="submit"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ml-40 shadow-lg"
          >
          Add
        </button>
      </form>
      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th scope="col" class="px-6 py-3">
                      Location
                  </th>
                  <th scope="col" class="px-6 py-3">
                      Time Spent
                  </th>
                  <th scope="col" class="px-6 py-3">
                      Date
                  </th>
                  <th scope="col" class="px-6 py-3">
                      Delete
                  </th>
              </tr>
          </thead>
          <tbody>
              {data.map((event) => {return <Item data={event}/>})}
          </tbody>
        </table>
    </div>
    </div>
  );
}

export default App;
