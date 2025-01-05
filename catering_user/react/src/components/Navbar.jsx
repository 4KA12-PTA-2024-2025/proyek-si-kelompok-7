import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Logo from "../assets/logo.png";
import PropTypes from "prop-types";

function Navbar({ cartCount = 0 }) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user information
  const fetchUser = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      // console.log("No token found, user not logged in.");
      return;
    }

    try {
      const response = await axiosClient.post("/auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // Handle specific error if token is expired
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("access_token"); // Token expired or invalid
        setUser(null); // Clear user info
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout");
      localStorage.removeItem("access_token");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    fetchUser();

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-sky-200 font-sans w-full m-0">
      <div className="bg-sky-400 shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div>
              <Link to="/">
                <img src={Logo} alt="Catering Logo" className="h-20" />
              </Link>
            </div>
            <div className="hidden sm:flex sm:items-center">
              <Link
                to="/categories"
                className="text-gray-800 text-xl font-semibold hover:text-orange-700 mr-4"
              >
                Categories
              </Link>
              <Link
                to="/foods"
                className="text-gray-800 text-xl font-semibold hover:text-orange-700 mr-4"
              >
                Foods
              </Link>
              <Link
                to="/about"
                className="text-gray-800 text-xl font-semibold hover:text-orange-700 mr-4"
              >
                About
              </Link>
            </div>
            <div className="relative hidden sm:flex sm:items-center">
              {user ? (
                <div className="relative flex items-center" ref={dropdownRef}>
                  <Link
                    to="/cart"
                    className="text-gray-800 hover:text-orange-700 mr-4 flex items-center relative"
                  >
                    {/* Increase the cart icon size */}
                    <ShoppingCartIcon className="h-8 w-8 text-gray-800 hover:text-orange-700" />
                    {/* Reduce the size of the cart count */}
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xxs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center text-gray-800 text-sm font-semibold hover:text-purple-600"
                    aria-expanded={isDropdownOpen}
                  >
                    <span className="mr-2">{user.name}</span>
                  </button>
                  {isDropdownOpen && (
                    <div
                      className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-48 z-50"
                      style={{ minWidth: "12rem" }}
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-800 text-sm font-semibold hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-800 text-sm font-semibold hover:bg-gray-100"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-800 text-xl font-semibold hover:text-orange-700 mr-4"
                >
                  Sign in
                </Link>
              )}
            </div>
            {/* Hamburger Menu for Mobile */}
            <div
              className="sm:hidden cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white shadow-md">
          <div className="flex flex-col px-4 py-2">
            <Link
              to="/categories"
              className="text-gray-800 text-sm font-semibold hover:text-orange-700 py-2"
            >
              Categories
            </Link>
            <Link
              to="/foods"
              className="text-gray-800 text-sm font-semibold hover:text-purple-600 py-2"
            >
              Foods
            </Link>
            <Link
              to="/about"
              className="text-gray-800 text-sm font-semibold hover:text-purple-600 py-2"
            >
              About
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-800 text-sm font-semibold hover:text-purple-600 py-2"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-800 text-sm font-semibold hover:text-purple-600 py-2"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-800 text-sm font-semibold hover:text-purple-600 py-2"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

Navbar.propTypes = {
  cartCount: PropTypes.number, // Prop type validation for cartCount
};

export default Navbar;
