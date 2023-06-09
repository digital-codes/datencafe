import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
// globals
import { Signals } from "@/services/GlobalDefs";
import eventBus from "@/services/eventBus";


import Home from '@/views/InfoPage.vue';
// maybe this helps with printing
import Print from '@/views/PrintPage.vue';
// don't load pages which use pinia here. only in below
//import WorkPage from '@/views/WorkPage.vue';

//import PrintPage from "@/views/PrintPage.vue"


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
    path: '/print',
    name: 'PrintPage',
    component: () => import('@/views/PrintPage.vue')
  }  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

/*
router.afterEach((to, from) => {
  console.log("from-to",from.name,to.name)
  if ((from.name == "Stories") && (to.name == "Workspace")) {
    console.log("check story condition")
    const st = () => {
      console.log("Story trigger from router")
        eventBus.emit(Signals.TRIGGERSTORY);
    }
    setTimeout(st, 1000)
  }
})
*/

export default router
