<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Data</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ul>
          <li v-for="(t,i) in titles" :key="i">
            <h3>{{ $t(titles[i]) }}</h3>
            <h3>{{ $t(bodies[i]) }}</h3>
          </li>
        </ul>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonButton } from '@ionic/vue';

import { ref, onMounted, onBeforeMount } from "vue"
 
// https://lokalise.com/blog/vue-i18n/
import { useI18n } from 'vue-i18n'

//const stories = ref([1,2,3])
const loaded = ref(false)
const data = ref([])

const titles = ref([] as string[])
const bodies = ref([] as string[])


onBeforeMount(async () => {
  for (let i=0;i<3;i++){
    titles.value.push("stories[" + String(i) + "].title")
    bodies.value.push("stories[" + String(i) + "].body")
  }
  console.log(titles)
  console.log(bodies)
  return
  }
)


</script>

<style scoped>
#container {
  text-align: center;
  margin:10px;
  /*
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  */
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}

</style>
