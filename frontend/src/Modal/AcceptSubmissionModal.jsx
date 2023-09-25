import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AcceptSubmissionModal from '../Modal/AcceptSubmissionModal';

function ViewSubmissionsPage() {
  const { microtaskId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/viewsubmissions/${microtaskId}`, {
        withCredentials: true,
      })
      .then((response) => {
        setSubmissions(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [microtaskId]);

  const authenticated = true;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <Navbar authenticated={authenticated} />
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">
          Submissions for Microtask {microtaskId}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Text</th>
                <th className="border px-4 py-2">Image</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr
                  key={submission.id}
                  className={submission.id % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  <td className="border px-4 py-2">{submission.ID}</td>
                  <td className="border px-4 py-2">{submission.submission_text}</td>
                  <td className="border px-4 py-2">
                    {submission.submission_images && (
                      <img
                        src={`http://localhost:8081/backend/images/${submission.submission_images}`}
                        alt={submission.submission_images}
                        style={{ maxWidth: '100px' }}
                      />
                    )}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => {
                        setModalOpen(true);
                        setSelectedSubmission(submission);
                      }}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                    >
                      Accepta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalOpen && (
        <AcceptSubmissionModal
          setOpenModal={setModalOpen}
          submission={selectedSubmission}
        />
      )}
    </div>
  );
}

export default ViewSubmissionsPage;
