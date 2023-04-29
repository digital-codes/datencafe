<template>
  <ion-page>
    <ion-button class="noprint" @click="back">Back</ion-button>
    <ion-button class="noprint" :disabled="noprint" @click="printFunc">Print</ion-button>

    <main v-html="parms.content" class="content"></main>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonButtons,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from "@ionic/vue";
import { ref, computed, watch, onMounted, onActivated } from "vue";
// delay timer
import { DelayTimer } from "@/services/DelayTimer";

import { useRoute } from "vue-router";
import router from "@/router";

import { PrintStore } from "@/services/PrintStore";
const printStore = PrintStore();

const noprint = ref(true)

onMounted(() => {
  if (print) 
    noprint.value = false
})

const printFunc = async () => {
  await DelayTimer(100)
  print()
}

const parms = computed(() => {
  const c = printStore.get()
  console.log("content", c.length)
  return {
    content:c
  }
})

/* NO
const parms = ref({});
watch(
  () => printStore.get,
  (content) => {
    parms.value = { content: printStore.get() };
    console.log("content", content.length);
  }
);
*/

const back = async () => {
  await router.push({ name: "Workspace" });
};


</script>

<style scoped>
h2 {
  page-break-before: always;
}

.ion-page, .ion-page.dark {
  overflow: auto;
  display: block;
  color:#000;
    background:#fff;
    --ion-background-color: #fff;
    --ion-background-color-rgb: 255,255,255;
    --ion-text-color: #000;
    --ion-text-color-rgb: 0,0,0;
    --ion-border-color: #ccc;
}

.doclogo {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}

.docimg {
  width: 20%;
}


</style>

<style>
@media print {
  /*

img {
  margin-left: auto;
  margin: ;
  margin-right: auto;
  display: block;
  width: 80%;
  border-radius: 30px;
}

.content  {
  width: 100%;
  position: relative;
  display: block;
}


h2 {
  text-align: center;
  padding-bottom: 1rem;
}

.content  > p
  padding: 4rem;
  text-justify: inter-word;
}

  */

  .noprint {
    display: none;
  }

  body {
    overflow: scroll !important;
    position: static !important;
  }

  body.dark {
    color:#000;
    background:#fff;
    --ion-background-color: #fff;
    --ion-background-color-rgb: 255,255,255;
    --ion-text-color: #000;
    --ion-text-color-rgb: 0,0,0;
    --ion-border-color: #ccc;
  }


  @page {
    size: A4 portrait; /* change to desired paper size and orientation */
    margin: 1cm; /* change to desired margin size */
  }

  article {
    page-break-after: always;
  }

  .content {
    width: 100%;
    position: relative;
    display: block;
  }

  h1,
  h2,
  h3 {
    text-align: center;
    padding-bottom: 1rem;
  }

  .content > p {
    padding: 1rem;
    text-justify: inter-word;
  }

  .content > span {
    padding-left: 1rem;
    padding-right: 1rem;
    text-justify: inter-word;
    border: solid 2px #888;
  }

  img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    page-break-inside: avoid;
  }

  .ion-page {
    overflow: auto !important;
    display: block !important;
    left: unset !important;
    right: unset !important;
    top: unset !important;
    bottom: unset !important;
    position: unset !important;
    flex-direction: unset !important;
    contain: unset !important;
    overflow: scroll !important;
  }

  .doclogo {
    width: 20%;
    padding-bottom: 2rem;
  }

  .docimg {
    width: 70%;
    border-radius: 30px;
    page-break-inside: avoid;
  }

  ion-router-outlet {
    position: static;
    contain: unset;
    overflow: scroll;
  }
  :host {
    position: static;
    contain: unset;
    overflow: scroll;
  }
}
</style>
