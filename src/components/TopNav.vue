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
            </div>
            <div>
            <font-awesome-icon :icon="['fas', 'user-secret']" />
            <font-awesome-icon :icon="['fab', 'twitter']" size="xl" spin/>
            </div>
            <div>
              <ion-toggle @ionChange="changeMode">Mode</ion-toggle>
              <ion-label>Dark</ion-label>
            </div>
            <div>
              <ion-button @click="changeLanguage('en')">English</ion-button>
              <ion-button @click="changeLanguage('de')">Deutsch</ion-button>
              {{ $t("welcome") }}
            </div>
            <ion-tab-button tab="info" href="/info">
            <font-awesome-icon :icon="['fas', 'coffee']" />
            <ion-label>About</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="instructions" href="/instructions">
            <ion-icon :icon="search" />
            <ion-label>Anleitung</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="map" href="/map">
            <font-awesome-icon :icon="['fab', 'twitter']" />
            <ion-label>Karte</ion-label>
          </ion-tab-button>
  
          <ion-tab-button  tab="data" href="/data">
            <font-awesome-icon :icon="['fas', 'user-secret']" />
            <ion-label>Daten</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="viz" href="/viz">
            <ion-icon :icon="search" />
            <ion-label>Anzeige</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-page>
  </template>
  
  <script lang="ts" setup>
    import { IonPage, IonTabs, IonRouterOutlet, 
      IonTabBar, IonTabButton, IonLabel, IonIcon, IonToggle, } from '@ionic/vue';
  
    import { playCircle, radio, library, search } from 'ionicons/icons';

    import { ref } from "vue"
  
    import { IonHeader } from '@ionic/vue';
    import { cafeOutline } from 'ionicons/icons';

    // https://lokalise.com/blog/vue-i18n/
    import { useI18n } from 'vue-i18n'
    const { locale } = useI18n({ useScope: 'global' })

    const changeLanguage = (lang) => {
      console.log("Locale now:",lang)
      locale.value = lang
      // maybe store lang to localstorage 
    };    

    const dark = ref(false)

    const changeMode = () => {
      dark.value = !dark.value
      console.log("Dark :",dark.value)
      document.body.classList.toggle('dark', dark.value);
      // maybe store lang to localstorage 
    };    


  </script>

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
}
.headline {
    padding:10px;
    margin: 10px;
    font-size: 1.5rem;
}
</style>
