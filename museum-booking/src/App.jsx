import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Shows from "./pages/Shows";
import Booking from "./pages/Booking";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ HOME FIRST */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shows"
          element={
            <ProtectedRoute>
              <Shows />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
      <Route path="/profile" element={<Profile />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;