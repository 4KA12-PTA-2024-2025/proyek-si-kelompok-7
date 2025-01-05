import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";

function CategoryMenu() {
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get("/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchCartCount = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const response = await axiosClient.get("/cart");
        const totalCount = response.data.data.reduce(
          (total, item) => total + item.jumlah,
          0
        );
        setCartCount(totalCount);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCategories();
    fetchCartCount();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar cartCount={cartCount} />

      {/* Hero Section with Animation */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-orange-800 mb-6 animate-slideDown">
            Menu Pilihan Warung Nasi Marsel
          </h1>
          <p className="text-xl text-gray-700 mb-8 animate-fadeIn">
            Nikmati Berbagai Pilihan Menu Istimewa Untuk Setiap Momen Spesial
            Anda
          </p>
        </div>
      </div>

      {/* Categories Section with Animation */}
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 animate-bounce">
            Pilihan Kategori Menu
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fadeIn">
            Temukan berbagai pilihan menu lezat untuk acara spesial Anda. Dari
            paket prasmanan hingga nasi kotak, kami siap melayani dengan cita
            rasa yang autentik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2 animate-fadeInUp"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative h-48 overflow-hidden group">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${
                    category.image_url
                  }`}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-image.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 animate-pulse">
                  {category.name}
                </h3>
                <button className="mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 w-full transform hover:scale-105 font-semibold">
                  Lihat Menu
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
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

        .animate-slideDown {
          animation: slideDown 1s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
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
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>

      <Footer />
    </div>
  );
}

export default CategoryMenu;
