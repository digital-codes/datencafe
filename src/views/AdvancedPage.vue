<template>
  <ion-page>
    <TitleBar :title='$t("titles.advanced")' thumb="rocket"/>

    <ion-content :fullscreen="true">
      <div id="container">
        <!-- use en as default to get length of storylist -->
        <ion-card color="light" v-for="(s,i) in storyItems.en" :key="i">
          <article>
          <ion-card-header>
            <ion-card-title>{{ storyItem(i,"title") }}</ion-card-title>
            <ion-card-subtitle>{{ storyItem(i,"date") }}, {{ storyItem(i,"author") }}, 
              <a :href='"mailto:" +  storyItem(i,"email")'>{{ storyItem(i,"email") }}</a>
            </ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            {{ storyItem(i,"body") }}
          </ion-card-content>
        </article>
        </ion-card>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonButton } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue'
import TitleBar from "@/components/TitleBar.vue"

import { ref, onMounted, onBeforeMount, computed } from "vue"
 
// https://lokalise.com/blog/vue-i18n/
// if we need translation inside methods, import this as well:
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })

import storyItems from "../assets/stories/stories.json"
const storyItem = (idx,id) => {
  //console.log(idx,id,locale.value)
  //console.log(storyItems[locale.value])
  const text = storyItems[locale.value][idx][id]
  return text
}


const clicked = (id,msg) => {
  alert(String(id) + "..." + t("notimplemented"))
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

</style>
