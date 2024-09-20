import axios from "axios";

const wind = window as any;
const axiosInstance = axios.create({
  baseURL: `${wind.env.VITE_BASE_URL as any}/v1`, // Replace with your API base URL
  withCredentials: true, // Allow cookies to be sent in requests
});

axios.defaults.withCredentials = true;

export default axiosInstance;
