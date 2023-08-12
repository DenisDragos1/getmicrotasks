import { useEffect, useState } from 'react'


function UsersPage() {
  const [data,setData]=useState([])
    useEffect(()=>{
  fetch('http://localhost:8081/users')
  .then(res=>res.json())
  .then(data=>setData(data)) 
  .catch(err=>console.log(err));
},[]);

    return (
      <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Tabel utilizatori</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nume</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Parola</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
              <td className="border px-4 py-2">{d.ID}</td>
              <td className="border px-4 py-2">{d.nume}</td>
              <td className="border px-4 py-2">{d.email}</td>
              <td className="border px-4 py-2">{d.parola}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersPage