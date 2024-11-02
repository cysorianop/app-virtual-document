import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/UserLogin.vue';
import Dashboard from '../pages/UserDashboard.vue';
import 'quasar/dist/quasar.css'; // Importa los estilos de Quasar

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;