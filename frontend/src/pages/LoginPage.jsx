import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
  const authenticated = true;

  return (
    <div>
            <Navbar authenticated={authenticated} />
    <section className="h-screen">
      <div className="h-full">
        {/* Left column container with background */}
        <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
          <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="w-full"
              alt="Sample image"
            />
          </div>

          {/* Right column container */}
          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
            <form className="px-6 pt-8 pb-4" onSubmit={handleSubmit}>
              {/* Email input */}
              <div className="mb-6" data-te-input-wrapper-init>
                <input
                  type="text"
                  className="peer block w-full border-b-2 border-neutral-300 bg-transparent px-3 py-[0.5rem] leading-[2.15] outline-none focus:border-primary dark:border-neutral-600 dark:bg-transparent dark:text-neutral-200 dark:placeholder-text-neutral-200 dark:focus:border-primary"
                  id="email"
                  name="email"
                  placeholder="Email address"
                  value={values.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password input */}
              <div className="mb-6" data-te-input-wrapper-init>
                <input
                  type="password"
                  className="peer block w-full border-b-2 border-neutral-300 bg-transparent px-3 py-[0.5rem] leading-[2.15] outline-none focus:border-primary dark:border-neutral-600 dark:bg-transparent dark:text-neutral-200 dark:placeholder-text-neutral-200 dark:focus:border-primary"
                  id="parola"
                  name="parola"
                  placeholder="Password"
                  value={values.parola}
                  onChange={handleChange}
                />
              </div>

              {/* Remember me checkbox */}
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  className="peer h-[1.125rem] w-[1.125rem] border-2 border-neutral-300 dark:border-neutral-600 rounded focus:border-primary dark:focus:border-primary transition focus:ring-0 focus:ring-offset-0"
                  id="rememberMe"
                />
                <label
                  htmlFor="rememberMe"
                  className="pl-2 text-sm font-medium text-neutral-500 dark:text-neutral-200"
                >
                  Remember me
                </label>
              </div>

              {/* Login button */}
              <div className="mb-6">
                <button
                  type="submit"
                  className="mt-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                  Login
                </button>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-4 text-red-500 text-center">
                  <p>{error}</p>
                </div>
              )}

              {/* Register link */}
              <div className="text-center">
                <p className="text-sm font-semibold">
                  Nu ai cont? {" "}
                  <Link to="/register" className="text-blue-500 transition duration-150 ease-in-out hover:text-blue-600 focus:text-blue-600 active:text-blue-700">
                    Înregistrează-te aici!
                  </Link>

                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
    </div>
  );
}

export default LoginPage;
