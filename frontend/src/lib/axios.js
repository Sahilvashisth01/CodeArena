import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,// by addig this field//browser will send cookies along with requests
});

export default axiosInstance