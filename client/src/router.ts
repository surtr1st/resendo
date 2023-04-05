import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router';

const LoginOrRegistrate = () => import('./views/LoginOrRegistrate.vue');
const Navigator = () => import('./views/Navigator.vue');
const MainChat = () => import('./views/MainChat.vue');
const GroupChat = () => import('./views/GroupChat.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LoginOrRegistrate,
    name: 'log-or-reg',
  },
  {
    path: '/@chat',
    component: Navigator,
    name: 'navigator',
    children: [
      {
        path: ':id',
        component: MainChat,
        name: 'main-chat',
      },
      {
        path: 'group/:id',
        component: GroupChat,
        name: 'group-chat',
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
