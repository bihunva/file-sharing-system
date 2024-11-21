<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-body p-4">
        <form @submit.prevent="register">
          <div class="form-group mb-3">
            <input v-model="username" type="text" id="username" class="form-control" placeholder="Choose a username">
          </div>
          <div class="form-group mb-4">
            <input v-model="password" type="password" id="password" class="form-control" placeholder="Create a password">
          </div>
          <button type="submit" class="btn btn-primary btn-block">Register</button>
        </form>
        <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
        <div class="mt-3 text-center">
          <router-link to="/login">Already have an account? Login here</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api.js';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: null
    };
  },
  methods: {
    async register() {
      try {
        const response = await api.register({ username: this.username, password: this.password });
        console.log('User registered:', response.data);
        this.$router.push('/login');
      } catch (err) {
        this.error = err.response.data.detail.message;
      }
    }
  }
};
</script>

<style scoped>
.card {
  max-width: 500px;
  margin: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 2rem;
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.form-control {
  border-radius: 0.25rem;
  padding: 0.75rem;
}

.text-center {
  margin-top: 1.5rem;
}

.alert {
  margin-top: 1.5rem;
}
</style>
