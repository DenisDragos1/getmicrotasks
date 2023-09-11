import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function ViewMicrotaskPage() {
  const { id } = useParams();
  const [microtask, setMicrotask] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8081/microtasks/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setMicrotask(data))
      .catch(error => {
        console.error('Error fetching microtask:', error);
        setMicrotask(null);
      });
  }, [id]);

  if (!microtask) {
    return <p>Error loading microtask.</p>;
  }
const authenticated=true;
  return (
    <div>
    <Navbar authenticated={authenticated}/>
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">View Microtask</h2>
      <p>ID: {microtask.ID}</p>
      <p>Titlu: {microtask.titlu}</p>
      <p>Descriere: {microtask.descriere}</p>
      <p>Tara: {microtask.tara}</p>
      <p>Credite pe task: {microtask.credite}</p>
      <p>Credtie pe microworker : {microtask.credite1}</p>
      <p>Timp: {microtask.timp}</p>
      <p>Pozitii: {microtask.pozitii}</p>
      <p>Pozitii aprobate: {microtask.pozitii_aprobate}</p>
      <p>Categorie: {microtask.categorie}</p>
      <p>User id: {microtask.user_id}</p>
      <p>Aprobata: {microtask.is_approved}</p>
      <Link to={`/submisions/${id}`} className="text-blue-500 hover:underline">
                  Rezolva
                </Link>
    </div>
    </div>
  );
}

export default ViewMicrotaskPage;
