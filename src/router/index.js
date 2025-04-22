import { createRouter, createWebHistory } from 'vue-router';
import { useSessionStore } from '@/stores/session';
import Login from '@/pages/Login.vue';
import Board from '@/pages/Board.vue';
import General from '@/pages/General.vue';

function extractBoardFromPath(path) {
  const match = path.match(/\/(board|general)\/([^/]+)/);
  return match?.[2] || '';
}

const routes = [
  { path: '/login/:sessionId?', name: 'Login', component: Login },
  { path: '/board/:sessionId', name: 'Board', component: Board },
  { path: '/general/:sessionId', component: General },
  { path: '/', redirect: { name: 'Login' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const session = useSessionStore();

  const isPublic = to.name === 'Login';
  const hasSession = session.username && session.boardName;

  if (!isPublic && !hasSession) {
    // Try to extract sessionId from route
    const fallbackBoardName = to.params.sessionId || to.params.boardId || extractBoardFromPath(to.path);

    next({
      name: 'Login',
      params: { sessionId: fallbackBoardName || '' }
    });
  } else {
    next();
  }
});

export default router;
