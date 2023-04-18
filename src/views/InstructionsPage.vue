<template>
  <ion-page>
    <TitleBar :title='$t("titles.tutorial")' thumb="receipt"/>

    <ion-content :fullscreen="true">

      <div id="container">
        <!-- 
        <ion-button @click="testVPop">VPop</ion-button>
        <ion-button @click="testSPop">SPop</ion-button>
        <ion-button @click="testStoryPop">StoryPop</ion-button>
        -->

        <ion-card color="light" v-if="mdLoaded">
        <article>
        <ion-card-content class="mdWrap">
          <div v-html="getMd" class="tutor">
        </div>
        </ion-card-content>
      </article>
      </ion-card>

      <!-- 
      <ion-card color="light" v-for="(s,i) in items.en" :key="i">
        <article>
        <ion-card-header>
          <ion-card-title>{{ item(i,"title") }}</ion-card-title>
          <ion-card-subtitle>{{ item(i,"date") }}, {{ item(i,"author") }}, 
            <a :href='"mailto:" +  item(i,"email")'>{{ item(i,"email") }}</a>
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          {{ item(i,"body") }}
        </ion-card-content>
      </article>
      </ion-card>

      -->
    </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue'
import TitleBar from "@/components/TitleBar.vue"


// ------- testing ----
import { popoverController } from '@ionic/vue';
import CfgValuePop from "@/components/popovers/CfgValuePopover.vue"
import CfgValueParms from "@/components/popovers/CfgValuePopover.vue"

import CfgSelectPop from "@/components/popovers/CfgSelectPopover.vue"
import CfgSelectParms from "@/components/popovers/CfgSelectPopover.vue"

import StoryPop from "@/components/popovers/StoryPopover.vue"

import { marked } from "marked"
import * as DOMPurify from 'dompurify'

import eventBus from '@/services/eventBus';
const cfgSignal = "cfgsig"
/*
id: string // for translation 
    type: string // ui element type: url, text, number
    label: string // label
    value?: any // default and return value 
    min?: any // 
    max?: any // 
*/
const p1:CfgValueParms  = {
  id:"cfg1",
  type:"url",
  label:"url 123",
  value:"abc"
}
const p2:CfgValueParms  = {
  id:"cfg2",
  type:"number",
  label:"number 3",
  value:3
}

const popover = ref()

async function testVPop() {
  console.log("test pop")
  const options = [p1,p2] as CfgValueParms[]
  const pop = await openVPop(options)
  console.log("pop done:",pop)
}

const openVPop = async (options: any) => {
  console.log("Open Pop")
  popover.value = await popoverController.create({
      component: CfgValuePop,
      //event: ev,
      size: "auto",
      side:"right",
      alignment:"start",
      showBackdrop: true,
      backdropDismiss: true, 
      dismissOnSelect: false,
      reference: "trigger", // event or trigger
      componentProps: { // Popover props
          signal: cfgSignal,
          options:options
        }
    })
    await popover.value.present();
    popover.value.open = true
    const x = await popover.value.onDidDismiss();
    console.log("Dismiss: ",x)
    popover.value.open = false
    return x
}

async function testSPop() {
  console.log("test s pop")
  const options = {id:"sel1","label":"Operator:",value:["+","-","*","/"],current:"-"} as CfgSelectParms
  const pop = await openSPop(options)
  console.log("pop done:",pop)
}

const openSPop = async (options: any) => {
  console.log("Open Pop")
  popover.value = await popoverController.create({
      component: CfgSelectPop,
      //event: ev,
      size: "auto",
      side:"right",
      alignment:"start",
      showBackdrop: true,
      backdropDismiss: true, 
      dismissOnSelect: false,
      reference: "trigger", // event or trigger
      componentProps: { // Popover props
          signal: cfgSignal,
          options:options
        }
    })
    await popover.value.present();
    popover.value.open = true
    const x = await popover.value.onDidDismiss();
    console.log("Dismiss: ",x)
    popover.value.open = false
    return x
}

async function testStoryPop() {
  console.log("test story pop")
  const pop = await openStoryPop()
  console.log("pop done:",pop)
}

const openStoryPop = async () => {
  console.log("Open Pop")
  popover.value = await popoverController.create({
      component: StoryPop,
      //event: ev,
      size: "cover",
      side:"left",
      cssClass:"storyPop",
      alignment:"start",
      showBackdrop: true,
      backdropDismiss: true, 
      dismissOnSelect: false,
      reference: "trigger", // event or trigger
      componentProps: { // Popover props
          signal: cfgSignal,
        }
    })
    await popover.value.present();
    popover.value.open = true
    const x = await popover.value.onDidDismiss();
    console.log("Dismiss: ",x)
    popover.value.open = false
    return x
}


eventBus.on(cfgSignal, (data) => {
      console.log("on cfg:",data)
      switch (data.id) {
        case "close":        
          popover.value.dismiss(data,"button")
          break
        case "cancel":
          popover.value.dismiss(data,"backdrop")
          break
        default:
      }
    });


// --------------------


import { ref, onMounted, onBeforeMount, computed } from "vue"
 
// https://lokalise.com/blog/vue-i18n/
// if we need translation inside methods, import this as well:
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })

//import items from "../assets/tutor/tutorials.json"
import mdTutor from "../assets/tutor/tutorials-md.json"

/*
const mdItem = (idx,id) => {
  //console.log(idx,id,locale.value)
  //console.log(storyItems[locale.value])
  const text = mdItems[locale.value][idx][id]
  return text
}
*/
const mdContent = ref({en:"",de:""})
const mdLoaded = ref(false)
onMounted(async () => {
  const langs = Object.keys(mdTutor)
  for (const l of langs ) {
    console.log("Lang:",l)
    const htmlRaw = await marked.parse(mdTutor[l])
    mdContent.value[l] = await DOMPurify.sanitize(htmlRaw);
    //console.log(mdContent.value[l])
  }
  mdLoaded.value = true
})

const getMd = computed(()=>{
  return mdContent.value[locale.value]
})

</script>

<style>

/* try to compensate fixed header */
/*
.tutor h3.anchor {
    display: block;
    position: relative;
    top: 250px;
    visibility: hidden;
}

target works, but is initially visible, hidden only after first click
:target {
  display: block;
  position: relative;
  top: -120px; 
  visibility: hidden;
}

use h5 hidden with underscore

*/
/* */

.tutor h5 {
  visibility:hidden;
  height:0px;
}
.tutor #stories_ {
  display: block;
  position: relative;
  top: -100px; 
  visibility: hidden;
}
.tutor #tutorial_ {
  display: block;
  position: relative;
  top: -100px; 
  visibility: hidden;
}
.tutor #workspace_ {
  display: block;
  position: relative;
  top: -100px; 
  visibility: hidden;
}



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

.tutor {
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
