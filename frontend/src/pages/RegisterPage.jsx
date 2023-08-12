import { useState } from "react";
import { Link, } from "react-router-dom"; // importăm Link și useHistory pentru redirecționare
import Navbar from "../components/Navbar";
import Select from "react-select";


function RegisterPage() {
  const [userData, setUserData] = useState({
    nume: "",
    email: "",
    parola: "",
    tara:"",
  });
  const [error, setError] = useState("");
  const countries = [
    { value: "ro", label: "România" },
    { value: "us", label: "Statele Unite" },
    { value: "fr", label: "Franța" },
    // Adăugați mai multe țări aici
  ];
  
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nume: userData.nume,
          parola: userData.parola,
          email: userData.email,
          tara:userData.tara.value,
        }),
      });

      if (response.status === 200) {
        console.log("Utilizatorul a fost înregistrat cu succes!");
        setError(""); // Resetăm mesajul de eroare în cazul în care înregistrarea a reușit
      } else {
        setError("Eroare la înregistrare."); // Setăm mesajul de eroare în cazul în care înregistrarea a eșuat
      }
    } catch (error) {
      setError("Eroare la înregistrare."); // Setăm mesajul de eroare în cazul în care înregistrarea a eșuat
      console.error(error); // Afișăm detalii despre eroare în consolă (opțional)
    }
  };

  return (
    <div><Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Înregistrează-te
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="nume" className="sr-only">
              Nume:
            </label>
            <input
              id="nume"
              name="nume"
              type="text"
              autoComplete="name"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nume"
              value={userData.nume}
              onChange={handleChange}
            />
          </div>
          <div>
  <label htmlFor="tara" className="sr-only">
    Tara:
  </label>
  <Select
    id="tara"
    name="tara"
    options={countries}
    value={userData.tara}
    onChange={(selectedOption) => setUserData({ ...userData, tara: selectedOption })}
  />
</div>

          <div>
            <label htmlFor="email" className="sr-only">
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="parola" className="sr-only">
              Parola:
            </label>
            <input
              id="parola"
              name="parola"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Parola"
              value={userData.parola}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Înregistrează-te
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-center">
            <p>{error}</p>
          </div>
        )}

        

        <div className="text-center mt-4">
          <p>
            Ai cont deja?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Loghează-te aici
            </Link>
          </p>
        </div>
      </form>
    </div>
  </div>
  </div>
  );
}

export default RegisterPage;
