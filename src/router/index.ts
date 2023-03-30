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
        path: '/data',
        component: () => import ('../views/DataPage.vue')
      },
      {
        path: '/instructions',
        component: () => import ('../views/InstructionsPage.vue')
      },
      {
        path: '/stories',
        component: () => import ('../views/StoryPage.vue')
      },
      {
        path: '/work',
        component: () => import ('../views/WorkPage.vue')
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
