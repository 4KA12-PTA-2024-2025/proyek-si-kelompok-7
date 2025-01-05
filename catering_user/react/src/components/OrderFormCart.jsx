import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";
import { useNavigate } from "react-router-dom";

function OrderFormCart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/cart");
        const items = response.data?.data || [];
        setCartItems(items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to load cart items.",
          icon: "error",
          confirmButtonText: "OK",
        });
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.harga_total),
      0
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.phone) {
      Swal.fire({
        title: "Error",
        text: "Please complete all fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);

    try {
      // Membuat order
      const orderResponse = await axiosClient.post("/orders/cart", {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
      });

      if (orderResponse.data.status === "success") {
        // Show success message and handle redirection
        Swal.fire({
          title: "Success",
          text: "Order created successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/payment");
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to create order",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar cartCount={0} />
        <div className="container mx-auto py-8">
          <h1 className="text-center text-3xl font-bold mb-6">Your Cart</h1>
          <p className="text-center">Your cart is empty.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar
        cartCount={cartItems.reduce((total, item) => total + item.jumlah, 0)}
      />
      <div className="container mx-auto py-8">
        <h1 className="text-center text-3xl font-bold mb-6">
          Order Form for Cart
        </h1>

        <div className="max-w-lg mx-auto mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary:</h2>
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-2 pb-2 border-b"
              >
                <div>
                  <p className="font-medium">{item.nama_menu}</p>
                  <p className="text-sm text-gray-600">
                    {item.jumlah} x {formatCurrency(item.harga_satuan)}
                  </p>
                </div>
                <p className="font-medium">
                  {formatCurrency(item.harga_total)}
                </p>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4 pt-2 border-t">
              <p className="font-bold">Total:</p>
              <p className="font-bold">{formatCurrency(calculateTotal())}</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Customer Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter customer name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Shipping Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter shipping address"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="mb-6">
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg focus:outline-none ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>

            <button
              type="button"
              className="w-full mt-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              onClick={() => navigate("/cart")}
            >
              Back to Cart
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default OrderFormCart;
