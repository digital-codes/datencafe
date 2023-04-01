import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TopNav from '../components/TopNav.vue';


export const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/info'
  },
  {
    path: '/',
    component: TopNav,
    children: [
      {
        name:"Info",
        path: '',
        redirect: '/info',
      },
      {
        name:"Info",
        path: '/info',
        component: () => import ('../views/InfoPage.vue')
      },
      {
        name:"Data",
        path: '/data',
        component: () => import ('../views/DataPage.vue')
      },
      {
        name:"Instructions",
        path: '/instructions',
        component: () => import ('../views/InstructionsPage.vue')
      },
      {
        name:"Stories",
        path: '/stories',
        component: () => import ('../views/StoryPage.vue')
      },
      {
        name:"Login",
        path: '/login',
        component: () => import ('../views/LoginPage.vue')
      },
      {
        name:"Workspace",
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
