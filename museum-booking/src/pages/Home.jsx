import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const images = [
    "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1549893075-7a9a4c6f8a9f?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1504198266285-165a6c7b3c3c?auto=format&fit=crop&w=1600&q=80"
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
    user ? navigate("/shows") : navigate("/login");
  };

  return (
    <div className="bg-white text-gray-900">

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "glass-nav shadow-md py-3" : "py-6"
      }`}>
        <div className="flex justify-between items-center px-8">
          <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
            MuseumBook
          </h1>

          <div className="hidden md:flex gap-6">
            <a href="#featured">Exhibitions</a>
            <a href="#events">Events</a>
            <a href="#newsletter">Newsletter</a>
          </div>

          <div className="hidden md:flex gap-4">
            {!user ? (
              <>
                <button onClick={() => navigate("/login")}>Login</button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2 bg-green-500 text-white rounded-lg"
              >
                Dashboard
              </button>
            )}
          </div>

          {/* Mobile */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white shadow-lg p-6 animate-fadeSlide">
            <a href="#featured" className="block py-2">Exhibitions</a>
            <a href="#events" className="block py-2">Events</a>
            <a href="#newsletter" className="block py-2">Newsletter</a>
          </div>
        )}
      </nav>

      {/* Hero Slider */}
      <section className="h-screen relative flex items-center justify-center text-center text-white">
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
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ))}

        <div className="relative z-10 animate-fadeSlide">
          <h2 className="text-5xl font-bold mb-6">
            Discover Timeless Art & Culture
          </h2>
          <button
            onClick={handleViewShows}
            className="px-8 py-4 bg-blue-600 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            View Shows
          </button>
        </div>
      </section>

      {/* Featured Exhibitions */}
      <section id="featured" className="py-20 px-8 bg-gray-50">
        <h3 className="text-4xl font-bold text-center mb-12">
          Featured Exhibitions
        </h3>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {["Ancient Egypt", "Modern Art", "Renaissance Masters"].map(
            (item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl card-hover"
              >
                <h4 className="text-xl font-bold mb-4">{item}</h4>
                <p className="mb-4 text-gray-600">
                  Explore this exclusive exhibition.
                </p>
                <button
                  onClick={handleViewShows}
                  className="text-blue-600 font-semibold"
                >
                  Book Now →
                </button>
              </div>
            )
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-8 text-center">
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {["50+", "100K+", "15+", "4.8★"].map((stat, i) => (
            <div key={i} className="p-6 bg-white rounded-xl shadow-md card-hover">
              <h4 className="text-3xl font-bold text-blue-600">{stat}</h4>
              <p>Achievement</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="py-20 px-8 bg-blue-600 text-white text-center">
        <h3 className="text-3xl font-bold mb-6">Subscribe to Newsletter</h3>
        <div className="flex flex-col md:flex-row justify-center gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg text-black flex-1"
          />
          <button className="px-6 py-3 bg-black rounded-lg">
            Subscribe
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-8">
        <div className="flex justify-between items-center max-w-6xl mx-auto flex-col md:flex-row gap-6">
          <p>© 2024 MuseumBook. All rights reserved.</p>
          <div className="flex gap-4 text-xl">
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;