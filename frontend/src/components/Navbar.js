import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CiLogin, CiLogout } from "react-icons/ci";
import { AuthContext } from "../store/AuthContext";

const Navbar = () => {
  // Récuperation du context
  const { currentUser } = useContext(AuthContext);

  return (
    <nav className="bg-white border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Link
            to={"/"}
            className="self-center text-2xl font-semibold whitespace-nowrap"
          >
            Dev Auth
          </Link>
        </div>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white md:items-center">
            <li>
              <Link
                to={"/"}
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:text-gray-900"
                aria-current="page"
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                to={"/blog"}
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:text-gray-900"
                aria-current="page"
              >
                Blog
              </Link>
            </li>
            {/* si le user est connecté on affiche  */}
            {currentUser && (
              <>
                <li>
                  <Link
                    to={"/blogPrivate"}
                    className="block py-2 px-3 text-white rounded md:bg-transparent  md:p-0  md:text-gray-900"
                    aria-current="page"
                  >
                    Blogs privés
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/account"}
                    className="block py-2 px-3 text-white rounded md:bg-transparent  md:p-0  md:text-gray-900"
                    aria-current="page"
                  >
                    Espace personnel
                  </Link>
                </li>
              </>
            )}

            {/* si le user n'est pas connecté on affiche  */}
            {currentUser ? (
              <a href="http://localhost:8000/logout">
                <CiLogout className="text-[30px] cursor-pointer" />
              </a>
            ) : (
              <Link
                to="/login"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
              >
                <CiLogin className="text-[30px]" />
              </Link>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
