import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../../assets/logo.png';
import { FiRefreshCw } from "react-icons/fi"; // ✅ React icon

const Header = () => {
  const location = useLocation();
  const isHistory = location.pathname.includes("/history");

  // ✅ Simple reload function
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <nav className="bg-[#2A3547] shadow-md z-[999] fixed top-0 w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Left side - Logo/Brand */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <img src={logo} alt="logo-image" className="w-8 h-8" />
            <span className="text-white font-bold text-2xl">Invoice App</span>
          </div>

          {/* Right side - History Link + Reload */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to={isHistory ? "/" : "/history"}
              className="text-gray-300 hover:bg-[#8AB93A] hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {isHistory ? "Back to Invoice" : "History"}
            </Link>

            {/* ✅ Reload Icon */}
            <button
              onClick={handleReload}
              className="text-gray-300 hover:text-white"
              title="Reload"
            >
              <FiRefreshCw size={20} />
            </button>
          </div>

          {/* Mobile menu button would go here */}
        </div>
      </div>
    </nav>
  );
};

export default Header;


