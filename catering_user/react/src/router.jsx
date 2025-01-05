import { createBrowserRouter } from "react-router-dom";

import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Signup from "./views/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import FoodsMenu from "./views/FoodsMenu";
import CategoryMenu from "./views/CategoryMenu";
import About from "./views/About";
import ShoppingCart from "./views/ShoppingCart";
import CategoryFoods from "./components/CategoryFoods";
import OrderFormDirect from "./components/OrderFormDirect";
import Profile from "./views/Profile";
import FoodDetail from "./components/FoodDetail";
import EditProfile from "./components/EditProfile";
import OrderFormCart from "./components/OrderFormCart";
import Payment from "./components/Payment";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
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
  {
    path: "/foods",
    element: <FoodsMenu />,
  },
  {
    path: "/foods/:id",
    element: <FoodDetail />,
  },
  {
    path: "/categories",
    element: <CategoryMenu />,
  },
  {
    path: "/categories/:id",
    element: <CategoryFoods />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/cart",
    element: <ShoppingCart />,
  },
  {
    path: "/order-form",
    element: <OrderFormDirect />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/profile/:id",
    element: <EditProfile />,
  },
  {
    path: "/order-form-cart",
    element: <OrderFormCart />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
]);

export default router;
