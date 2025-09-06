import axios from 'axios';

const API_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337/api';

// Создаем экземпляр axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к каждому запросу
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обработка ответов и ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Типы данных
export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  duration: string;
  views: number;
  status: 'published' | 'draft' | 'archived';
  featured: boolean;
  thumbnail?: {
    id: number;
    url: string;
    name: string;
  };
  videoFile?: {
    id: number;
    url: string;
    name: string;
  };
  category?: Category;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  description: string;
  slug: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Tag {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Playlist {
  id: number;
  documentId: string;
  name: string;
  description: string;
  slug: string;
  isPublic: boolean;
  videos?: Video[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Comment {
  id: number;
  documentId: string;
  content: string;
  author: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected';
  video?: Video;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Subscription {
  id: number;
  documentId: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Settings {
  id: number;
  documentId: string;
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logo?: {
    id: number;
    url: string;
    name: string;
  };
  favicon?: {
    id: number;
    url: string;
    name: string;
  };
  socialLinks: {
    youtube?: string;
    telegram?: string;
    vk?: string;
  };
  seoSettings: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// API методы для авторизации
export const authAPI = {
  login: async (identifier: string, password: string) => {
    const response = await api.post('/auth/local', {
      identifier,
      password,
    });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/local/register', {
      username,
      email,
      password,
    });
    return response.data;
  },

  me: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', {
      email,
    });
    return response.data;
  },
};

// API методы для видео
export const videosAPI = {
  getAll: async (params?: { 
    populate?: string;
    filters?: any;
    sort?: string;
    pagination?: { page: number; pageSize: number };
  }) => {
    const response = await api.get('/videos', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/videos/${id}?populate=*`);
    return response.data;
  },

  create: async (data: Partial<Video>) => {
    const response = await api.post('/videos', { data });
    return response.data;
  },

  update: async (id: string, data: Partial<Video>) => {
    const response = await api.put(`/videos/${id}`, { data });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  },

  uploadFile: async (file: File, field: 'thumbnail' | 'videoFile') => {
    const formData = new FormData();
    formData.append('files', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// API методы для категорий
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: Partial<Category>) => {
    const response = await api.post('/categories', { data });
    return response.data;
  },

  update: async (id: string, data: Partial<Category>) => {
    const response = await api.put(`/categories/${id}`, { data });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// API методы для тегов
export const tagsAPI = {
  getAll: async () => {
    const response = await api.get('/tags');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/tags/${id}`);
    return response.data;
  },

  create: async (data: Partial<Tag>) => {
    const response = await api.post('/tags', { data });
    return response.data;
  },

  update: async (id: string, data: Partial<Tag>) => {
    const response = await api.put(`/tags/${id}`, { data });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/tags/${id}`);
    return response.data;
  },
};

// API методы для плейлистов
export const playlistsAPI = {
  getAll: async () => {
    const response = await api.get('/playlists?populate=*');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/playlists/${id}?populate=*`);
    return response.data;
  },

  create: async (data: Partial<Playlist>) => {
    const response = await api.post('/playlists', { data });
    return response.data;
  },

  update: async (id: string, data: Partial<Playlist>) => {
    const response = await api.put(`/playlists/${id}`, { data });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/playlists/${id}`);
    return response.data;
  },
};

// API методы для комментариев
export const commentsAPI = {
  getAll: async (params?: { 
    populate?: string;
    filters?: any;
    sort?: string;
  }) => {
    const response = await api.get('/comments', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/comments/${id}?populate=*`);
    return response.data;
  },

  update: async (id: string, data: Partial<Comment>) => {
    const response = await api.put(`/comments/${id}`, { data });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  moderate: async (id: string, status: 'approved' | 'rejected') => {
    const response = await api.put(`/comments/${id}`, { 
      data: { status } 
    });
    return response.data;
  },
};

// API методы для подписок
export const subscriptionsAPI = {
  getAll: async () => {
    const response = await api.get('/subscriptions');
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  },
};

// API методы для пользователей
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<User>) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// API методы для настроек
export const settingsAPI = {
  get: async () => {
    const response = await api.get('/setting?populate=*');
    return response.data;
  },

  update: async (data: Partial<Settings>) => {
    const response = await api.put('/setting', { data });
    return response.data;
  },
};

// API методы для аналитики
export const analyticsAPI = {
  getStats: async () => {
    const response = await api.get('/analytics/stats');
    return response.data;
  },

  getViews: async (period: 'day' | 'week' | 'month' | 'year') => {
    const response = await api.get(`/analytics/views?period=${period}`);
    return response.data;
  },
};

export default api;