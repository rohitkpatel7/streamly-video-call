import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://streamly-backend-2nmm.onrender.com",
  withCredentials: true,
});
