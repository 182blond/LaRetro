import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Board from '@/pages/Board.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/board', component: Board }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
