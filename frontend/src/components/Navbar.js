import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CiLogin, CiLogout } from "react-icons/ci";
import { AuthContext } from "../store/AuthContext";
import { useCookies } from "react-cookie";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [cookies] = useCookies();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Project Spe 4
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 items-center text-gray-700 font-medium">
          <li>
            <Link to="/" className="hover:text-blue-600 transition">Accueil</Link>
          </li>
          {currentUser && cookies.doubleAuth && (
            <>
              <li>
                <Link to="/documents" className="hover:text-blue-600 transition">Documents</Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-blue-600 transition">Espace personnel</Link>
              </li>
            </>
          )}
          {currentUser && cookies.doubleAuth && currentUser.role === "admin" && (
            <li>
              <Link to="/admin" className="hover:text-blue-600 transition">Admin</Link>
            </li>
          )}
          <li>
            {currentUser ? (
              <a href="http://localhost:8000/logout" title="Déconnexion">
                <CiLogout className="text-[28px] text-red-500 hover:text-red-700 transition" />
              </a>
            ) : (
              <Link to="/login" title="Connexion">
                <CiLogin className="text-[28px] text-blue-500 hover:text-blue-700 transition" />
              </Link>
            )}
          </li>
        </ul>

        {/* Mobile toggle */}
        <button onClick={toggleMenu} className="md:hidden text-gray-700 text-2xl">
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 bg-white shadow-md">
          <ul className="flex flex-col gap-4 font-medium text-gray-700">
            <li>
              <Link to="/" className="hover:text-blue-600" onClick={toggleMenu}>Accueil</Link>
            </li>
            {currentUser && cookies.doubleAuth && (
              <>
                <li>
                  <Link to="/documents" className="hover:text-blue-600" onClick={toggleMenu}>Documents</Link>
                </li>
                <li>
                  <Link to="/account" className="hover:text-blue-600" onClick={toggleMenu}>Espace personnel</Link>
                </li>
              </>
            )}
            {currentUser && cookies.doubleAuth && currentUser.role === "admin" && (
              <li>
                <Link to="/admin" className="hover:text-blue-600" onClick={toggleMenu}>Admin</Link>
              </li>
            )}
            <li>
              {currentUser ? (
                <a href="http://localhost:8000/logout" className="text-red-500" onClick={toggleMenu}>
                  Déconnexion
                </a>
              ) : (
                <Link to="/login" className="text-blue-500" onClick={toggleMenu}>
                  Connexion
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
