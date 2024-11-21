<template>
  <div>
    <h1>Upload File</h1>
    <div v-if="!isAdmin">
      Only admins can upload files.
    </div>
    <div v-else>
      <form @submit.prevent="uploadFile">
        <div>
          <label for="file">Choose file</label>
          <input type="file" id="file" @change="onFileChange">
        </div>
        <button type="submit">Upload</button>
      </form>
      <div v-if="message">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import api from '../api';
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const file = ref(null);
    const message = ref('');
    const isAdmin = ref(false);

    onMounted(() => {
      isAdmin.value = localStorage.getItem('is_admin') === 'true';
    });

    const onFileChange = (event) => {
      file.value = event.target.files[0];
    };

    const uploadFile = async () => {
      if (!isAdmin.value) {
        message.value = 'Only admins can upload files.';
        return;
      }

      if (!file.value) {
        message.value = 'Please select a file to upload.';
        return;
      }

      try {
        const response = await api.uploadFile(file.value);
        message.value = response.data.message;
        console.log('File uploaded:', response.data);
      } catch (err) {
        message.value = 'Failed to upload file: ' + (err.response?.data?.detail || err.message);
      }
    };

    return {
      file,
      message,
      onFileChange,
      uploadFile,
      isAdmin
    };
  }
};
</script>
