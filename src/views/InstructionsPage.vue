<template>
  <ion-page>
    <ion-header :translucent="true" class="hdr"></ion-header>

    <ion-content :fullscreen="true">

      <div id="container">
        <div v-if="prerelease">
          <span class="prerelease">{{ $t("prerelease") }}</span>
        </div>
      <ion-card color="light" v-for="(item,i) in items.en" :key="i">
          <article>
            <ion-card-header>
            <ion-card-title>{{ getItem(i,"title") }}</ion-card-title>
          </ion-card-header>

          <ion-card-content class="mdWrap">
            <div v-html="getItem(i,'html')" class="tutor">
          </div>

        </ion-card-content>
          </article>
        </ion-card>

    </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue'
import TitleBar from "@/components/TitleBar.vue"

import { inject } from "vue"
const prerelease = inject("prerelease")


/*
id: string // for translation 
    type: string // ui element type: url, text, number
    label: string // label
    value?: any // default and return value 
    min?: any // 
    max?: any // 
*/

// --------------------
 
// https://lokalise.com/blog/vue-i18n/
// if we need translation inside methods, import this as well:
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })

//import items from "../assets/tutor/tutorials.json"
import items from "@/assets/tutor/tutor-md.json"


const getItem = (idx,id) => {
  return items[locale.value][idx][id]
}


</script>

<style>
.tutor {
  margin-left: auto;
  margin-right: auto;
  max-width: 996px;
  text-align: justify;
}

.tutor h5 {
  visibility:hidden;
  display: block;
  position: relative;
  top: -100px; 
  height:0px;
}
/*
.tutor p, .tutor ul {
  text-align: left;
}
*/

.tutor h2, .tutor h3 {
  color: var(--ion-color-primary);
  text-align: center;
  font-size:120%;
  margin-bottom: 1rem;
  font-weight: bold;
}

.tutor h4 {
  color: var(--ion-color-primary);
  text-align: left;
  font-size:120%;
  margin-bottom: .5rem;
}

.tutor p {
  text-align: justify;
}

.tutor ul {
  text-align: left;
}


.tutor img {
  width: 200px;
  height:auto;
  display: block;
}

.tutor li img {
  width:48px;
  height:auto;
  display:inline;
}

.tutor img.large {
  width:200px;
  height:auto;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.tutor img.wide {
  height: 4rem;
  width:auto;
  display:block;
}



@media screen and (max-width: 996px) {

.tutor img {
  width: 100px;
  height:auto;
  display: block;
}

.tutor li img {
  width:32px;
  height:auto;
  display:inline;
}

.tutor img.large {
  width:120px;
  height:auto;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.tutor img.wide {
  height: 3rem;
  width:auto;
  display:block;
}
}
</style>

<style scoped>

ion-header {
  height: 96px;
  z-index: -10;

}

ion-card {
  margin-left: auto;
  margin-right: auto;
  max-width: 996px;

}

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

ion-card-content {
  text-align:left;
}

h2 {
  text-align: center;
}

ion-img {
  height: 150px;
}

ion-label.attribution {
  font-size: 70%;
  color:#444;
  background: #eee;
}

ion-popover.storyPop {
  --offset-y:10px;
}
/*
html.ion-ce.plt-iphone.plt-ios.plt-mobile.plt-mobileweb.ios body.backdrop-no-scroll div#app ion-app.ios.ion-page ion-popover#ion-overlay-2.storyPop.ios.popover-side-right div.popover-viewport ion-content.ion-padding.ion-popover.ios.content-sizing.overscroll.content-ltr

.ion-padding
/html/body/div/ion-app/ion-popover/div/ion-content

*/


</style>


<style>

ion-popover.storyPop ion-content {
  background: #eef;
  --background: #eef;
  --border-radius: 8px;
  line-height: 2rem;
  overflow: clip;
  width: 300px; 
}

</style>
