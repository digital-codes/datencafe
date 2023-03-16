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

/* add icons to the library */
library.add(faUserSecret, faTwitter, faMugHot, faCoffee)
library.add(faArrowUp,faArrowDown,faArrowLeft,faArrowRight)

// ----------------
// pinia
import { createPinia } from 'pinia'
const pinia = createPinia()
// persist
import piniaPersist from 'pinia-plugin-persist'
pinia.use(piniaPersist)
// ----------------


const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(IonicVue)
app.use(router);

// Use Pinia store in the app
app.use(pinia)



router.isReady().then(() => {
  app.mount('#app');
});