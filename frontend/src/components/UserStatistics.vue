<template>
  <div class="container-md mt-5">
    <div class="content">
      <h2 class="mb-4 text-center">Statistics</h2>
      <div v-if="!isAdmin" class="alert alert-danger text-center">
        Only admins can access this page.
      </div>
      <div v-else>
        <table class="table table-borderless table-striped">
          <thead class="thead-dark">
            <tr>
              <th>Username</th>
              <th>Is Admin</th>
              <th>Download Count</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.username" :class="{ 'current-user': user.username === currentUser }">
              <td>{{ user.username }}</td>
              <td>{{ user.is_admin ? 'Yes' : 'No' }}</td>
              <td>{{ user.download_count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="message" class="alert alert-info mt-3">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import api from '../api';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const users = ref([]);
    const message = ref('');
    const isAdmin = ref(false);
    const currentUser = ref(localStorage.getItem('username'));

    onMounted(async () => {
      isAdmin.value = localStorage.getItem('is_admin') === 'true';

      if (isAdmin.value) {
        try {
          const response = await api.getUserStatistics();
          users.value = response.data;
        } catch (err) {
          message.value = 'Failed to fetch users stats: ' + (err.response?.data?.detail || err.message);
        }
      }
    });

    return {
      users,
      message,
      isAdmin,
      currentUser
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
}

.content {
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background-color: #f8f9fa;
}

h2 {
  font-size: 1.8rem;
  color: #333;
  font-weight: bold;
}

.table {
  width: 100%;
  margin-top: 1rem;
}

.thead-dark th {
  background-color: #343a40;
  color: #fff;
}

.current-user {
  font-weight: bold;
  background-color: #f0f4c3;
  color: #ff9800;
}

.alert {
  margin-top: 1.5rem;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}
</style>
