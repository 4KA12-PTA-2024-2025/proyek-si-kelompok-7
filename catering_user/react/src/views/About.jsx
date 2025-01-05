import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";
import { useNavigate } from "react-router-dom";

function About() {
  const [cartCount, setCartCount] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    // Fetch user data if logged in
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await axiosClient.post("/auth/me");
          setUserData(response.data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          if (error.response?.status === 401) {
            handleLogout();
          }
        }
      }
    };

    const fetchCartCount = async () => {
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
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };

    fetchUserData();
    fetchCartCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setCartCount(0);
    setUserData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      const confirmLogin = window.confirm(
        "Anda harus login terlebih dahulu untuk memberikan saran. Apakah Anda ingin login sekarang?"
      );
      if (confirmLogin) {
        navigate("/login");
      }
      return;
    }

    try {
      const response = await axiosClient.post("/suggestions", {
        user_id: userData.id,
        content: suggestion,
      });

      if (response.status === 201) {
        setSubmitStatus({
          type: "success",
          message: "Terima kasih! Saran Anda telah berhasil dikirim.",
        });
        setSuggestion("");
        setTimeout(() => setSubmitStatus(null), 3000);
      }
    } catch (error) {
      console.error("Failed to submit suggestion:", error);
      if (error.response?.status === 401) {
        handleLogout();
        const confirmLogin = window.confirm(
          "Sesi Anda telah berakhir. Apakah Anda ingin login kembali?"
        );
        if (confirmLogin) {
          navigate("/login");
        }
      } else {
        setSubmitStatus({
          type: "error",
          message: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        });
        setTimeout(() => setSubmitStatus(null), 3000);
      }
    }
  };

  return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="container mx-auto px-4 py-8">
        <div className="header text-center mb-8">
          <h1 className="text-3xl font-bold">Warung Nasi Marsel</h1>
        </div>

        <div className="main-content flex flex-col md:flex-row md:space-x-8 bg-orange-100 p-8 rounded-lg">
          <div className="location md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl font-semibold text-center mb-4">Lokasi</h2>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.44811654303!2d106.83169077453273!3d-6.335953161992128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69edaea5fe6f59%3A0x26f70cea80aa96b1!2sWarung%20Nasi%20Marsel!5e0!3m2!1sid!2sid!4v1721817577383!5m2!1sid!2sid"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            ></iframe>
          </div>

          <div className="about-us md:w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Sejarah</h2>
            <p className="mb-6">
              Warung Nasi Marsel adalah tempat makan yang berasal dari Kuningan
              Jawa Barat, menawarkan berbagai macam hidangan khas Sunda. Kami
              menggunakan bahan-bahan segar dan berkualitas untuk menyajikan
              makanan yang lezat dan bergizi.
            </p>

            <div className="contact mb-8">
              <h2 className="text-2xl font-semibold mb-4">Kontak Kami</h2>
              <div className="contact-details space-y-2">
                <p>
                  <strong>Alamat:</strong> Jl. Buku Dikrama RT.05 RW.04 NO.35
                </p>
                <p>
                  <strong>Telepon:</strong> +62 812-9591-7717
                </p>
                <p>
                  <strong>Email:</strong> warungnasimarsel@gmail.com
                </p>
              </div>
            </div>

            <div className="suggestion-form bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">
                Berikan Saran Anda
              </h2>

              {!isLoggedIn && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded">
                  Silakan login terlebih dahulu untuk memberikan saran.
                </div>
              )}

              {submitStatus && (
                <div
                  className={`mb-4 p-3 rounded ${
                    submitStatus.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    htmlFor="suggestion"
                  >
                    Pesan Saran
                  </label>
                  <textarea
                    id="suggestion"
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder={
                      isLoggedIn
                        ? "Tulis saran Anda di sini..."
                        : "Silakan login terlebih dahulu untuk memberikan saran"
                    }
                    required
                    disabled={!isLoggedIn}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    isLoggedIn
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!isLoggedIn}
                >
                  {isLoggedIn ? "Kirim Saran" : "Login untuk Kirim Saran"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
