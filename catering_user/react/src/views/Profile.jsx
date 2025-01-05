import { useState, useEffect } from "react";
import axiosClient from "../axiosClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null); // State untuk menyimpan data pengguna
  const [error, setError] = useState(null); // State untuk menangani error
  const navigate = useNavigate(); // Hook untuk navigasi

  useEffect(() => {
    // Fetch cart count
    const fetchCartCount = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.log("No token found, user not logged in.");
        return;
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

    // Fetch user profile
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("User not logged in.");
        return;
      }

      try {
        const response = await axiosClient.post("/auth/me");
        setUser(response.data); // Simpan data pengguna ke state
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        if (error.response && error.response.status === 401) {
          setError("Session expired. Please log in again.");
        }
      }
    };

    fetchCartCount();
    fetchUserProfile();
  }, []);

  if (error) {
    return (
      <div>
        <Navbar cartCount={cartCount} />
        <div className="container mx-auto px-4 py-6">
          <p className="text-red-500 text-center">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar cartCount={cartCount} />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        {user ? (
          <div className="bg-white shadow rounded-lg p-6">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Alamat:</strong> {user.alamat}
            </p>
            <p>
              <strong>Nomer Handphone:</strong> {user.telephone}
            </p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>

      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate(`/profile/${user?.id}`)} // Navigasi ke halaman edit profil
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit Profile
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
