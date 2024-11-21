<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-if="userStore.isLoggedIn" class="nav-item ps-0 me-4">
            <router-link class="nav-link" to="/files">Files</router-link>
          </li>
          <li v-if="userStore.isAdmin" class="nav-item me-4">
            <router-link class="nav-link" to="/statistics">Statistics</router-link>
          </li>
          <li v-if="userStore.isAdmin" class="nav-item me-4">
            <router-link class="nav-link" to="/grant-admin">Grant Admin Rights</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li v-if="!userStore.isLoggedIn" class="nav-item me-4">
            <router-link class="nav-link" to="/register">Register</router-link>
          </li>
          <li v-if="!userStore.isLoggedIn" class="nav-item me-4">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li v-if="userStore.isLoggedIn" class="nav-item me-4">
            <span class="nav-link navbar-text username">{{ userStore.username }}</span>
          </li>
          <li v-if="userStore.isLoggedIn" class="nav-item">
            <a @click.prevent="logout" class="nav-link logout-icon"><i class="fas fa-sign-out-alt"></i></a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useUserStore } from '../store/store.js';
import { useRouter } from 'vue-router';
import api from '../api.js';

export default {
  setup() {
    const userStore = useUserStore();
    const router = useRouter();

    const logout = async () => {
      try {
        await api.logout();
        userStore.logout();
        router.push('/login');
      } catch (error) {
        console.error('Failed to logout:', error);
      }
    };

    return { userStore, logout };
  }
};
</script>

<style scoped>
.navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: #ddd !important;
  margin-right: 20px;
}

.nav-link:hover {
  color: #fff !important;
}

.navbar-text.username {
  color: #28a745 !important;
}

.logout-icon {
  cursor: pointer;
}
</style>
