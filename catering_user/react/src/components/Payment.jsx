import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosClient from "../axiosClient";
import QRCode from "../assets/DANA BISNIS-QRIS.jpeg";

const Payment = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        const response = await axiosClient.get("/orders");
        if (
          response.data.status === "success" &&
          response.data.data.length > 0
        ) {
          // Get the most recent order
          const latestOrder = response.data.data[0];
          setOrder(latestOrder);
        } else {
          throw new Error("No orders found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to load order data",
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOrder();
  }, [navigate]);

  const handlePaymentCompletion = async () => {
    try {
      if (!order) {
        throw new Error("No order data available");
      }

      // Create payment record
      await axiosClient.post(`/payments/${order.id}`, {
        status: "completed",
      });

      // Update order status to processing after payment
      await axiosClient.put(`/orders/${order.id}/status`, {
        status: "processing",
      });

      Swal.fire({
        title: "Success",
        text: "Payment completed successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to process payment",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading payment details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">No order found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">Pembayaran QRIS</h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Detail Pesanan:</h2>
          <div className="space-y-2">
            <p className="text-gray-700">Nama: {order.name}</p>
            <p className="text-gray-700">Alamat: {order.address}</p>
            <p className="text-gray-700">No. Telepon: {order.phone}</p>
            <p className="text-gray-700">Menu: {order.food_name}</p>
            <p className="text-lg font-bold text-green-600">
              Total Pembayaran: Rp{" "}
              {parseInt(order.total_amount).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Scan QR Code untuk pembayaran:
          </h3>
          <img
            src={QRCode}
            alt="QRIS Payment QR Code"
            className="mx-auto w-64 h-64 border-2 border-gray-200 rounded-lg"
          />
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            Pastikan nominal pembayaran sesuai dengan total yang tertera
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Setelah melakukan pembayaran, klik tombol "Selesai Pembayaran" di
              bawah ini
            </p>
          </div>

          <button
            onClick={handlePaymentCompletion}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            Selesai Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
