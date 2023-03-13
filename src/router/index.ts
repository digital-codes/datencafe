import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TopNav from '../components/TopNav.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/info'
  },
  {
    path: '/',
    component: TopNav,
    children: [
      {
        path: '',
        redirect: '/info',
      },
      {
        path: '/info',
        component: () => import ('../views/InfoPage.vue')
      },
      {
        path: '/map',
        component: () => import ('../views/MapPage.vue')
      },
      {
        path: '/instructions',
        component: () => import ('../views/InstructionsPage.vue')
      },
      {
        path: '/viz',
        component: () => import ('../views/VizPage.vue')
      },
      {
        path: '/data',
        component: () => import ('../views/DataPage.vue')
        /*
        component: DataPage,
        name: 'msg',
        props: true 
        */
      },
   ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
