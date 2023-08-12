import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
function LoginPage() {
    const [values, setValues] = useState({
        email: "",
        parola: "",
      });
      const navigate = useNavigate();
      const [error, setError] = useState("");
    
      const handleChange = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
      };
    
      const handleSubmit = (event) => {
        event.preventDefault();
        axios
          .post("http://localhost:8081/login", values, { withCredentials: true })
          .then((res) => {
            console.log(res.data);
            if (res.status === 200) {
              console.log("Autentificare reușită!");
              navigate("/");
            }
          })
          .catch((err) => {
            console.log(err);
            setError("Email sau parolă incorecte!");
          });
      };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Autentificare
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={values.email}
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
                value={values.parola}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Autentificare
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-center">
              <p>{error}</p>
            </div>
          )}

          <div className="text-center mt-4">
            <p>
              Nu ai cont?{' '}
              <Link to="/register" className="text-indigo-600 hover:underline">
                Înregistrează-te aici
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
