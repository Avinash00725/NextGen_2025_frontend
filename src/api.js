import axios from 'axios';

const API = axios.create({
  baseURL: 'https://nextgen-2025-backend.onrender.com/api',
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const register = (userData) => API.post('/users/register', userData);
export const login = (userData) => API.post('/users/login', userData);
export const getUserProfile = () => API.get('/users/me');
export const updateUserProfile = (userData) => API.put('/users/me', userData);

export const getRecipes = () => API.get('/recipes');
export const getUserRecipes = () => API.get('/recipes/user');
export const createRecipe = (recipeData) => API.post('/recipes', recipeData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);

export const getPosts = () => API.get('/posts');
export const createPost = (postData) => API.post('/posts', postData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const upvotePost = (id) => API.post(`/posts/${id}/upvote`);
export const downvotePost = (id) => API.post(`/posts/${id}/downvote`);
export const addComment = (id, commentData) => API.post(`/posts/${id}/comment`, commentData);

export const getNotifications = () => API.get('/notifications');