import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function MicrotasksPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/microtasks')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Microtasks</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Titlu</th>
            <th className="px-4 py-2">Descriere</th>
            <th className="px-4 py-2">Tara</th>
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
              <td className="border px-4 py-2">
                <Link to={`/microtasks/${d.ID}`} className="text-blue-500 hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MicrotasksPage;
