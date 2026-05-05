import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaStar, FaBox, FaInfoCircle, FaPhone, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

const NAV_LINKS = [
  { path: '/modules', icon: FaBox, label: 'Modules' },
  { path: '/about', icon: FaInfoCircle, label: 'About' },
  { path: '/contact', icon: FaPhone, label: 'Contact' },
];

const NavLink = ({ path, icon: Icon, label }) => (
  <li>
    <Link to={path} className="flex items-center gap-2 hover:text-orange-400 transition">
      <Icon /> {label}
    </Link>
  </li>
);

const UserMenu = ({ user, onLogout, showDropdown, setShowDropdown }) => (
  <li className="relative">
    <button
      onClick={() => setShowDropdown(!showDropdown)}
      className="flex items-center gap-2 hover:text-orange-400 transition"
    >
      <FaUser /> {user.firstName}
      <span className="text-xs">▼</span>
    </button>

    {showDropdown && (
      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 z-10">
        {user.role === 'admin' && (
          <Link
            to="/admin"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 hover:text-orange-400 transition"
            onClick={() => setShowDropdown(false)}
          >
            <FaUser /> Admin Panel
          </Link>
        )}
        <Link
          to="/profile"
          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 hover:text-orange-400 transition"
          onClick={() => setShowDropdown(false)}
        >
          <FaUser /> My Profile
        </Link>
        <button
          onClick={onLogout}
          className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-700 hover:text-orange-400 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    )}
  </li>
);

const AuthButtons = () => (
  <>
    <li>
      <Link to="/login" className="flex items-center gap-2 hover:text-orange-400 transition">
        <FaSignInAlt /> Login
      </Link>
    </li>
    <li>
      <Link
        to="/signup"
        className="flex items-center gap-2 bg-orange-500 px-3 py-1 rounded hover:bg-orange-600 transition"
      >
        <FaUser /> Sign Up
      </Link>
    </li>
  </>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between" data-aos="fade-up">
        <Link to="/" className="text-xl font-bold tracking-wide text-white hover:text-orange-400 transition">
          OKB
        </Link>

        <ul className="flex space-x-6 text-sm font-medium items-center">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.path} {...link} />
          ))}

          {user ? (
            <UserMenu
              user={user}
              onLogout={handleLogout}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />
          ) : (
            <AuthButtons />
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
