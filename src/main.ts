import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faMugHot } from '@fortawesome/free-solid-svg-icons'
import { faCoffee } from '@fortawesome/free-solid-svg-icons/faCoffee'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe'
import { faLanguage } from '@fortawesome/free-solid-svg-icons/faLanguage'
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons/faGraduationCap'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons/faBookOpen'
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun'
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon'
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons/faCartShopping'
import { faUserSlash } from '@fortawesome/free-solid-svg-icons/faUserSlash'
import { faBookAtlas } from '@fortawesome/free-solid-svg-icons/faBookAtlas'
import { faHatWizard } from '@fortawesome/free-solid-svg-icons/faHatWizard'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons/faWandMagicSparkles'
import { faExpand } from '@fortawesome/free-solid-svg-icons/faExpand'
import { faMagnifyingGlassMinus } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlassMinus'
import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlassPlus'
import { faRocket } from '@fortawesome/free-solid-svg-icons/faRocket'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan'
import { faReceipt } from '@fortawesome/free-solid-svg-icons/faReceipt'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload'
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { faChartArea } from '@fortawesome/free-solid-svg-icons/faChartArea'
import { faDiagramProject } from '@fortawesome/free-solid-svg-icons/faDiagramProject'

import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo'
import { faMessage } from '@fortawesome/free-solid-svg-icons/faMessage'
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment'
import { faList } from '@fortawesome/free-solid-svg-icons/faList'
import { faListCheck } from '@fortawesome/free-solid-svg-icons/faListCheck'
import { faTag } from '@fortawesome/free-solid-svg-icons/faTag'
import { faTags } from '@fortawesome/free-solid-svg-icons/faTags'
import { faHeading } from '@fortawesome/free-solid-svg-icons/faHeading'
import { faTimeline } from '@fortawesome/free-solid-svg-icons/faTimeline'
import { faNewspaper } from '@fortawesome/free-solid-svg-icons/faNewspaper'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons/faPenToSquare'



/* add icons to the library */
library.add(faUserSecret, faTwitter, faMugHot, faCoffee)
library.add(faArrowUp,faArrowDown,faArrowLeft,faArrowRight,faAngleUp,faAngleDown)
library.add(faGlobe, faLanguage, faGraduationCap, faBookOpen, faBookAtlas)
library.add(faBook, faUser, faUserSlash, faHatWizard, faWandMagicSparkles)
library.add(faSun, faMoon, faCartShopping, faChartArea,faDiagramProject)
library.add(faRocket, faStar, faReceipt, faDownload, faUpload,faTrashCan)
library.add(faMagnifyingGlassPlus, faMagnifyingGlassMinus, faExpand,faImage,faQuestion)
library.add(faList, faListCheck, faTag, faTags, faHeading, faTimeline, faNewspaper)
library.add(faPenToSquare, faInfo, faMessage,faComment)


// ----------------
// pinia
import { createPinia  } from 'pinia'
const pinia = createPinia()

/*
import { UserStore, UserInfo } from '@/services/UserStore'
const userStore = UserStore();
*/

// ----------------
// axios
import UserService from '@/services/axios';
const userService = new UserService();



// ----------------
// localisation
import i18n from "./i18n"
/*
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: require('./locales/en.json'),
    de: require('./locales/de.json')
  }
});
*/

// ----------------

const app = createApp(App)

// Use Pinia store in the app
app.use(pinia)
//app.use(pinia as PiniaPlugin)

app.component('font-awesome-icon', FontAwesomeIcon)

// use localization
app.use(i18n)

// 
app.use(IonicVue)
app.use(router);


//app.use(providers)

// axios
//app.use(userService)

/*
router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  // user store
  const userStore = UserStore(pinia)
  console.log("Token:", userStore.exists(),userStore.token())
})
*/

router.isReady().then(() => {
  app.mount('#app');
});
