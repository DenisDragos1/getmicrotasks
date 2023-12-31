import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Select from "react-select";
import Footer from "../components/Footer";
function RegisterPage() {
  const [userData, setUserData] = useState({
    nume: "",
    email: "",
    parola: "",
    tara: "",
    invitationCode:"",

  });
  const [error, setError] = useState("");
  const countries = [
    { value: "ro", label: "România" },
    { value: "us", label: "Statele Unite" },
    { value: "fr", label: "Franța" },
    // Adăugați mai multe țări aici
  ];
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleCloseModal = () => {
    setSuccessModalOpen(false);
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.parola !== userData.confirmParola) {
      setError("Parolele nu coincid.");
      return;
    }
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
          tara: userData.tara.value,
          invitationCode: userData.invitationCode,
        }),
      });

      if (response.status === 200) {
        console.log("Utilizatorul a fost înregistrat cu succes!");
        navigate("/login");
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
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Înregistrează-te
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="nume" className="block text-sm font-medium text-gray-700">
                  Nume:
                </label>
                <input
                  id="nume"
                  name="nume"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Nume"
                  value={userData.nume}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="tara" className="block text-sm font-medium text-gray-700">
                  Tara:
                </label>
                <Select
                  id="tara"
                  name="tara"
                  options={countries}
                  value={userData.tara}
                  onChange={(selectedOption) =>
                    setUserData({ ...userData, tara: selectedOption })
                  }
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Email"
                  value={userData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="parola" className="block text-sm font-medium text-gray-700">
                  Parola:
                </label>
                <input
                  id="parola"
                  name="parola"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Parola"
                  value={userData.parola}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirmParola" className="block text-sm font-medium text-gray-700">
                Confirmă Parola:
              </label>
              <input
                id="confirmParola"
                name="confirmParola"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirmă Parola"
                value={userData.confirmParola}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="invitationCode" className="block text-sm font-medium text-gray-700">
                Cod de invitație (opțional):
              </label>
              <input
                id="invitationCode"
                name="invitationCode"
                type="text"
                autoComplete="off"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Cod de invitație"
                value={userData.invitationCode}
                onChange={handleChange}
              />
            </div>


            <div>
              <button
                type="submit"
                className="mt-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
      {/* {successModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur backdrop-opacity-80">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold mb-4">Utilizator înregistrat cu succes!</p>
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              OK
            </button>
          </div>
        </div>
      )} */}
      {successModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur backdrop-opacity-80">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold mb-4">
              Utilizator înregistrat cu succes! Accesează linkul din email pentru a-ți activa contul.
            </p>
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              OK
            </button>
          </div>
        </div>
      )}
      <Footer />

    </div>
  );
}

export default RegisterPage;
