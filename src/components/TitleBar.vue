<template>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-buttons slot="start">
          <div class="title">
            <!-- 
            <font-awesome-icon class="logo" icon="fa-solid fa-mug-hot" size="2x" :style="{ color: 'red' }" />
            -->
            <ion-thumbnail  class="logo" >
              <img alt="Daten.Cafe Logo" src="/img/logo/datencafe.svg" />
            </ion-thumbnail>
            <font-awesome-icon :icon="thumb" size="xl" class="ion-hide-md-down"/>
            <font-awesome-icon :icon="thumb" size="1x" class="ion-hide-md-up"/>
            <div>
          <span class="headline ion-hide-sm-down">Daten.Cafe</span>
          <span class="version ion-hide-sm-down">{{Version}}</span>
            </div>
          </div>
          </ion-buttons>

          <ion-buttons slot="end">
          <div>
              <ion-item>
                <!-- 
                <ion-label class="modeLbl left">{{ $t("light") }}</ion-label>
                -->
                <font-awesome-icon :icon="['fas', 'sun']" size="1x" class="modeLbl left"/>
                <ion-toggle @ionChange="changeMode" :checked="false"></ion-toggle>
                <font-awesome-icon :icon="['fas', 'moon']" size="1x" class="modeLbl right"/>
                <!-- 
                <ion-label class="modeLbl right">{{ $t("dark") }}</ion-label>
                -->
              </ion-item>
            </div>
          </ion-buttons>

        <ion-buttons slot="end">
            <div>
              <font-awesome-icon :icon="['fas', 'globe']" size="xl"/>
              <!-- 
              <ion-button @click="changeLanguage('en')">EN</ion-button>
              <ion-button @click="changeLanguage('de')">DE</ion-button>
              -->
            </div>
            
            <ion-list>
              <ion-item>
                <ion-select placeholder="Lang" interface="popover" @ionChange="selectLanguage" v-model="langSel">
                  <ion-select-option v-for="(l,idx) in availableLocales" :key="idx" :value="l">{{upper(l)}}</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>          
          </ion-buttons>

          <ion-buttons slot="end">
            <div v-if="userStore.exists()">
              <font-awesome-icon :icon="['fas', 'user']" size="1x" class="token"/>
            </div>
            <div v-else>
              <font-awesome-icon :icon="['fas', 'user-slash']" size="1x" class="notoken"/>
            </div>          
          </ion-buttons>
            
          <ion-buttons slot="end">
            <ion-menu-button :auto-hide="true" color="primary"></ion-menu-button>
          </ion-buttons>

        </ion-toolbar>
      <ion-toolbar class="ion-hide-sm-up toolbar-secondary">
        <div class="smallheader">
            <span class="headline-secondary">Daten.Cafe</span>
          </div>
      </ion-toolbar>
      </ion-header>
   
  </template>
  
  <script setup lang="ts">
  import { IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/vue';
  import { IonLabel, IonToggle,  IonImage, IonThumbnail, IonSelect, IonSelectOption, } from '@ionic/vue';
  import { ref, computed, onMounted } from "vue"

    // stores
    // user store
    import { UserStore, UserInfo } from '../services/UserStore'
    const userStore = UserStore()

    import { langStore } from '../services/UserStore'
    import { Language } from '../services/UserStore'
    const language = langStore()

    import { themeStore } from '../services/UserStore'
    import { Modes } from '../services/UserStore'
    const theme = themeStore()

    // globals
    import { Version } from "../services/GlobalDefs"

    const props = defineProps({
    title:String,
    thumb:String
  })


    // https://lokalise.com/blog/vue-i18n/
    import { useI18n } from 'vue-i18n'
    const { locale, availableLocales } = useI18n({ useScope: 'global' })

const thumb = ref(['fas', 'question'])
    // init store on mount
    onMounted(() => {
      //userStore.clear()
      selectLanguage()
      thumb.value = (props.thumb === undefined)? ['fas', 'question'] : ['fas', props.thumb]
      console.log(props,"Icon:",thumb.value)

    })

    /*
    const changeLanguage = (lang) => {
      language.set(lang as Language)
      locale.value = language.get()
      //console.log("Lang store:",language.get())
    };    
    */
    const langSel = ref(locale.value)
    const selectLanguage = () => {
      console.log("L:",langSel.value)
      language.set(langSel.value as Language)
      locale.value = language.get()

    }

    const upper = (s) => s.toUpperCase()

    // theme switch
    const dark = ref(false)

    const changeMode = () => {
      dark.value = !dark.value
      theme.set((dark.value? Modes.Dark : Modes.Light))
      if (theme.get() == Modes.Dark) {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')

      }
      // document.body.classList.toggle('dark', (theme.get() == Modes.Dark));
    };    



  </script>
  
<style scoped>
.navbar {
    padding-left:1rem;
    padding-right:1rem;
}

.title {
  padding:0;
  margin:0;
  padding-left:10px;
  margin-left: 10px;
  margin-right: auto;
  display: inline-flex;
  align-items: center;
}

ion-thumbnail.logo {
  --size:96px;
}

/* sm is 576, md is 768 */
@media only screen and (max-width: 768px) {
  .title {
    padding-left:0;
    margin-left:0;
  }

  ion-thumbnail.logo {
    --size:48px;
  }
}


.hamburger {
  margin:0;
  padding:0;
  margin-right:10px;
  padding-right:10px;
}
.headline {
    padding:10px;
    margin: 10px;
    margin-right: 0;
    padding-right: 0;
    font-size: 1.5rem;
    font-weight: 500;
    color: red;
}
.headline-secondary {
    padding:0px;
    margin: 0px;
    font-size: 1.5rem;
    font-weight: 500;
    color: red;
}
.version {
  padding:5px;
  margin: 5px;
  font-size: 1rem;
}
/* with with text: 3.5rem */
.modeLbl {
  width: 1.5rem;
}
.modeLbl.left {
  text-align: right;
}
.modeLbl.right {
  text-align: left;
}

.token {
  color: var(--ion-color-primary);
}

.notoken {
  color: var(--ion-color-warning-shade);
}

.toolbar-secondary {
  height: 48px;
}
.smallheader {
  text-align:center;
  padding-bottom: 10px;
  /*
  z-index:10;
  margin-top: 1rem;
  border-bottom: solid 2px var(--ion-color-primary);
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
  */
}
</style>
  