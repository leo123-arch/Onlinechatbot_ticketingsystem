// Profile.jsx (updated - removed duplicate logout)
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Layout from "../components/Layout";
import { motion, AnimatePresence } from "framer-motion";

function Profile() {
  const { user } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [editMode, setEditMode] = useState(false);
  const [showBookings, setShowBookings] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Fetch bookings
  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        showToast("Failed to load bookings", "error");
      }
    };

    fetchBookings();
  }, [user]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem("name", name);
      setEditMode(false);
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      showToast("Error updating profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400";
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: "fa-check-circle",
      pending: "fa-clock",
      completed: "fa-check-double",
      cancelled: "fa-times-circle",
    };
    return icons[status] || "fa-question-circle";
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${
              toast.type === "success" 
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" 
                : toast.type === "error" 
                ? "bg-gradient-to-r from-red-500 to-rose-600 text-white"
                : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            }`}
          >
            <i className={`fas ${toast.type === "success" ? "fa-check-circle" : toast.type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}`}></i>
            <span className="font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Main Profile Card */}
              <div className="rounded-2xl overflow-hidden transition-all duration-300 bg-gray-900/90 backdrop-blur-sm border border-gray-800 shadow-2xl">
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600"></div>
                  
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="relative group">
                      <div className="w-28 h-28 rounded-full border-4 border-gray-900 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                        <span className="text-white text-3xl font-bold">
                          {name ? name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gray-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-700">
                        <i className="fas fa-camera text-xs text-gray-300"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-16 pb-6 px-6 text-center">
                  {editMode ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-3 mb-4"
                    >
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-2 focus:border-purple-500 focus:ring-purple-500/20"
                        placeholder="Enter your name"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSave}
                          disabled={isLoading}
                          className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save mr-2"></i>Save</>}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setEditMode(false)}
                          className="px-4 py-2 rounded-xl border-2 border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {name || "User"}
                      </h2>
                      <p className="text-sm text-gray-400 mb-3">
                        {user.email}
                      </p>
                      {user.emailVerified && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                          <i className="fas fa-check-circle text-xs"></i>
                          Verified Account
                        </span>
                      )}
                    </>
                  )}
                  
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditMode(!editMode)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <i className={`fas ${editMode ? "fa-times" : "fa-edit"}`}></i>
                      {editMode ? "Cancel Edit" : "Edit Profile"}
                    </motion.button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 px-6 pb-6">
                  <div className="text-center p-3 rounded-xl bg-gray-800/50">
                    <i className="fas fa-calendar-alt text-purple-400 text-lg mb-1 block"></i>
                    <p className="text-xs text-gray-400">Member since</p>
                    <p className="text-sm font-semibold text-white">
                      {new Date(user.metadata?.creationTime).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gray-800/50">
                    <i className="fas fa-chart-line text-pink-400 text-lg mb-1 block"></i>
                    <p className="text-xs text-gray-400">Total Bookings</p>
                    <p className="text-sm font-semibold text-white">{bookings.length}</p>
                  </div>
                </div>
              </div>

              {/* Account Details Card */}
              <div className="rounded-2xl p-6 bg-gray-900/90 backdrop-blur-sm border border-gray-800 shadow-lg">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
                  <i className="fas fa-shield-alt text-purple-400"></i>
                  Account Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-sm text-gray-400">User ID</span>
                    <span className="text-sm font-mono text-gray-300">{user.uid.slice(0, 12)}...</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-sm text-gray-400">Email</span>
                    <span className="text-sm text-gray-300 break-all text-right ml-4">{user.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-400">Account Status</span>
                    <span className="text-sm text-green-400"><i className="fas fa-circle text-xs mr-1"></i> Active</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Bookings & Preferences */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Tab Navigation */}
              <div className="flex gap-3 border-b border-gray-800 pb-3">
                <button
                  onClick={() => setShowBookings(true)}
                  className={`px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    showBookings 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <i className="fas fa-calendar-check"></i>
                  <span className="hidden sm:inline">My Bookings</span>
                  <span className="sm:hidden">Bookings</span>
                </button>
                <button
                  onClick={() => setShowBookings(false)}
                  className={`px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    !showBookings 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <i className="fas fa-sliders-h"></i>
                  <span className="hidden sm:inline">Preferences</span>
                  <span className="sm:hidden">Settings</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {showBookings ? (
                  <motion.div
                    key="bookings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-white">
                        Recent Bookings
                      </h3>
                      <span className="text-sm text-gray-400">
                        {bookings.length} appointment{bookings.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map((booking, idx) => (
                          <motion.div
                            key={booking.id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                            className="rounded-xl p-5 transition-all duration-300 bg-gray-900/90 hover:bg-gray-800/90 border border-gray-800"
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                  <i className="fas fa-spa text-white text-lg"></i>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg text-white">
                                    {booking.service || "Service"}
                                  </h4>
                                  <div className="flex flex-wrap gap-3 mt-2">
                                    <span className="text-sm flex items-center gap-1 text-gray-400">
                                      <i className="fas fa-calendar-alt text-xs"></i>
                                      {booking.date || "Date TBD"}
                                    </span>
                                    <span className="text-sm flex items-center gap-1 text-gray-400">
                                      <i className="fas fa-clock text-xs"></i>
                                      {booking.time || "Time TBD"}
                                    </span>
                                    {booking.stylist && (
                                      <span className="text-sm flex items-center gap-1 text-gray-400">
                                        <i className="fas fa-user text-xs"></i>
                                        {booking.stylist}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                                  <i className={`fas ${getStatusIcon(booking.status)} text-xs`}></i>
                                  {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || "Pending"}
                                </span>
                                {booking.price && (
                                  <span className="font-bold text-lg text-white">
                                    {booking.price}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 rounded-xl bg-gray-900/50 border border-gray-800">
                        <i className="fas fa-calendar-week text-5xl text-gray-600 mb-4"></i>
                        <p className="text-gray-400">No bookings yet</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="preferences"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl p-6 bg-gray-900/90 backdrop-blur-sm border border-gray-800"
                  >
                    <h3 className="text-xl font-bold mb-6 text-white">
                      Preferences
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Notifications */}
                      <div className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-800/50 transition-all">
                        <div>
                          <p className="font-semibold text-white">
                            <i className="fas fa-bell mr-2 text-purple-400"></i>
                            Push Notifications
                          </p>
                          <p className="text-sm text-gray-400">
                            Receive updates about your bookings
                          </p>
                        </div>
                        <button
                          onClick={() => setNotifications(!notifications)}
                          className={`relative w-12 h-6 rounded-full transition-all duration-300 ${notifications ? "bg-purple-500" : "bg-gray-700"}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${notifications ? "right-1" : "left-1"}`}></div>
                        </button>
                      </div>
                      
                      {/* Language */}
                      <div className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-800/50 transition-all">
                        <div>
                          <p className="font-semibold text-white">
                            <i className="fas fa-language mr-2 text-purple-400"></i>
                            Language
                          </p>
                          <p className="text-sm text-gray-400">
                            Choose your preferred language
                          </p>
                        </div>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="px-3 py-2 rounded-lg border bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                        </select>
                      </div>
                      
                      {/* Email Notifications */}
                      <div className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-800/50 transition-all">
                        <div>
                          <p className="font-semibold text-white">
                            <i className="fas fa-envelope mr-2 text-purple-400"></i>
                            Email Updates
                          </p>
                          <p className="text-sm text-gray-400">
                            Receive booking confirmations and reminders
                          </p>
                        </div>
                        <button className="relative w-12 h-6 rounded-full bg-purple-500 transition-all duration-300">
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white"></div>
                        </button>
                      </div>
                      
                      {/* Data Export */}
                      <div className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-800/50 transition-all">
                        <div>
                          <p className="font-semibold text-white">
                            <i className="fas fa-download mr-2 text-purple-400"></i>
                            Export Data
                          </p>
                          <p className="text-sm text-gray-400">
                            Download your personal data
                          </p>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:shadow-lg transition-all">
                          Export
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Profile;