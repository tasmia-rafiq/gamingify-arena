import api from "./axios";

export const fetchUserProfile = (id) => api.get(`/api/v1/users/${id}`);
export const followUser = (id) => api.post(`/api/v1/users/${id}/follow`);
export const unfollowUser = (id) => api.post(`/api/v1/users/${id}/unfollow`);
