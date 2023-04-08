<template>
  <ion-page>
    <TitleBar :title='$t("titles.tutorial")' />

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
      <ion-card color="light" v-for="(s,i) in items.en" :key="i">
        <ion-card-header>
          <ion-card-title>{{ item(i,"title") }}</ion-card-title>
          <ion-card-subtitle>{{ item(i,"date") }}, {{ item(i,"author") }}, 
            <a :href='"mailto:" +  item(i,"email")'>{{ item(i,"email") }}</a>
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          {{ item(i,"body") }}
        </ion-card-content>
      </ion-card>
    </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue'
import TitleBar from "@/components/TitleBar.vue"

import { ref, onMounted, onBeforeMount, computed } from "vue"
 
// https://lokalise.com/blog/vue-i18n/
// if we need translation inside methods, import this as well:
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })

import items from "../assets/tutor/tutorials.json"
const item = (idx,id) => {
  //console.log(idx,id,locale.value)
  //console.log(storyItems[locale.value])
  const text = items[locale.value][idx][id]
  return text
}

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

.image {
  background-color: #ddd;
  opacity:.8;
  padding: 1rem;
  margin-top:1rem;

}


ion-img {
  height: 150px;
}

ion-label.attribution {
  font-size: 70%;
  color:#444;
  background: #eee;
}


</style>
