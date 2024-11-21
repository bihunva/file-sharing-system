<template>
  <div class="container mt-5">
    <h1 class="mb-4 text-center">Files</h1>

    <FileUploadForm @file-uploaded="fetchFiles" @message="handleMessage" />

    <div v-if="message" class="alert alert-info mt-3">{{ message }}</div>

    <div v-if="files.length">
      <table class="table table-striped table-bordered">
        <thead class="thead-dark">
          <tr>
            <th scope="col">File Name</th>
            <th scope="col" style="width: 15%;" class="text-center" v-if="isAdmin">Uploaded By</th>
            <th scope="col" style="width: 15%;" class="text-center" v-if="isAdmin">Download Count</th>
            <th scope="col" class="text-center" style="width: 20%;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in files" :key="file.id">
            <td><i class="file-icon fas fa-file-alt fa-lg me-2"></i> {{ file.filename }}</td>
            <td class="text-center" v-if="isAdmin">{{ file.owner_username }}</td>
            <td class="text-center" v-if="isAdmin">{{ file.download_count }}</td>
            <FileActions :fileId="file.id" :filename="file.filename" :isAdmin="isAdmin" @file-deleted="handleFileDeleted" @message="handleMessage" />
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="alert alert-info text-center">
      No files available.
    </div>
  </div>
</template>

<script>
import api from '../api';
import FileUploadForm from './FileUploadForm.vue';
import FileActions from './FileActions.vue';

export default {
  components: {
    FileUploadForm,
    FileActions
  },
  data() {
    return {
      files: [],
      isAdmin: false,
      message: ''
    };
  },
  async created() {
    this.isAdmin = localStorage.getItem('is_admin') === 'true';
    await this.fetchFiles();
  },
  methods: {
    async fetchFiles() {
      try {
        const response = await api.getAllFiles();
        this.files = response.data;
        console.log(response.data);
      } catch (error) {
        console.error('Failed to fetch files:', error);
      }
    },
    handleFileDeleted(fileId) {
      this.files = this.files.filter(file => file.id !== fileId);
    },
    handleMessage(msg) {
      this.message = msg;
    }
  }
};
</script>

<style scoped>

</style>
