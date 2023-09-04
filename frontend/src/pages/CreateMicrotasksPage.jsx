import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function CreateMicrotasksPage() {
  const authenticated = true;
  const [values, setValues] = useState({
    titlu: '',
    descriere: '',
    credite: '',
    credite1: '',
    timp: '',
    pozitii: '',
    categorie: '',
    tara: '',
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (name === 'credite' || name === 'credite1') {
      const totalPozitii = calculateTotalPozitii(values.credite, values.credite1);
      setValues((prev) => ({ ...prev, pozitii: totalPozitii }));
    }
  };

  const calculateTotalPozitii = (credite, credite1) => {
    const totalCredite = parseFloat(credite);
    const creditePerPozitie = parseFloat(credite1);
    const totalPozitii = totalCredite / creditePerPozitie;
    return isNaN(totalPozitii) ? '' : Math.floor(totalPozitii);
  };
  const [error, setError] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values); // Afișează obiectul values în consolă
    axios
      .post('http://localhost:8081/createmicrotasks', values, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          console.log('Microtask adăugat cu succes!');
          navigate('/');
        }
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          setError('Nu aveți suficiente credite pentru a adăuga acest microtask.');
        } else {
          setError('Eroare la adăugarea microtask-ului.');
        }
        console.error(err);
      });
  };

  return (
    <div>
       <Navbar authenticated={authenticated} />
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Adăugare Microtask
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="px-6 pt-4 pb-6">
            <label htmlFor="titlu" className="block text-sm font-medium text-gray-700">
                  Titlu:
              </label>
              <input
                id="titlu"
                name="titlu"
                type="text"
                autoComplete="off"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Titlu"
                value={values.titlu}
                onChange={handleChange}
              />
            </div>
            <div className="px-6 pt-4 pb-6">
              <label htmlFor="categorie" className="block text-sm font-medium text-gray-700">
                Categorie:
              </label>
              <input
                id="categorie"
                name="categorie"
                type="text"
                autoComplete="off"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="categorie"
                value={values.categorie}
                onChange={handleChange}
              />
            </div>
            <div className="px-6 pt-4 pb-6">
              <label htmlFor="descriere" className="block text-sm font-medium text-gray-700">
                Descriere:
              </label>
              <textarea
                id="descriere"
                name="descriere"
                rows="4"
                autoComplete="off"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Descriere"
                value={values.descriere}
                onChange={handleChange}
              />
            </div>
           
            <div className="px-6 pt-4 pb-6">
              <label htmlFor="credite" className="block text-sm font-medium text-gray-700">
                Numar total de credite pe task:
              </label>
              <input
                id="credite"
                name="credite"
                type="number"
                autoComplete="off"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Credite task"
                value={values.credite}
                onChange={handleChange}
              />
            </div>
            <div className="px-6 pt-4 pb-6">
              <label htmlFor="credite1" className="block text-sm font-medium text-gray-700">
                Crtedit alocat pe pozitie:
              </label>
              <input
                id="credite1"
                name="credite1"
                type="number"
                autoComplete="off"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Credit pe pozitie"
                value={values.credite1}
                onChange={handleChange}
              />
            </div>
            <div className="px-6 pt-4 pb-6">
              <label htmlFor="timp" className="block text-sm font-medium text-gray-700">
                Timp completare task:
              </label>
              <input
                id="timp"
                name="timp"
                type="number"
                autoComplete="off"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="timp"
                value={values.timp}
                onChange={handleChange}
              />
            </div>
            {values.credite && values.credite1 && (
         <div className="bg-indigo-100 border border-indigo-200 rounded-md p-3">
         Număr total de poziții: {calculateTotalPozitii(values.credite, values.credite1)}
       </div>
        )}
            

            <div className="px-6 pt-4 pb-6">
              <label htmlFor="tara" className="block text-sm font-medium text-gray-700">
                Țară:
              </label>
              <input
                id="tara"
                name="tara"
                type="text"
                autoComplete="off"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Țară"
                value={values.tara}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Adăugare Microtask
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
    </div>
  );
}

export default CreateMicrotasksPage;