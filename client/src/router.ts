import { createWebHistory, createRouter } from 'vue-router';

const LoginOrRegistrate = () => import('./views/LoginOrRegistrate.vue');
const ChatApp = () => import('./views/ChatApp.vue');
const Chat = () => import('./views/Chat.vue');

const routes = [
  {
    path: '/',
    component: LoginOrRegistrate,
    name: 'login-or-registrate',
  },
  {
    path: '/chat',
    component: ChatApp,
    name: 'app',
    children: [
      {
        path: '@:userId',
        component: Chat,
        name: 'chat-box',
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
