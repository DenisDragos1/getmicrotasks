import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
function MySubmisionPage() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await axios.get(`http://localhost:8081/mysubmissions`, {
          withCredentials: true,
        });

        setSubmissions(response.data.submissions);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    }

    fetchSubmissions();
  }, []);
const authenticated=true;
  return (
    <div>
    <Navbar authenticated={authenticated}/>
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">My Submissions</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            {/* <th className="border px-4 py-2">ID</th> */}
            <th className="border px-4 py-2">Text</th>
            <th className="border px-4 py-2">microtask</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
            

          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} className={submission.id % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
              {/* <td className="border px-4 py-2">{submission.id}</td> */}
              <td className="border px-4 py-2">{submission.submission_text}</td>
              <td className="border px-4 py-2">{submission.microtask_id}</td>
              <td className="border px-4 py-2">
                {submission.submission_images && (
                  <img
                    src={`http://localhost:8081/backend/images/${submission.submission_images}`}
                    alt={submission.submission_images}
                    style={{ maxWidth: '100px' }}
                  />
                )}
              </td>
              <td className="border px-4 py-2">
  {submission.is_approved === 0 ? (
    <span className="text-yellow-500">Pending</span>
  ) : submission.is_approved === -1 ? (
    <span className="text-red-500">Respins</span>
  ) : (
    <span className="text-green-500">Acceptat</span>
  )}
</td>

              <td className="border px-4 py-2">
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
  <Link to={`/mysubmissions/${submission.ID}`}>
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

export default MySubmisionPage;
