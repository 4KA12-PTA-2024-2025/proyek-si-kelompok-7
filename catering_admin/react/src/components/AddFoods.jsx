import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function AddFoods() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    harga: "",
    category_id: "",
    gambar: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get("/categories");
      console.log("Categories fetched:", response.data);
      const categoriesData = response.data.data || [];
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === "harga" ? parseFloat(value) : value;
    setFormData({ ...formData, [name]: processedValue });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }
      setFormData({ ...formData, gambar: file });
      setPreviewImage(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  const validateForm = () => {
    if (!formData.nama.trim()) {
      setError("Food name is required");
      return false;
    }
    if (!formData.deskripsi.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.harga || formData.harga <= 0) {
      setError("Please enter a valid price");
      return false;
    }
    if (!formData.category_id) {
      setError("Please select a category");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    const data = new FormData();
    data.append("nama", formData.nama.trim());
    data.append("deskripsi", formData.deskripsi.trim());
    data.append("harga", formData.harga);
    data.append("category_id", formData.category_id);

    if (formData.gambar) {
      data.append("gambar", formData.gambar);
    }

    try {
      const response = await axiosClient.post("/foods", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      console.log("Food creation response:", response.data);

      if (response.data.status === "success") {
        setSuccess("Food added successfully!");
        setFormData({
          nama: "",
          deskripsi: "",
          harga: "",
          category_id: "",
          gambar: null,
        });
        setPreviewImage(null); // Clear preview image
        setTimeout(() => {
          navigate("/foods");
        }, 1500);
      } else {
        setError(response.data.message || "Failed to add food");
      }
    } catch (err) {
      console.error("Error adding food:", err);
      setError(
        err.response?.data?.message ||
          "Failed to add food. Please check all fields and try again."
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Food</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Food Name</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            name="harga"
            value={formData.harga}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Image</label>
          <input
            type="file"
            name="gambar"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full border border-gray-300 rounded p-2"
          />
          {previewImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Image Preview:</p>
              <img
                src={previewImage}
                alt="Preview"
                className="w-32 h-32 object-cover border rounded"
              />
            </div>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Food
          </button>
          <button
            type="button"
            onClick={() => navigate("/foods")}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
