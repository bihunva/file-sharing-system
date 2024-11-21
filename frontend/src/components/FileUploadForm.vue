<template>
  <div v-if="isAdmin" class="mb-4 d-flex align-items-center">
    <button type="button" class="btn btn-primary mr-3" @click="uploadFile">Upload</button>
    <div :class="{'file-drop-area': true, 'dragging': dragging}" @dragover.prevent="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop" @click="triggerFileInput">
      <span class="file-drop-message">{{ file ? file.name : 'Drag & drop your file here or select to upload' }}</span>
      <input type="file" class="form-control-file file-input" @change="onFileChange" ref="fileInput" />
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      file: null,
      isAdmin: false,
      message: '',
      dragging: false
    };
  },
  async created() {
    this.isAdmin = localStorage.getItem('is_admin') === 'true';
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    handleDrop(event) {
      event.preventDefault();
      this.dragging = false;
      this.file = event.dataTransfer.files[0];
    },
    handleDragOver(event) {
      event.preventDefault();
      this.dragging = true;
    },
    handleDragLeave(event) {
      event.preventDefault();
      this.dragging = false;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async uploadFile() {
      if (!this.isAdmin) {
        this.message = 'Only admins can upload files.';
        return;
      }

      if (!this.file) {
        this.message = 'Please select a file to upload.';
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', this.file);

        const response = await api.uploadFile(formData);
        this.$emit('file-uploaded');
        this.$emit('message', `File "${this.file.name}" uploaded successfully.`);
        this.file = null;
        console.log('File uploaded:', response.data);
      } catch (err) {
        if (err.response && err.response.status === 422) {
          this.message = 'Unprocessable Entity: ' + (err.response.data.detail || err.message);
        } else {
          this.message = 'Failed to upload file: ' + (err.response?.data?.detail || err.message);
        }
        console.error('Failed to upload file:', err);
      }
    }
  }
};
</script>

<style scoped>
.file-drop-area {
  border: 2px dashed #007bff;
  border-radius: 4px;
  padding: 5px 10px;
  text-align: center;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease, background-color 0.3s ease;
  cursor: pointer;
  flex: none;
  white-space: nowrap;
  width: auto;
}

.file-drop-area.dragging {
  background-color: #e0f7fa;
  border-color: #004d40;
}

.file-drop-area:hover {
  border-color: #0056b3;
  background-color: #e9ecef;
}

.file-drop-message {
  font-size: 1rem;
  color: #007bff;
}

.file-input {
  display: none;
}

.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.mr-3 {
  margin-right: 1rem;
}
</style>

