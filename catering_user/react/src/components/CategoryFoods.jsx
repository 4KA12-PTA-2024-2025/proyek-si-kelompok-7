import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";

function CategoryFoods() {
  const { id } = useParams();
  const [foods, setFoods] = useState([]);
  const [category, setCategory] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Format currency to Indonesian Rupiah
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axiosClient.get(`/categories/${id}/foods`);
        setFoods(response.data.foods);
        setCategory(response.data.category);
      } catch (error) {
        console.error("Failed to fetch foods:", error);
      }
    };

    const fetchCartCount = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        return; // Exit if no token
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

    fetchFoods();
    fetchCartCount();
  }, [id]);

  return (
    <div>
      <Navbar cartCount={cartCount} />
      <div className="container mx-auto py-8 px-4">
        {category ? (
          <>
            <h1 className="text-4xl font-bold text-teal-700 text-center mb-6">
              Jelajahi Menu di Kategori: {category.name}
            </h1>
            <p className="text-center text-lg text-gray-600 mb-8">
              Temukan hidangan lezat dari kategori{" "}
              <strong>{category.name}</strong>. Pilih makanan favorit Anda dan
              tambahkan ke keranjang untuk dinikmati!
            </p>
            {foods.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {foods.map((food) => (
                  <div
                    key={food.id}
                    className="bg-white rounded-lg overflow-hidden shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}${
                          food.gambar_url
                        }`}
                        alt={food.nama}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-teal-800 mb-2">
                        {food.nama}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {food.deskripsi || "Tidak ada deskripsi tersedia."}
                      </p>
                      <p className="text-xl font-bold text-teal-600">
                        {formatCurrency(food.harga)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                Tidak ada menu yang tersedia untuk kategori ini.
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center">Memuat kategori...</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default CategoryFoods;
