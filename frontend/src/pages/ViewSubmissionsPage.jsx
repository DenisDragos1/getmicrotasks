import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
    <div>
      <h2 className="text-2xl font-semibold mb-4">Submissions for Microtask {microtaskId}</h2>
      <ul>
        {submissions.map((submission) => (
          <li key={submission.id}>{submission.submission_text}</li>
        ))}
      </ul>
    </div>
  );
}

export default ViewSubmissionsPage;
