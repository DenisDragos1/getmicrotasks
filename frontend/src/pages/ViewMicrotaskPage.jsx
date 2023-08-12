import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

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

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">View Microtask</h2>
      <p>ID: {microtask.ID}</p>
      <p>Titlu: {microtask.titlu}</p>
      <p>Descriere: {microtask.descriere}</p>
      <p>Tara: {microtask.tara}</p>
      <Link to={`/submisions/${id}`} className="text-blue-500 hover:underline">
                  Rezolva
                </Link>
    </div>
  );
}

export default ViewMicrotaskPage;
