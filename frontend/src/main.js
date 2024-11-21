import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import * as Popper from '@popperjs/core';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

import { BootstrapVue3 } from 'bootstrap-vue-3';

const app = createApp(App);
const pinia = createPinia();

app.use(BootstrapVue3);
app.use(router);
app.use(pinia);

app.mount('#app');




