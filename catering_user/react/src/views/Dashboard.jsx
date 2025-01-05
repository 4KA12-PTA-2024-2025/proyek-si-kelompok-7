import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [cartCount, setCartCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setCartCount(0);
        return;
      }
      try {
        const response = await axiosClient.get("/cart");
        const totalJumlah = response.data.data.reduce(
          (total, item) => total + item.jumlah,
          0
        );
        setCartCount(totalJumlah);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("access_token");
        }
        setCartCount(0);
      }
    };

    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get("/suggestions");
        setSuggestions(response.data.data);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setError("Gagal memuat saran. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartCount();
    fetchSuggestions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartCount={cartCount} />
      <div
        className="hero-section bg-cover bg-center h-96 flex items-center justify-center text-white relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/1600x900/?restaurant,food')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4 animate-fadeIn">
            Selamat Datang di
          </h1>
          <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 animate-slideIn">
            Warung Nasi Marsel!
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fadeInUp">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-bounce">
            Rasakan Cita Rasa Terbaik
          </h2>
          <p className="text-xl text-gray-600 animate-pulse">
            Pilihan masakan rumahan yang lezat dan penuh kenangan.
          </p>
        </div>

        <div className="text-center animate-fadeInUp">
          <button
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full text-xl font-bold hover:from-orange-600 hover:to-red-700 transition-all shadow-lg transform hover:scale-105 hover:-translate-y-1 animate-bounce"
            onClick={() => navigate("/foods")}
          >
            🍛 Pesan Sekarang!
          </button>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center animate-fadeInUp">
            Saran dari Pelanggan
          </h2>

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center animate-fadeIn">
              {error}
            </div>
          )}

          {!loading && !error && suggestions.length === 0 && (
            <p className="text-gray-600 text-center animate-fadeIn">
              Belum ada saran dari pelanggan.
            </p>
          )}

          {!loading && !error && suggestions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className="bg-white rounded-xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 animate-fadeInUp"
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-lg text-gray-800 font-semibold">
                      {suggestion.user?.name || "Anonymous"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(suggestion.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {suggestion.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 1s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
          animation-fill-mode: both;
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>

      <Footer />
    </div>
  );
}
