import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axiosClient from "../axiosClient";
import { useNavigate, useLocation } from "react-router-dom";

function OrderFormDirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [cartCount, setCartCount] = useState(0); // Cart count state

  // Form state with correct field names matching the API
  const [formData, setFormData] = useState({
    name: "", // matches the API's 'name' field
    address: "", // matches the API's 'address' field
    phone: "", // matches the API's 'phone' field
    food_id: location.state?.foodData?.id || "",
    quantity: location.state?.foodData?.quantity || 1,
  });

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!location.state?.foodData?.id) {
        Swal.fire({
          title: "Error",
          text: "No food item selected",
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/foods");
        });
        return;
      }

      try {
        const foodId = location.state.foodData.id;
        const foodResponse = await axiosClient.get(`/foods/${foodId}`);
        setSelectedFood(foodResponse.data.data);
      } catch (error) {
        console.error("Error fetching food data:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to load food data",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchInitialData();
  }, [location.state?.foodData?.id, navigate]);

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setCartCount(0);
        return;
      }

      try {
        const response = await axiosClient.get("/cart");
        const totalCartCount = response.data.data.reduce(
          (total, item) => total + item.jumlah,
          0
        );
        setCartCount(totalCartCount);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();
  }, []);

  useEffect(() => {
    if (selectedFood) {
      const calculatedTotal = selectedFood.harga * formData.quantity;
      setTotalPrice(calculatedTotal);
    }
  }, [selectedFood, formData.quantity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(1, parseInt(value, 10)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.phone) {
      Swal.fire({
        title: "Error",
        text: "Please fill in all fields",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);

    try {
      // Create order with correct field names matching the API
      const orderData = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        food_id: selectedFood.id,
        quantity: formData.quantity,
      };

      // Submit the order to the correct endpoint
      const orderResponse = await axiosClient.post("/orders/direct", orderData);

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

  return (
    <div>
      <Navbar cartCount={cartCount} />
      <div className="container mx-auto py-8">
        <h1 className="text-center text-3xl font-bold mb-6">Order Form</h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg"
        >
          {/* Customer Name */}
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
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Selected Food Details */}
          {selectedFood && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Selected Menu
              </label>
              <input
                type="text"
                value={selectedFood.nama}
                className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                disabled
              />
            </div>
          )}

          {/* Shipping Address */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your address"
              required
            />
          </div>

          {/* Phone Number */}
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

          {/* Quantity */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          {/* Total Price */}
          {selectedFood && (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Total Price
              </label>
              <input
                type="text"
                value={`Rp ${totalPrice.toLocaleString("id-ID")}`}
                className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                disabled
              />
            </div>
          )}

          {/* Submit and Back buttons */}
          <div className="mb-6">
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg focus:outline-none ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Order Now"}
            </button>

            <button
              type="button"
              className="w-full mt-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default OrderFormDirect;
