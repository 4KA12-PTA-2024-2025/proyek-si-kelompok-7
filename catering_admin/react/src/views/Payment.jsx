import { useState, useEffect } from "react";
import axiosClient from "../axiosClient";
import { Navigate } from "react-router-dom";

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axiosClient.get("/admin/payments");
      setPayments(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching payments:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized access. Please login as admin.");
        localStorage.removeItem("access_token");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to fetch payments. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosClient.put(`/admin/payments/${id}/status`, {
        payment_status: newStatus,
      });
      fetchPayments();
      setError(null);
    } catch (err) {
      console.error("Error updating payment status:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized access. Please login as admin.");
        localStorage.removeItem("access_token");
      } else {
        alert(
          err.response?.data?.message ||
            "Failed to update payment status. Please try again later."
        );
      }
    }
  };

  const formatCurrency = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    try {
      // Parse the date string and keep it in its original timezone
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) return "-";

      // Format the date and time according to Indonesian locale
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
      }).format(date);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "-";
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (error === "Unauthorized access. Please login as admin.") {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <div className="mt-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {payments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b font-medium text-gray-900">
                  No
                </th>
                <th className="py-3 px-4 border-b font-medium text-gray-900">
                  Order ID
                </th>
                <th className="py-3 px-4 border-b font-medium text-gray-900">
                  Payment Date
                </th>
                <th className="py-3 px-4 border-b font-medium text-gray-900">
                  Amount
                </th>
                <th className="py-3 px-4 border-b font-medium text-gray-900">
                  Status
                </th>
                <th className="py-3 px-4 border-b font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-center">{index + 1}</td>
                  <td className="py-3 px-4">{payment.order_id}</td>
                  <td className="py-3 px-4">
                    {formatDate(payment.payment_date)}
                  </td>
                  <td className="py-3 px-4">
                    {formatCurrency(payment.order?.total_amount || 0)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        payment.payment_status
                      )}`}
                    >
                      {payment.payment_status.charAt(0).toUpperCase() +
                        payment.payment_status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={payment.payment_status}
                      onChange={(e) =>
                        handleStatusUpdate(payment.id, e.target.value)
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No payments found.</p>
        </div>
      )}
    </div>
  );
}
