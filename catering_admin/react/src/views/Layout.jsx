import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <React.Fragment>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar Section */}
        {isSidebarOpen && (
          <div className="w-64 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <Sidebar />
          </div>
        )}

        {/* Main Content Section */}
        <div className="flex-1">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Layout;
