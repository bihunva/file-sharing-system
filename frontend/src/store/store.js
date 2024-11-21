import { createPinia, defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: !!localStorage.getItem('access_token'),
    isAdmin: localStorage.getItem('is_admin') === 'true',
    username: localStorage.getItem('username') || ''
  }),
  actions: {
    login(data) {
      this.isLoggedIn = true;
      this.isAdmin = data.is_admin;
      this.username = data.username;
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('is_admin', data.is_admin);
      localStorage.setItem('username', data.username);
    },
    logout() {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.username = '';
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('is_admin');
      localStorage.removeItem('username');
    }
  }
});
