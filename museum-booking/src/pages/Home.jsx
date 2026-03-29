// Home.jsx
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiMenu, FiX, FiCalendar, FiUsers, FiAward, FiStar } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp, FaLinkedinIn } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";

function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const images = [
    "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1600&q=80",
    "https://media.timeout.com/images/106197993/750/422/image.jpg",
    "https://www.virtosuart.com/images/2020/01/CAG/ca640.jpg"
  ];

  const exhibitions = [
    {
      title: "Ancient Egypt",
      description: "Journey through the land of pharaohs and pyramids. Discover artifacts from 3000 BC.",
      icon: "🏺",
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Modern Art",
      description: "Contemporary masterpieces from the world's most innovative artists.",
      icon: "🎨",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Renaissance Masters",
      description: "Experience the brilliance of Da Vinci, Michelangelo, and Raphael.",
      icon: "🖼️",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const stats = [
    { value: "50+", label: "Exhibitions", icon: FiCalendar, color: "purple" },
    { value: "100K+", label: "Visitors", icon: FiUsers, color: "pink" },
    { value: "15+", label: "Countries", icon: FiAward, color: "blue" },
    { value: "4.8★", label: "Rating", icon: FiStar, color: "yellow" }
  ];

  const upcomingEvents = [
    { title: "Art Workshop", date: "April 15, 2025", time: "2:00 PM", spots: "25 spots left" },
    { title: "Guided Tour", date: "April 20, 2025", time: "11:00 AM", spots: "15 spots left" },
    { title: "Lecture Series", date: "April 25, 2025", time: "4:00 PM", spots: "40 spots left" }
  ];

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleViewShows = () => {
    user ? navigate("/dashboard") : navigate("/login");
  };

  return (
    <div className="bg-black text-white">
      {/* Toast Notification - Removed as requested */}

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-black/90 backdrop-blur-xl border-b border-gray-800 py-3" 
          : "bg-transparent py-6"
      }`}>
        <div className="flex justify-between items-center px-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-sm">🏛️</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent cursor-pointer">
              MuseumBook
            </h1>
          </div>

          <div className="hidden md:flex gap-8">
            <a href="#featured" className="hover:text-purple-400 transition-colors">Exhibitions</a>
            <a href="#events" className="hover:text-purple-400 transition-colors">Events</a>
            <a href="#newsletter" className="hover:text-purple-400 transition-colors">Newsletter</a>
          </div>

          <div className="hidden md:flex gap-4">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 rounded-xl text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all"
                >
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-lg transition-all"
              >
                Dashboard
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 rounded-xl bg-gray-900/90 border border-gray-800 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 p-6"
            >
              <a href="#featured" className="block py-3 text-gray-300 hover:text-white transition-colors">Exhibitions</a>
              <a href="#events" className="block py-3 text-gray-300 hover:text-white transition-colors">Events</a>
              <a href="#newsletter" className="block py-3 text-gray-300 hover:text-white transition-colors">Newsletter</a>
              <div className="pt-4 mt-4 border-t border-gray-800 flex gap-3">
                {!user ? (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className="flex-1 px-4 py-2 rounded-xl bg-gray-800 text-white"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  >
                    Dashboard
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Slider */}
      <section className="h-screen relative flex items-center justify-center text-center text-white overflow-hidden">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={img}
              alt="slide"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          </div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-400 text-sm">
              Welcome to MuseumBook
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Discover Timeless Art & Culture
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore world-class exhibitions, attend exclusive events, and immerse yourself in the beauty of art and history.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewShows}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all"
          >
            Explore Now
          </motion.button>
        </motion.div>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide 
                  ? "w-8 bg-purple-500" 
                  : "bg-gray-500 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Exhibitions */}
      <section id="featured" className="py-20 px-8 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Featured Exhibitions
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Immerse yourself in extraordinary collections that span centuries of human creativity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {exhibitions.map((exhibition, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${exhibition.color}`}></div>
                <div className="p-8">
                  <div className="text-5xl mb-4">{exhibition.icon}</div>
                  <h4 className="text-2xl font-bold mb-3 text-white">{exhibition.title}</h4>
                  <p className="text-gray-400 mb-6">{exhibition.description}</p>
                  <button
                    onClick={handleViewShows}
                    className="text-purple-400 font-semibold group-hover:text-purple-300 transition-colors inline-flex items-center gap-2"
                  >
                    Book Now
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              const colorMap = {
                purple: "from-purple-500 to-pink-500",
                pink: "from-pink-500 to-rose-500",
                blue: "from-blue-500 to-cyan-500",
                yellow: "from-yellow-500 to-orange-500"
              };
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="text-center p-6 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-purple-500/30 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorMap[stat.color]} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="text-white text-xl" />
                  </div>
                  <h4 className="text-3xl font-bold text-white mb-2">{stat.value}</h4>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="py-20 px-8 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Upcoming Events
            </h3>
            <p className="text-gray-400">Don't miss out on these exciting opportunities</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <FiCalendar className="text-purple-400 text-xl" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-2">{event.title}</h4>
                    <p className="text-sm text-gray-400 mb-1">{event.date} • {event.time}</p>
                    <p className="text-xs text-purple-400">{event.spots}</p>
                  </div>
                </div>
                <button
                  onClick={handleViewShows}
                  className="mt-4 w-full py-2 rounded-lg bg-gray-800 text-white text-sm font-medium hover:bg-purple-500/20 transition-colors"
                >
                  Register Interest
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="py-20 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-gray-300 mb-8">
              Get the latest updates on exhibitions, events, and exclusive offers
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl bg-gray-900/90 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white text-sm">🏛️</span>
                </div>
                <p className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  MuseumBook
                </p>
              </div>
              <p className="text-sm text-gray-500">© 2024 MuseumBook. All rights reserved.</p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 transition-all">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 transition-all">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 transition-all">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-500 transition-all">
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;