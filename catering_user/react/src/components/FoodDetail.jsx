import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";

function FoodDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axiosClient.get(`/foods/${id}`);
        setFood(response.data.data);
      } catch (error) {
        console.error("Failed to fetch food details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCartCount = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        return;
      }

      try {
        const response = await axiosClient.get("/cart");
        const totalCount = response.data.data.reduce(
          (total, item) => total + item.jumlah,
          0
        );
        setCartCount(totalCount);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
        if (error.response && error.response.status === 401) {
          console.log("Token may be expired or invalid.");
        }
      }
    };

    fetchFood();
    fetchCartCount();
  }, [id]);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (!food) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Detail makanan tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar cartCount={cartCount} />
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden mt-16 mb-14">
        <img
          className="w-full h-64 object-cover"
          src={`${import.meta.env.VITE_API_BASE_URL}${food.gambar_url}`}
          alt={food.nama}
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{food.nama}</h2>
          <p className="text-gray-600 mb-4">{food.deskripsi}</p>
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(food.harga)}
          </div>
        </div>

        {/* Tombol Kembali */}
        <div className="p-6">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate("/foods")} // Navigasi ke halaman FoodsMenu
          >
            Kembali
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FoodDetail;
