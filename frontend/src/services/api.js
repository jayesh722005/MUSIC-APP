import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Attach token to headers if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aura_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth Endpoints
export const authApi = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },
};

// Music & Album Endpoints
export const musicApi = {
  getAllMusic: async () => {
    const res = await api.get('/music');
    return res.data;
  },
  getAllAlbums: async () => {
    const res = await api.get('/music/album');
    return res.data;
  },
  getAlbumById: async (albumId) => {
    const res = await api.get(`/music/album/${albumId}`);
    return res.data;
  },
  uploadMusic: async (formData) => {
    const res = await api.post('/music/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  createAlbum: async (albumData) => {
    const res = await api.post('/music/album', albumData);
    return res.data;
  },
  toggleLike: async (musicId) => {
    const res = await api.post(`/music/like/${musicId}`);
    return res.data;
  },
  getLikedMusic: async () => {
    const res = await api.get('/music/favorites');
    return res.data;
  },
};

export default api;
