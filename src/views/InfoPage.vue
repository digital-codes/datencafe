<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $t("titles.about") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

        <div id="container">
        <!-- use en as default to get length of storylist -->
        <ion-card color="light" v-for="(item,i) in infoItems.en" :key="i">
          <ion-card-header>
            <ion-card-title>{{ infoItem(i,"title") }}</ion-card-title>
            <div class="image">
            <ion-img :src="item.image" :alt="item.alt"></ion-img>
            <ion-label class="attribution">{{item.attribution}}</ion-label>
            </div>
            <ion-card-subtitle>
              {{ infoItem(i,"date") }} 
            </ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            {{ infoItem(i,"body") }}
          </ion-card-content>
        </ion-card>
      </div>


    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue'


// https://lokalise.com/blog/vue-i18n/
// if we need translation inside methods, import this as well:
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })

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

/*
import { CsvLoader } from "../classes/CsvLoader"
try {
  const _nd = new CsvLoader() // should fail without id
} catch (e) {
  console.log("Intentionally failed: ",e.message)
}

const nd = new CsvLoader("P1")
nd.name = "XYZ"
console.log("ID:",nd.id)
console.log("Name:",nd.name)

try {
  nd.id = "17"
} catch (e) {
  console.log("Intentionally failed: ",e.message)
}

nd.run()
nd.run(1,2)

const ev = (a:string,b:number) => {
  console.log("string:",a)
  console.log("number:",b)
  return 2 * b
}

nd.setFunction(ev)
console.log("Node:", nd.json())

let r
r = nd.run("XNKN",5)
console.log("Result:",r)
r = nd.run()
console.log("Result:",r)
r = nd.run(1,2)
console.log("Result:",r)


import { RandomGen } from "../classes/RandomGen"
const rg = new RandomGen("P2")
rg.period = 3
rg.run()
*/


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
