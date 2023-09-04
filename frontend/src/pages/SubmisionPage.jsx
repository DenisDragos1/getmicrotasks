import { useState, useEffect } from 'react';
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

  const [microtaskTime, setMicrotaskTime] = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    // Obține timpul pentru microtask din backend
    axios.get(`http://localhost:8081/microtasks/${id}`)
      .then((response) => {
        setMicrotaskTime(response.data.timp); // Presupun că obții timpul în format "HH:MM:SS"
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    if (!microtaskTime || expired) {
      return; // Nu facem nimic dacă timpul nu este încă disponibil sau a expirat
    }

    const timer = setInterval(() => {
      const parts = microtaskTime.split(':');
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const seconds = parseInt(parts[2]);

      if (hours === 0 && minutes === 0 && seconds === 0) {
        clearInterval(timer);
        setExpired(true);
        // Aici puteți face apel la ruta backend pentru a actualiza "expirat" în baza de date
        axios.post(`http://localhost:8081/updateExpire/${id}`)
          .then(() => {
            console.log('Valoarea "expirat" a fost actualizată cu succes.');
          })
          .catch((error) => {
            console.error('Eroare la actualizarea valorii "expirat".', error);
          });
        navigate('/microtasks'); // Redirecționează către pagina /microtasks după expirare
      } else {
        let newHours = hours;
        let newMinutes = minutes;
        let newSeconds = seconds - 1;

        if (newSeconds < 0) {
          newMinutes -= 1;
          newSeconds = 59;
        }

        if (newMinutes < 0) {
          newHours -= 1;
          newMinutes = 59;
        }

        const newTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
        setMicrotaskTime(newTime);
      }
    }, 1000);

    return () => {
      clearInterval(timer); // Curățăm intervalul la dezmontare
    };
  }, [microtaskTime, expired, navigate, id]);

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
      {microtaskTime && (
        <div className="mb-4">
          <p>Timp ramas: {microtaskTime}</p>
        </div>
      )}
      {expired && (
        <p>Time expired. Redirecting to /microtasks...</p>
      )}
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
