<template>
  <td class="text-center">
    <div class="btn-group">
      <button @click="handleDownload" class="btn btn-link p-0 me-3">
        <i class="fas fa-download fa-lg text-primary"></i>
      </button>
      <button v-if="isAdmin" @click="showModal = true" class="btn btn-link p-0 me-3">
        <i class="fas fa-user-shield fa-lg text-info"></i>
      </button>
      <button v-if="isAdmin" @click="showDeleteConfirm = true" class="btn btn-link p-0">
        <i class="fas fa-trash-alt fa-lg text-danger"></i>
      </button>
    </div>

    <!-- Modal for Delete Confirmation -->
    <div v-if="showDeleteConfirm" class="modal-backdrop show"></div>
    <div v-if="showDeleteConfirm" class="modal d-block" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header border-0">
            <button type="button" class="btn-close" @click="closeDeleteConfirm" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="mb-5">Are you sure you want to delete <strong>{{ filename }}</strong>?</p>
            <div class="d-flex justify-content-center">
              <button @click="confirmDelete" class="btn btn-danger me-2">Delete</button>
              <button @click="closeDeleteConfirm" class="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Modal for Managing Access -->
    <div v-if="showModal" class="modal-backdrop show"></div>
    <div v-if="showModal" class="modal d-block" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog modal-m modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h6 class="modal-title">Manage Access for <strong>{{ filename }}</strong></h6>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="toggleAccess">
              <div class="mb-3">
                <input v-model="username" type="text" class="form-control" id="username" placeholder="Username"
                       required>
              </div>
              <div class="mb-3">
                <select v-model="action" class="form-select" id="action" required>
                  <option value="grant">Grant access</option>
                  <option value="revoke">Revoke access</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary mt-3">Submit</button>
            </form>
            <div v-if="message" class="alert alert-info mt-3">{{ message }}</div>
          </div>
        </div>
      </div>
    </div>

  </td>
</template>

<script>
import api from '../api';
import {ref} from 'vue';

export default {
  props: {
    fileId: {
      type: Number,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {emit}) {
    const username = ref('');
    const action = ref('grant');
    const message = ref('');
    const showModal = ref(false);
    const showDeleteConfirm = ref(false);

    const handleDownload = async () => {
      try {
        const response = await api.downloadFile(props.fileId);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition && contentDisposition.includes('filename=')) {
          const filename = contentDisposition.split('filename=')[1].replace(/"/g, '');
          link.setAttribute('download', filename);
        } else {
          link.setAttribute('download', `file_${props.fileId}`);
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Failed to download file:', error);
      }
    };

    const confirmDelete = async () => {
      if (!props.isAdmin) {
        message.value = 'Only admins can delete files.';
        return;
      }

      try {
        const response = await api.deleteFile(props.fileId);
        emit('message', response.data.message);
        emit('file-deleted', props.fileId);
        message.value = 'File deleted successfully.';
        showDeleteConfirm.value = false;
        console.log('File deleted:', response.data);
      } catch (error) {
        message.value = 'Failed to delete file: ' + (error.response?.data?.detail || error.message);
        console.error('Failed to delete file:', error);
      }
    };

    const toggleAccess = async () => {
      if (!props.isAdmin) {
        message.value = 'Only admins can manage access.';
        return;
      }

      try {
        const response = await api.manageFileAccess(username.value, props.fileId, action.value);
        message.value = response.data.message;
        console.log('Access managed:', response.data);
      } catch (error) {
        message.value = 'Failed to manage access: ' + (error.response?.data?.detail || error.message);
        console.error('Failed to manage access:', error);
      }
    };

    const closeDeleteConfirm = () => {
      showDeleteConfirm.value = false;
      message.value = '';
    };

    const closeModal = () => {
      showModal.value = false;
      username.value = '';
      action.value = 'grant';
      message.value = '';
    };

    return {
      username,
      action,
      message,
      showModal,
      showDeleteConfirm,
      handleDownload,
      confirmDelete,
      toggleAccess,
      closeModal,
      closeDeleteConfirm
    };
  }
};
</script>

<style scoped></style>
