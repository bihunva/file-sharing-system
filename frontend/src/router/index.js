import { createRouter, createWebHistory } from 'vue-router';
import Files from '../components/FileList.vue';
import Register from '../components/Register.vue';
import Login from '../components/Login.vue';
import Upload from '../components/UploadFile.vue';
import GrantAdmin from '../components/GrantAdmin.vue';
import Statistics from '../components/UserStatistics.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/files', component: Files },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/upload', component: Upload, meta: { requiresAdmin: true } },
  { path: '/grant-admin', component: GrantAdmin, meta: { requiresAdmin: true } },
  { path: '/statistics', component: Statistics, meta: { requiresAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
    next('/login');
  } else {
    next();
  }
});

export default router;

