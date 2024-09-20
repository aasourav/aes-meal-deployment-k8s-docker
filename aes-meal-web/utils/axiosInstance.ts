import axios from "axios";
import { getProjectEnvVariables } from "../src/shared/projectEnvVariables";
const { envVariables } = getProjectEnvVariables();

const axiosInstance = axios.create({
  baseURL: `${envVariables.VITE_BASE_URL}/v1`, // Replace with your API base URL
  withCredentials: true, // Allow cookies to be sent in requests
});

axios.defaults.withCredentials = true;

export default axiosInstance;
