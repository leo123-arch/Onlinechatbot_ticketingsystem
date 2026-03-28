import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  // ✅ Prevent crash if user not loaded
  if (!user) {
    return <h1 className="text-center mt-10">Loading...</h1>;
  }

  // 🔥 Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setBookings(data);
    };

    fetchBookings();
  }, [user]);

  // ❌ Cancel booking
  const handleCancel = async (id) => {
    await updateDoc(doc(db, "bookings", id), {
      status: "cancelled"
    });

    setBookings(prev =>
      prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b)
    );
  };

  // 💳 Fake Payment
  const handlePayment = async (id) => {
    setLoadingId(id);

    setTimeout(async () => {
      await updateDoc(doc(db, "bookings", id), {
        status: "paid"
      });

      setBookings(prev =>
        prev.map(b => b.id === id ? { ...b, status: "paid" } : b)
      );

      setLoadingId(null);
      alert("✅ Payment Successful!");
    }, 1500);
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // ✅ Safe Chart Data (no crash)
  const chartData = {
    labels: bookings.length
      ? bookings.map((_, i) => `Booking ${i + 1}`)
      : ["No Data"],
    datasets: [
      {
        label: "Bookings",
        data: bookings.length
          ? bookings.map((_, i) => i + 1)
          : [0],
        borderWidth: 2
      }
    ]
  };

  return (
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen flex" : "bg-gray-100 min-h-screen flex"}>

      {/* Sidebar */}
      {/* Sidebar */}
<div className="w-64 bg-gray-800 text-white p-5 hidden md:block">
  <h2 className="text-2xl font-bold mb-6">Museum</h2>

  <ul className="space-y-4">

    <li>
      <button
        onClick={() => navigate("/dashboard")}
        className="w-full text-left px-3 py-2 rounded hover:bg-gray-700"
      >
        🏠 Dashboard
      </button>
    </li>

    <li>
      <button
        onClick={() => navigate("/bookings")}
        className="w-full text-left px-3 py-2 rounded hover:bg-gray-700"
      >
        📋 Bookings
      </button>
    </li>

    <li>
      <button
        onClick={() => navigate("/profile")}
        className="w-full text-left px-3 py-2 rounded hover:bg-gray-700"
      >
        👤 Profile
      </button>
    </li>

  </ul>
</div>

      {/* Main */}
      <div className="flex-1 p-6">

        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-3xl font-bold">
            Welcome {user?.email}
          </h1>

          <div className="space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              🌙
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            className={darkMode ? "bg-gray-700 p-4 rounded shadow" : "bg-white p-4 rounded shadow"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2>Total</h2>
            <p className="text-2xl">{bookings.length}</p>
          </motion.div>

          <motion.div
            className={darkMode ? "bg-gray-700 p-4 rounded shadow" : "bg-white p-4 rounded shadow"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2>Paid</h2>
            <p>{bookings.filter(b => b.status === "paid").length}</p>
          </motion.div>

          <motion.div
            className={darkMode ? "bg-gray-700 p-4 rounded shadow" : "bg-white p-4 rounded shadow"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2>Cancelled</h2>
            <p>{bookings.filter(b => b.status === "cancelled").length}</p>
          </motion.div>
        </div>

        {/* Chart */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <Line data={chartData} />
        </div>

        {/* Table */}
        <div className="bg-white p-4 rounded shadow overflow-x-auto">

          {bookings.length === 0 ? (
            <p className="text-center">No bookings found</p>
          ) : (

          <table className="w-full text-center">
            <thead>
              <tr className="border-b">
                <th>Museum</th>
                <th>Date</th>
                <th>Status</th>
                <th>QR</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="border-b">
                  <td>{b.museumName || "N/A"}</td>
                  <td>{b.date || "N/A"}</td>
                  <td>{b.status || "pending"}</td>

                  {/* QR */}
                  <td>
<QRCodeCanvas value={b.id} size={50} />                  </td>

                  {/* Payment */}
                  <td>
                    {b.status !== "paid" && b.status !== "cancelled" && (
                      <button
                        onClick={() => handlePayment(b.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        {loadingId === b.id ? "Processing..." : "Pay"}
                      </button>
                    )}
                  </td>

                  {/* Cancel */}
                  <td>
                    {b.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;