import  { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SubmisionPage() {
  const { id } = useParams();
  const [submisionData, setSubmisionData] = useState({
    submission_text: '',
    submission_images: null,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubmisionData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    setSubmisionData({ ...submisionData, submission_images: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('submission_text', submisionData.submission_text);
      formData.append('submission_images', submisionData.submission_images);

      const response = await axios.post(`http://localhost:8081/submisions/${id}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('Submision a fost înregistrat cu succes!');
        setError('');
        navigate('/');
      } else {
        setError('Eroare la înregistrare.');
      }
    } catch (error) {
      setError('Eroare la înregistrare.');
      console.error(error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Submit Submision</h2>
      <textarea
        name="submission_text"
        type="text"
        value={submisionData.submission_text}
        onChange={handleChange}
        placeholder="Enter your submission text"
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="file"
        name="submission_images"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full p-2 mb-4 border rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
}

export default SubmisionPage;
