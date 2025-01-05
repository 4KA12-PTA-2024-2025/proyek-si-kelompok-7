import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 7000,
});

// Add auth token to requests if it exists
axiosClient.interceptors.request.use((config) => {
  // Don't add auth token for authentication-related endpoints
  const publicEndpoints = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];

  if (publicEndpoints.some((endpoint) => config.url.includes(endpoint))) {
    return config;
  }

  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      console.error("Network Error: Please check your internet connection");
      return Promise.reject(error);
    }

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      const token = localStorage.getItem("access_token");

      // Skip token refresh for authentication-related endpoints
      const authEndpoints = [
        "/auth/login",
        "/auth/register",
        "/auth/forgot-password",
        "/auth/reset-password",
      ];

      if (
        authEndpoints.some((endpoint) => originalRequest.url.includes(endpoint))
      ) {
        return Promise.reject(error);
      }

      // Only attempt refresh if there's an existing token
      if (token) {
        try {
          originalRequest._retry = true;
          const response = await axios.post(
            "http://localhost:8000/api/auth/refresh",
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              timeout: 5000,
            }
          );

          const newToken = response.data.access_token;
          localStorage.setItem("access_token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        } catch (refreshError) {
          // Only remove token if refresh attempt fails
          localStorage.removeItem("access_token");
          // Don't redirect, just reject the promise
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
