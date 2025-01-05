import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function EditFoods() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    harga: "",
    category_id: "",
    gambar_url: null,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodResponse, categoriesResponse] = await Promise.all([
          axiosClient.get(`/foods/${id}`),
          axiosClient.get("/categories"),
        ]);

        const foodData = foodResponse.data.data;
        setFormData({
          nama: foodData.nama,
          deskripsi: foodData.deskripsi,
          harga: foodData.harga.toString(),
          category_id: foodData.category_id?.toString() || "",
          gambar_url: foodData.gambar_url,
        });

        setCategories(categoriesResponse.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch food details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama", formData.nama);
      formDataToSend.append("deskripsi", formData.deskripsi);
      formDataToSend.append("harga", formData.harga);
      formDataToSend.append("category_id", formData.category_id);

      if (newImage) {
        formDataToSend.append("gambar", newImage);
      }

      // Add _method field for Laravel to recognize PUT request
      formDataToSend.append("_method", "PUT");

      const response = await axiosClient.post(`/foods/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        alert("Food updated successfully!");
        navigate("/foods");
      }
    } catch (err) {
      console.error("Error updating food:", err);
      alert(
        err.response?.data?.message ||
          "Failed to update food. Please try again later."
      );
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-lg text-gray-700">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Food Menu</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Nama</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Deskripsi
          </label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Harga</label>
          <input
            type="number"
            name="harga"
            value={formData.harga}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
            required
            min="0"
            step="1"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Kategori</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Pilih Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-blue-500"
          />
          {formData.gambar_url && !newImage && (
            <img
              src={formData.gambar_url}
              alt="Current"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
          {newImage && (
            <img
              src={URL.createObjectURL(newImage)}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate("/foods")}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
