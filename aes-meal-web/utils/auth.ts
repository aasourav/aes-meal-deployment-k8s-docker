import Cookies from "js-cookie";

export const isLoggedIn = (): boolean => {
  const accessToken = Cookies.get("aes-meal-access");
  console.log("Access Token Cookie: ", accessToken);
  return !!accessToken; // Check if the access token exists
};

export const getUserRole = (): string | undefined => {
  // You should fetch or decode the role from token or cookies
  const role = Cookies.get("userRole"); // Assuming 'userRole' is stored
  return role;
};

// export const BACKEND_URL = import.meta.env.BASE_URL
// console.log(BACKEND_URL)
