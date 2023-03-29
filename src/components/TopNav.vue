  <script lang="ts" setup>
    import { IonPage, IonTabs, IonRouterOutlet, 
      IonTabBar, IonTabButton, IonLabel, IonToggle,
      IonSelect, IonSelectOption, } from '@ionic/vue';
  
    import { ref } from "vue"
  
    import { IonHeader } from '@ionic/vue';

    // stores
    import { langStore } from '../services/store'
    import { Language } from '../services/store'
    const language = langStore()

    import { themeStore } from '../services/store'
    import { Modes } from '../services/store'
    const theme = themeStore()

  // globals
  import { Version } from "../services/GlobalDefs"



    // https://lokalise.com/blog/vue-i18n/
    import { useI18n } from 'vue-i18n'
    const { locale, availableLocales } = useI18n({ useScope: 'global' })

    /*
    const changeLanguage = (lang) => {
      language.set(lang as Language)
      locale.value = language.get()
      //console.log("Lang store:",language.get())
    };    
    */
    const langSel = ref(locale.value)
    const selectLanguage = () => {
      //console.log("L:",langSel.value)
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

<template>
  <ion-page>
    <ion-tabs>
      <ion-header :translucent="true">
      </ion-header>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="top" class="navbar">
          <div class="title">
          <font-awesome-icon class="logo" icon="fa-solid fa-mug-hot" size="2x" :style="{ color: 'red' }" />
          <span class="headline">Datencafe</span>
          <span class="version">{{Version}}</span>
          </div>
          <!-- 

          <div>
          <font-awesome-icon :icon="['fas', 'user-secret']" />
          <font-awesome-icon :icon="['fab', 'twitter']" size="xl" spin/>
          </div>
          -->
          <div>
            <ion-item>
              <ion-label class="modeLbl left">{{ $t("light") }}</ion-label>
              <ion-toggle @ionChange="changeMode" :checked="false"></ion-toggle>
              <ion-label class="modeLbl right">{{ $t("dark") }}</ion-label>
            </ion-item>
          </div>
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
          <!-- 
          <div>
            {{ $t("welcome") }}
          </div>
          -->
        <ion-tab-button tab="info" href="/info">
          <font-awesome-icon :icon="['fas', 'coffee']" />
          <ion-label>{{ $t("tabs.about") }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="viz" href="/stories">
          <font-awesome-icon :icon="['fas', 'book-open']" />
          <ion-label>{{ $t("tabs.stories") }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="map" href="/map">
          <font-awesome-icon :icon="['fas', 'book-atlas']" />
          <ion-label>{{ $t("tabs.map") }}</ion-label>
        </ion-tab-button>

        <ion-tab-button  tab="data" href="/data">
          <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" />
          <ion-label>{{ $t("tabs.data") }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="instructions" href="/instructions">
          <font-awesome-icon :icon="['fas', 'graduation-cap']" />
          <ion-label>{{ $t("tabs.tutorial") }}</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>



<style scoped>
.navbar {
    padding-left:1rem;
    padding-right:1rem;
}
.logo {
    display: inline-block;
}
.title {
    padding:10px;
    margin: 10px;
    margin-right: auto;
    display: inline-flex;
    align-items: baseline;
}
.headline {
    padding:10px;
    margin: 10px;
    margin-right: 0;
    padding-right: 0;
    font-size: 1.5rem;
}
.version {
  padding:5px;
  margin: 5px;
  font-size: 1rem;
}
.modeLbl {
  width: 3.5rem;
}
.modeLbl.left {
  text-align: right;
}
.modeLbl.right {
  text-align: left;
}
</style>
