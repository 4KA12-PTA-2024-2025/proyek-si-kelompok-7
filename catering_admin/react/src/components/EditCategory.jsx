import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    image_url: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axiosClient.get(`/categories/${id}`);
        if (response.data.status === "success") {
          const categoryData = response.data.data;
          setFormData({
            name: categoryData.name,
            image: categoryData.image,
            image_url: categoryData.image_url,
          });
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(
          err.response?.data?.message ||
            "Failed to fetch category details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
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
    if (file) {
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        setError("Please select a valid image file (JPG, JPEG, or PNG)");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }
      setNewImage(file);
      setError(null);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image_url: previewUrl,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("_method", "PUT"); // For Laravel to recognize this as a PUT request

      if (newImage) {
        formDataToSend.append("image", newImage);
      }

      const response = await axiosClient.post(
        `/categories/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setSuccess("Category updated successfully!");
        setTimeout(() => {
          navigate("/category");
        }, 1500);
      }
    } catch (err) {
      console.error("Error updating category:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update category. Please try again later."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-lg mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Category</h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-500 p-4 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/jpeg,image/jpg,image/png"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Accepted formats: JPG, JPEG, PNG (max 2MB)
            </p>

            {formData.image_url && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {newImage ? "New Image Preview:" : "Current Image:"}
                </p>
                <img
                  src={formData.image_url}
                  alt="Category preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate("/category")}
              className="flex-1 bg-gray-600 text-white px-6 py-2.5 rounded-md hover:bg-gray-700 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
