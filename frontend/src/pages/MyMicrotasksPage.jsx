import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
function MyMicrotasksPage() {
  const [microtasks, setMicrotasks] = useState([]);
  const authenticated = true; // Modificați această valoare în funcție de starea autentificării utilizatorului

  useEffect(() => {
    if (authenticated) {
      axios.get('http://localhost:8081/mymicrotasks', { withCredentials: true })
        .then((response) => {
          setMicrotasks(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [authenticated]);
  
  return (
    <div>
    <Navbar authenticated={authenticated}/>
    <div>
      <h2 className="text-2xl font-semibold mb-4">Microtasks</h2>
      {authenticated ? (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Titlu</th>
              <th className="px-4 py-2">Descriere</th>
              <th className="px-4 py-2">Tara</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {microtasks.map((microtask, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                <td className="border px-4 py-2">{microtask.ID}</td>
                <td className="border px-4 py-2">{microtask.titlu}</td>
                <td className="border px-4 py-2">{microtask.descriere}</td>
                <td className="border px-4 py-2">{microtask.tara}</td>
                <td className="border px-4 py-2">
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                <Link to={`/viewsubmissions/${microtask.ID}`}>Vezi submissions</Link>               
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Utilizatorul nu este autentificat.</p>
      )}
    </div>
   </div>
  );
  
}

export default MyMicrotasksPage;
