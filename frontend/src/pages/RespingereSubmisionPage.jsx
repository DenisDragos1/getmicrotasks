import  { useState } from 'react';
import axios from 'axios';
import { useParams ,useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';

function RespingereSubmisionPage() {
    const { submissionId } = useParams();
    console.log('submissionId:', submissionId);
    
  const [motivRespingere, setMotivRespingere] = useState('');
  const [error, setError] = useState('');
const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8081/respinge/${submissionId}`, {
        motiv_respingere: motivRespingere,
      });

      if (response.status === 200) {
        // Redirecționează sau afișează mesajul de succes
        console.log('Submisie respinsă cu succes!');
        navigate('/');
      }
    } catch (error) {
      setError('Eroare la respingerea submisiei.');
      console.error(error);
    }
  };
const authenticated=true;
  return (
    <div>
    <Navbar authenticated={authenticated}/>
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">De ce respingi aceast submission?</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="motivRespingere" className="block text-sm font-medium text-gray-700">
            Motivul respingerii:
          </label>
          <textarea
            id="motivRespingere"
            name="motivRespingere"
            rows="4"
            required
            className="mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={motivRespingere}
            onChange={(e) => setMotivRespingere(e.target.value)}
          />
        </div>
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            Respinge Submisie
          </button>
        </div>
        {error && (
          <div className="text-red-500 mt-2">
            <p>{error}</p>
          </div>
        )}
      </form>
    </div>
    </div>
  );
}

export default RespingereSubmisionPage;
