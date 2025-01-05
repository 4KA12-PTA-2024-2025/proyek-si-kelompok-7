import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";
import { useNavigate } from "react-router-dom";

function ShoppingCart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axiosClient.get("/cart");
        setCartItems(response.data.data);
      } catch {
        Swal.fire({
          title: "Error",
          text: "Failed to load cart items.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = async (id, action) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    const updatedQuantity =
      action === "increment" ? item.jumlah + 1 : item.jumlah - 1;

    if (updatedQuantity < 1) {
      Swal.fire({
        title: "Warning",
        text: "Quantity cannot be less than 1.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      await axiosClient.put(`/cart/${id}`, { jumlah: updatedQuantity });
      setCartItems((prevItems) =>
        prevItems.map((i) =>
          i.id === id
            ? {
                ...i,
                jumlah: updatedQuantity,
                harga_total: i.harga_satuan * updatedQuantity,
              }
            : i
        )
      );
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to update quantity.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await axiosClient.delete(`/cart/${id}`);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      Swal.fire({
        title: "Success",
        text: "Item removed from cart.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to remove item from the cart.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.harga_total),
      0
    );
  };

  const calculateCartCount = () => {
    return cartItems.reduce((total, item) => total + item.jumlah, 0);
  };

  const handleCheckout = () => {
    navigate("/order-form-cart");
  };

  return (
    <div>
      <Navbar cartCount={calculateCartCount()} />
      <div className="container mx-auto py-8">
        <h1 className="text-center text-3xl font-bold mb-6">Keranjang</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : cartItems.length > 0 ? (
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-lg p-4 mb-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/storage/foods/${
                      item.food?.gambar
                    }`}
                    alt={item.nama_menu}
                    className="w-12 h-12 object-cover rounded mr-4"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/50";
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-medium">{item.nama_menu}</h3>
                    <p className="text-sm text-gray-600">
                      Harga Satuan: {formatCurrency(item.harga_satuan)} |
                      Jumlah: {item.jumlah}
                    </p>
                    <p className="text-sm text-gray-600">
                      Harga Total: {formatCurrency(item.harga_total)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(item.id, "decrement")}
                    className="bg-gray-200 text-gray-700 font-bold px-2 py-1 rounded hover:bg-gray-300 mr-2"
                  >
                    -
                  </button>
                  <span>{item.jumlah}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, "increment")}
                    className="bg-gray-200 text-gray-700 font-bold px-2 py-1 rounded hover:bg-gray-300 ml-2"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="bg-red-500 text-white font-bold py-1 px-2 rounded hover:bg-red-600 ml-4"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            <div className="border-t pt-4 text-right">
              <h2 className="text-xl font-bold">
                Total: {formatCurrency(calculateTotal())}
              </h2>
              <button
                onClick={handleCheckout}
                className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-green-600"
              >
                Check Out
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center">Keranjang Anda kosong.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ShoppingCart;
