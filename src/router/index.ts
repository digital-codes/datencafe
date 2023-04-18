import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

import Home from '@/views/InfoPage.vue';
// maybe this helps with printing
import Print from '@/views/PrintPage.vue';
// don't load pages which use pinia here. only in below
//import WorkPage from '@/views/WorkPage.vue';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/info'
  },
  {
    name: "Info",
    path: '/info',
    component: Home // () => import ('@/views/InfoPage.vue')
  },
  {
    name: "Data",
    path: '/open',
    component: () => import('@/views/DataPage.vue')
  },
  {
    name: "Instructions",
    path: '/instructions',
    component: () => import('@/views/InstructionsPage.vue')
  },
  {
    name: "Stories",
    path: '/stories',
    component: () => import('@/views/StoryPage.vue')
  },
  {
    name: "Login",
    path: '/login',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    name: "Workspace",
    path: '/work',
    component: () => import ('@/views/WorkPage.vue'),
  },
  {
    name: "Advanced",
    path: '/advanced',
    component: () => import ('@/views/AdvancedPage.vue'),
  },
  {
    name: "Print",
    path: '/print',
    component: Print,
    // add some meta info
    meta: {icon:"fa-priint",label:"Print"}
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router
