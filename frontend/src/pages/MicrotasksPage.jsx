import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
function MicrotasksPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/microtasks')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  }, []);
const authenticated=true;
  return (
    <div>
      <Navbar authenticated={authenticated}/>
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Microtasks</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Titlu</th>
            <th className="px-4 py-2">Descriere</th>
            <th className="px-4 py-2">Tara</th>
            <th className="px-4 py-2">Pozitii totale</th>
            <th className="px-4 py-2">Pozitii aprobate</th>
            <th className="px-4 py-2">Credite pe task</th>
            <th className="px-4 py-2">Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
              <td className="border px-4 py-2">{d.ID}</td>
              <td className="border px-4 py-2">{d.titlu}</td>
              <td className="border px-4 py-2">{d.descriere}</td>
              <td className="border px-4 py-2">{d.tara}</td>
              <td className="border px-4 py-2">{d.pozitii}</td>
              <td className="border px-4 py-2">{d.pozitii_aprobate}</td>
              <td className="border px-4 py-2">{d.credite1}</td>
              <td className="border px-4 py-2">
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                <Link to={`/microtasks/${d.ID}`} className="text-white-500 hover:underline">
                  Detalii
                </Link>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
 
}

export default MicrotasksPage;
