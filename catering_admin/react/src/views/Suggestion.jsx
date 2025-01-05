import { useState, useEffect } from "react";
import axiosClient from "../axiosClient";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await axiosClient.get("/suggestions");
      setSuggestions(response.data.data || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setError("Failed to fetch suggestions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this suggestion?"))
      return;

    try {
      await axiosClient.delete(`/suggestions/${id}`);
      fetchSuggestions();
    } catch (err) {
      console.error("Error deleting suggestion:", err);
      alert("Failed to delete suggestion. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Suggestions</h1>
      </div>
      {suggestions.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-1/4 py-2 px-4 text-center text-sm font-medium text-gray-700 border-b">
                  No
                </th>
                <th className="w-1/4 py-2 px-4 text-center text-sm font-medium text-gray-700 border-b">
                  User
                </th>
                <th className="w-1/4 py-2 px-4 text-center text-sm font-medium text-gray-700 border-b">
                  Content
                </th>
                <th className="w-1/4 py-2 px-4 text-center text-sm font-medium text-gray-700 border-b">
                  Created At
                </th>
                <th className="w-1/4 py-2 px-4 text-center text-sm font-medium text-gray-700 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((suggestion, index) => (
                <tr key={suggestion.id} className="hover:bg-gray-50">
                  <td className="w-1/4 py-2 px-4 text-center text-sm text-gray-700 border-b">
                    {index + 1}
                  </td>
                  <td className="w-1/4 py-2 px-4 text-center text-sm text-gray-700 border-b">
                    {suggestion.user.name}
                  </td>
                  <td className="w-1/4 py-2 px-4 text-center text-sm text-gray-700 border-b">
                    {suggestion.content}
                  </td>
                  <td className="w-1/4 py-2 px-4 text-center text-sm text-gray-700 border-b">
                    {new Date(suggestion.created_at).toLocaleDateString()}
                  </td>
                  <td className="w-1/4 py-2 px-4 text-center border-b">
                    <button
                      onClick={() => handleDelete(suggestion.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No suggestions found.</p>
      )}
    </div>
  );
}
