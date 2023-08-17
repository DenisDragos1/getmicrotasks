import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

const Navbar = ({ authenticated }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (authenticated) {
      fetch("http://localhost:8081/getUsername", {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          setUserName(data.userName);
        })
        .catch((error) => {
          console.error("Eroare la obținerea numelui utilizatorului:", error);
        });
    }
  }, [authenticated]);

  const handleLogout = () => {
    axios
      .post("http://localhost:8081/logout", null, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        // Reîncarcă pagina pentru a actualiza starea autentificării
        window.location.reload();
      })
      .catch((error) => {
        console.error("Eroare la deconectare:", error);
      });
  };

  return (
    <>
      {/* Navbar-ul de sus */}
      <nav className="bg-white border-b border-gray-200 dark:bg-gray-900">
        <div className="flex justify-between items-center mx-auto max-w-screen-xl p-4">
          <Link to="/" className="flex items-center">
            {/* <img
              src="https://flowbite.com/docs/images/logo.svg"
             className="h-8 mr-3"
              alt="Flowbite Logo"
            /> */}
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              GetMicroTasks
            </span>
          </Link>
          <div className="flex items-center">
            {authenticated && userName ? (
              <div className="mr-6 text-sm text-gray-500 dark:text-white">
                <span>
                  <Link to="/profile">{userName}</Link>{" "}
                </span>
                <button
                  className="ml-2 text-blue-600 dark:text-blue-500 hover:underline"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm text-blue-600 dark:text-blue-500 hover:underline"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Navbar-ul de jos */}
      <nav className="bg-gray-50 dark:bg-gray-700">
        <div className="max-w-screen-xl px-4 py-3 mx-auto">
          <div className="flex items-center">
            <ul className="flex flex-row font-medium mt-0 mr-6 space-x-8 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-900 dark:text-white hover:underline"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/createmicrotasks"
                  className="text-gray-900 dark:text-white hover:underline"
                >
                  Adauaga MicroTask
                </Link>
              </li>
              <li>
                <Link
                  to="/microtasks"
                  className="text-gray-900 dark:text-white hover:underline"
                >
                  Microtasks
                </Link>
              </li>
              <li>
                <Link
                  to="/mymicrotasks"
                  className="text-gray-900 dark:text-white hover:underline"
                >
                  MyMicrotasks
                </Link>
              </li>
              <li>
                <Link
                  to="/mysubmissions"
                  className="text-gray-900 dark:text-white hover:underline"
                >
                  MySubmissions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

export default Navbar;
