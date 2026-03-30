import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={
      darkMode
        ? "flex min-h-screen w-full bg-gray-900 text-white"
        : "flex min-h-screen w-full bg-gray-100 text-black"
    }>

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-5 hidden md:block">
        <h2 className="text-2xl font-bold mb-6">Museum</h2>

        <ul className="space-y-4">

          <li>
            <button
              onClick={() => navigate("/dashboard")}
              className={`w-full text-left px-3 py-2 rounded 
              ${location.pathname === "/dashboard" ? "bg-gray-700" : "hover:bg-gray-700"}`}
            >
              🏠 Dashboard
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/Booking")}
              className={`w-full text-left px-3 py-2 rounded 
              ${location.pathname === "/Booking" ? "bg-gray-700" : "hover:bg-gray-700"}`}
            >
              📋 Bookings
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/profile")}
              className={`w-full text-left px-3 py-2 rounded 
              ${location.pathname === "/profile" ? "bg-gray-700" : "hover:bg-gray-700"}`}
            >
              👤 Profile
            </button>
          </li>

        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">

        {/* 🌙 Topbar (GLOBAL) */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            🌙
          </button>
        </div>

        {children}
      </div>

    </div>
  );
}

export default Layout;