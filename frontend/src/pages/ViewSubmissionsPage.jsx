import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams,Link } from 'react-router-dom';

function ViewSubmissionsPage() {
  const { microtaskId } = useParams();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8081/viewsubmissions/${microtaskId}`, { withCredentials: true })
      .then((response) => {
        setSubmissions(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [microtaskId]);

  return (
    <div className='p-4'>
      <h2 className="text-2xl font-semibold mb-4">Submissions for Microtask {microtaskId}</h2>
      <div className="overflow-x-auto">
      {/* <ul>
        {submissions.map((submission) => (
          <li key={submission.id}>{submission.submission_text}</li>
        ))}
      </ul> */}
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th> 
            <th className="border px-4 py-2">Text</th>
            {/* <th className="border px-4 py-2">microtask</th> */}
            <th className="border px-4 py-2">Image</th>
            

          </tr>
        </thead>
      <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} className={submission.id % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
               <td className="border px-4 py-2">{submission.ID}</td> 
              <td className="border px-4 py-2">{submission.submission_text}</td>
              {/* <td className="border px-4 py-2">{submission.microtask_id}</td> */}
              <td className="border px-4 py-2">
                {submission.submission_images && (
                  <img
                    src={`http://localhost:8081/backend/images/${submission.submission_images}`}
                    alt={submission.submission_images}
                    style={{ maxWidth: '100px' }}
                  />
                )}
              </td>
              {/* <td className="border px-4 py-2 space-x-2">
  <Link
    to="/submision"
    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
  >
    Vezi submision
  </Link>
  <Link
    to="/respinge"
    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
  >
    Respinge
  </Link>
  <Link
    to="/accepta"
    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
  >
    Accepta
  </Link>
</td> */}
<td className="border px-4 py-2 space-x-2">
  <button
    onClick={() => {
      axios.post(`http://localhost:8081/updateSubmissionStatus/${submission.ID}`, { newStatus: 1 }, { withCredentials: true })
        .then(() => {
          // Actualizează starea submisiei local înainte de redirecționare (opțional)
          const updatedSubmissions = submissions.map(sub => sub.id === submission.id ? { ...sub, is_approved: 1 } : sub);
          setSubmissions(updatedSubmissions);

          // Redirecționează către pagina de acasă
          window.location.href = '/';
        })
        .catch((error) => {
          console.error('Error updating submission status:', error);
        });
    }}
    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
  >
    Accepta
  </button>
  {/* <button
    onClick={() => {
      axios.post(`http://localhost:8081/updateSubmissionStatus/${submission.ID}`, { newStatus: -1 }, { withCredentials: true })
        .then(() => {
          // Actualizează starea submisiei local înainte de redirecționare (opțional)
          const updatedSubmissions = submissions.map(sub => sub.id === submission.id ? { ...sub, is_approved: -1 } : sub);
          setSubmissions(updatedSubmissions);

          // Redirecționează către pagina de acasă
         // window.location.href = '/respinge/${submission.ID}';
          
        })
        .catch((error) => {
          console.error('Error updating submission status:', error);
        });
    }}
    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
  >
    <Link to={`/respinge/${submission.ID}`} className="text-white-500 hover:underline">
    Respinge
    </Link>
  </button> */}
    <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md">

  <Link to={`/respinge/${submission.ID}`} className="text-white-500 hover:underline">
    Respinge
    </Link>
    </button>
  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
  <Link to={`/submissions/${submission.ID}`}>
    Vezi detalii
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

export default ViewSubmissionsPage;
