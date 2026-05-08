import api from "./axios";

export const fetchCategories = () => api.get("/api/v1/categories");