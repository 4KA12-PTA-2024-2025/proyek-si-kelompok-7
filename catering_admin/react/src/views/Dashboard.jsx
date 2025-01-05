import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import axiosClient from "../axiosClient";

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const CardHeader = ({ children, className }) => (
  <div className={`${className}`}>{children}</div>
);

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const CardTitle = ({ children, className }) => (
  <h3 className={`text-sm font-medium text-gray-600 ${className}`}>
    {children}
  </h3>
);

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const CardContent = ({ children, className }) => (
  <div className={`text-2xl font-bold ${className}`}>{children}</div>
);

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    foods: 0,
    categories: 0,
    suggestions: 0,
    orders: 0,
    customers: 0,
    payments: 0,
    stocks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const responses = await Promise.all([
        axiosClient.get("/foods"),
        axiosClient.get("/categories"),
        axiosClient.get("/suggestions"),
        axiosClient.get("/admin/orders"),
        axiosClient.get("/admin/users"),
        axiosClient.get("/admin/payments"),
        axiosClient.get("/admin/stocks"),
      ]);

      setStats({
        foods: responses[0].data.data?.length || 0,
        categories: responses[1].data.data?.length || 0,
        suggestions: responses[2].data.data?.length || 0,
        orders: responses[3].data.data?.length || 0,
        customers: responses[4].data.data?.length || 0,
        payments: responses[5].data.data?.length || 0,
        stocks: responses[6].data.data?.length || 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to fetch dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Menu Items",
      value: stats.foods,
      color: "bg-orange-100 text-orange-600",
      bgHover: "hover:bg-orange-200",
    },
    {
      title: "Categories",
      value: stats.categories,
      color: "bg-purple-100 text-purple-600",
      bgHover: "hover:bg-purple-200",
    },
    {
      title: "Suggestions",
      value: stats.suggestions,
      color: "bg-blue-100 text-blue-600",
      bgHover: "hover:bg-blue-200",
    },
    {
      title: "Orders",
      value: stats.orders,
      color: "bg-green-100 text-green-600",
      bgHover: "hover:bg-green-200",
    },
    {
      title: "Customers",
      value: stats.customers,
      color: "bg-pink-100 text-pink-600",
      bgHover: "hover:bg-pink-200",
    },
    {
      title: "Payments",
      value: stats.payments,
      color: "bg-yellow-100 text-yellow-600",
      bgHover: "hover:bg-yellow-200",
    },
    {
      title: "Stock Items",
      value: stats.stocks,
      color: "bg-indigo-100 text-indigo-600",
      bgHover: "hover:bg-indigo-200",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card
            key={index}
            className={`transition-all duration-300 ${card.bgHover} hover:shadow-lg`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{card.title}</CardTitle>
              <div
                className={`h-8 w-8 flex items-center justify-center rounded-full ${card.color}`}
              >
                <span className="text-sm font-bold">?</span>
              </div>
            </CardHeader>
            <CardContent>{card.value}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
