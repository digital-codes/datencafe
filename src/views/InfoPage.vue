<template>
  <ion-page>
    <TitleBar :title='$t("titles.about")' thumb="coffee"/>

    <ion-content :fullscreen="true">

        <div id="container">
        <!-- use en as default to get length of storylist -->


        <ion-card color="light" v-for="(item,i) in infoItems.en" :key="i">
          <article>
            <ion-card-header>
            <ion-card-title>{{ infoItem(i,"title") }}</ion-card-title>
            <div class="image">
            <ion-img :src="item.image" :alt="item.alt"></ion-img>
            <ion-label class="attribution">{{item.attribution}}</ion-label>
            </div>
            <ion-card-subtitle>
              <p>{{ infoItem(i,"date") }} </p>
              <a v-if='infoItem(i,"link") > ""' :href='infoItem(i,"link")' target="_blank" >{{ infoItem(i,"link")  }}</a>
            </ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            {{ infoItem(i,"body") }}
          </ion-card-content>
          </article>
        </ion-card>

      </div>


    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonLabel, IonTitle, IonToolbar } from '@ionic/vue';
import { IonList, IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue'

import TitleBar from "@/components/TitleBar.vue"

// https://lokalise.com/blog/vue-i18n/
// if we need translation inside methods, import this as well:
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })

import { marked } from "marked"
import * as DOMPurify from 'dompurify'


import infoItems from "../assets/info/infoItems.json"
const infoItem = (idx,id) => {
  //console.log(idx,id,locale.value)
  //console.log(storyItems[locale.value])
  const text = infoItems[locale.value][idx][id]
  return text
}

// ----------------------------------------------

/*
// text utils
import {StringUtils} from "../services/StringUtils"

StringUtils.bestMatch("abc",["abd","cbc","cbd"])
StringUtils.compare("abc","cbc")


*/



</script>

<style>
@media print {
  article {page-break-after: always;}
}
</style>
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
