import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import Layout from "../components/Layout";

function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [edit, setEdit] = useState(false);

  // Fetch bookings (optional)
  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setBookings(data);
    };

    fetchBookings();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleSave = () => {
    localStorage.setItem("name", name);
    setEdit(false);
  };

  if (!user) return <h1 className="text-center mt-10">Loading...</h1>;

  return (
    <div
      className={
        darkMode
          ? "bg-gray-900 text-white min-h-screen flex"
          : "bg-gray-100 text-black min-h-screen flex"
      }
    >
      <Layout>
        {/* Topbar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-3xl font-bold">
            Welcome {user.email}
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

        {/* Profile Card */}
        <div className="flex justify-center">
          <div
            className={
              darkMode
                ? "bg-gray-800 text-white p-8 rounded-xl shadow w-full max-w-lg"
                : "bg-white text-black p-8 rounded-xl shadow w-full max-w-lg"
            }
          >
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                {user.email[0].toUpperCase()}
              </div>

              <h2 className="mt-3 text-lg font-semibold">
                {name || "User"}
              </h2>

              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            {/* Name */}
            <div className="mb-4">
              {edit ? (
                <>
                  <label className="text-gray-500 text-sm">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded mt-1 text-black"
                  />
                </>
              ) : (
                <p>
                  <strong>Name:</strong> {name || "Not set"}
                </p>
              )}
            </div>

            {/* User ID */}
            <p className="mb-6 break-all">
              <strong>User ID:</strong> {user.uid}
            </p>

            {/* Buttons */}
            <div className="flex gap-2">
              {edit ? (
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded flex-1"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setEdit(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded flex-1"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Profile;