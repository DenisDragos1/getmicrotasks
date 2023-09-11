import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function DetailsSubmisionPage() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8081/submissions/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setSubmission(data))
      .catch(error => {
        console.error('Error fetching microtask:', error);
        setSubmission(null);
      });
  }, [id]);

  if (!submission) {
    return <p>Error loading microtask.</p>;
  }
const authenticated=true;
  return (
    <div>
      <Navbar authenticated={authenticated}/>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Detalii despre submission</h2>
        <p>ID: {submission.ID}</p>
        <p>Descriere: {submission.submission_text}</p>
        {submission.submission_images && (
          <img
            src={`http://localhost:8081/backend/images/${submission.submission_images}`}
            alt={submission.submission_images}
            className="max-w-full h-auto mt-4"
          />
        )}
        <div className="flex space-x-4">
          <button
            onClick={() => {
              axios
                .post(`http://localhost:8081/updateSubmissionStatus/${submission.ID}`, { newStatus: 1 }, { withCredentials: true })
                .then(() => {
                  // Actualizează starea submisiei local înainte de redirecționare (opțional)
                  setSubmission({ ...submission, is_approved: 1 });

                  // Redirecționează către pagina de acasă
                  navigate('/');
                })
                .catch((error) => {
                  console.error('Error updating submission status:', error);
                });
            }}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
          >
            Accepta
          </button>
          <Link
            to={`/respinge/${submission.ID}`}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center"
          >
            <span>Respinge</span>
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}

export default DetailsSubmisionPage;
