import api from "./axios";

export const registerUser = async (payload) => {
    const { data } = await api.post("/api/v1/auth/register", payload);
    return data;
}

export const checkUsernameAvailability = async (username) => {
    const { data } = await api.get(`/api/v1/auth/check-username?username=${username}`);
    return data;
}

export const verifyEmail = async (token) => {
    const { data } = await api.post(`/api/v1/auth/verify-email/${token}`);
    return data;
}

export const loginUser = async (payload) => {
  const {data} = await api.post("/api/v1/auth/login", payload);
  return data;
}

export const forgotPassword = async (payload) => {
    const { data } = await api.post("/api/v1/auth/forgot-password", payload);
    return data;
}

export const resetPassword = async (token, payload) => {
    const { data } = await api.post(`/api/v1/auth/reset-password/${token}`, payload);
    return data;
}

export const logoutUser = async () => {
    const { data } = await api.post("/api/v1/auth/logout");
    return data;
}

export const getCurrentUser = async () => {
  const { data } = await api.get("/api/v1/auth/user-info");
  return data;
}