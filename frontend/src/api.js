import axios from 'axios';
import router from './router/index.js';

const apiClient = axios.create({
baseURL: 'http://localhost:8000',
headers: {
    'Content-Type': 'application/json'
  }
});

const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  try {
    const response = await apiClient.post('/users/refresh', {}, {
      headers: {
        'Authorization': `Bearer ${refresh_token}`
      }
    });
    localStorage.setItem('access_token', response.data.access_token);
    if (response.data.refresh_token) {
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    return response.data.access_token;
  } catch (error) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
    throw error;
  }
};

apiClient.interceptors.response.use(response => {
  return response;
}, async error => {
  const originalRequest = error.config;

  if (error.response.status === 401 && error.response.data.detail && error.response.data.detail.includes('expired_token') && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshToken();
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      router.push('/login');
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
});

export default {
  register(user) {
    return apiClient.post('/users/register', user);
  },
  login(user) {
    return apiClient.post('/users/login', user);
  },
  refreshToken,
  logout() {
    const refresh_token = localStorage.getItem('refresh_token');
    return apiClient.post('/users/logout', {}, {
      headers: {
        'Authorization': `Bearer ${refresh_token}`
      }
    });
  },
  getAllFiles() {
    const access_token = localStorage.getItem('access_token');
    return apiClient.get('/files', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
  },
  uploadFile(formData) {
    const access_token = localStorage.getItem('access_token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';

    if (!isAdmin) {
      return Promise.reject(new Error('Only admins can upload files.'));
    }

    return apiClient.post('/files/upload/', formData, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  manageFileAccess(username, fileId, action) {
    const access_token = localStorage.getItem('access_token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';

    if (!isAdmin) {
      return Promise.reject(new Error('Only admins can manage file access.'));
    }

    return apiClient.post('/users/file-access/', {
      username,
      file_id: fileId,
      action
    }, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
  },
  deleteFile(fileId) {
    const access_token = localStorage.getItem('access_token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';

    if (!isAdmin) {
      return Promise.reject(new Error('Only admins can delete files.'));
    }

    return apiClient.delete(`/files/delete/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
  },
  grantAdmin(username) {
    const access_token = localStorage.getItem('access_token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';

    if (!isAdmin) {
      return Promise.reject(new Error('Only admins can grant admin rights.'));
    }

    return apiClient.post('/users/grant-admin/', {
      username
    }, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
  },
  getUserStatistics() {
    const access_token = localStorage.getItem('access_token');
    return apiClient.get('/users/user-statistics', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
  },
  downloadFile(fileId) {
    const access_token = localStorage.getItem('access_token');
    return apiClient.get(`/files/download/${fileId}`, {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
  }
};

