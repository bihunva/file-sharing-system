<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-body p-4">
        <h2 class="mb-4 text-center">Grant admin rights to the user</h2>
        <form @submit.prevent="grantAdmin">
          <div class="form-group mb-3">
            <input v-model="username" type="text" id="username" class="form-control" placeholder="username">
          </div>
          <button type="submit" class="btn btn-primary btn-block">Grant rights</button>
        </form>
        <div v-if="message" class="alert alert-info mt-3">{{ message }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const username = ref('');
    const message = ref('');
    const isAdmin = ref(false);

    onMounted(() => {
      isAdmin.value = localStorage.getItem('is_admin') === 'true';
    });

    const grantAdmin = async () => {
      if (!isAdmin.value) {
        message.value = 'Only admins can grant admin rights.';
        return;
      }

      if (!username.value) {
        message.value = 'Please provide a username.';
        return;
      }

      try {
        const response = await api.grantAdmin(username.value);
        message.value = response.data.message;
        console.log('Admin rights granted:', response.data);
      } catch (err) {
        message.value = 'Failed to grant admin rights: ' + (err.response?.data?.detail || err.message);
      }
    };

    return {
      username,
      message,
      grantAdmin,
      isAdmin
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.card {
  border: none;
}

.card-body {
  padding: 2rem;
}

h2 {
  font-size: 1.5rem;
  color: #333;
}

.form-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-control {
  border-radius: 0.25rem;
  padding: 0.75rem;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.alert {
  margin-top: 1.5rem;
  background-color: #e9f7fd;
  color: #0c5460;
  border: 1px solid #bee5eb;
}
</style>
