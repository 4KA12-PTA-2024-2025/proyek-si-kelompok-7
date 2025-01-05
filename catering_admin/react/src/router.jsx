import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./views/Layout";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Signup from "./views/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import FoodsMenu from "./views/FoodsMenu";
import CategoryMenu from "./views/CategoryMenu";
import Orders from "./views/Order";
import AddFoods from "./components/AddFoods";
import EditFoods from "./components/EditFoods";
import AddCategory from "./components/AddCategory";
import EditCategory from "./components/EditCategory";
import Suggestion from "./views/Suggestion";
import CustomerData from "./views/CustomerData";
import PaymentManagement from "./views/Payment";
import Stock from "./views/Stock";

// Function to check authentication
const isAuthenticated = () => {
  return localStorage.getItem("access_token") !== null;
};

// Protected Route Wrapper
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <ProtectedRoute element={<Dashboard />} />,
      },
      {
        path: "foods",
        element: <ProtectedRoute element={<FoodsMenu />} />,
      },
      {
        path: "foods/tambah-menu",
        element: <ProtectedRoute element={<AddFoods />} />,
      },
      {
        path: "foods/edit/:id",
        element: <ProtectedRoute element={<EditFoods />} />,
      },
      {
        path: "category",
        element: <ProtectedRoute element={<CategoryMenu />} />,
      },
      {
        path: "category/tambah-category",
        element: <ProtectedRoute element={<AddCategory />} />,
      },
      {
        path: "category/edit/:id",
        element: <ProtectedRoute element={<EditCategory />} />,
      },
      {
        path: "order",
        element: <ProtectedRoute element={<Orders />} />,
      },
      {
        path: "saran",
        element: <ProtectedRoute element={<Suggestion />} />,
      },
      {
        path: "customers",
        element: <ProtectedRoute element={<CustomerData />} />,
      },
      {
        path: "payments",
        element: <ProtectedRoute element={<PaymentManagement />} />,
      },
      {
        path: "stok", // Add the new route for Payments
        element: <ProtectedRoute element={<Stock />} />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
]);

export default router;
