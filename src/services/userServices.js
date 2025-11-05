import api from "../Common API/api";
import axios from 'axios'
// Register user
export const userRegister = async (formData) => {
  const res = await api.post("/accounts/register/", formData);
  return res.data;
};

// Login user
export const userLogin = async (data) => {
  const res = await api.post("/accounts/login/", data);
  console.log(res.data);
  return res.data;
};

// Get user profile (requires JWT token)
export const userProfile = async () => {
  const res = await api.get("/accounts/user_profile/");
  return res.data;
};

// Update user profile
export const updateUserProfile = async (formData) => {
  // Use FormData if you’re uploading profile picture
  const res = await api.put("/accounts/user_profile/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Change password
export const changePasswordApi = async (data) => {
  // data = { old_password: "...", new_password: "..." }
  const res = await api.post("/accounts/change-password/", data);
  return res.data;
};

//  Test SMTP email (optional)
// export const testEmailApi = async () => {
//   const res = await api.get("/accounts/test-email/");
//   return res.data;
// };

// Refresh access token using refresh token
export const refreshTokenApi = async () => {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) throw new Error("No refresh token found");

  // Corrected URL
  const res = await axios.post("http://127.0.0.1:8000/accounts/token/refresh/", { refresh });

  const data = res.data;
  if (data.access) {
    localStorage.setItem("accessToken", data.access);
  }
  return data;
};

