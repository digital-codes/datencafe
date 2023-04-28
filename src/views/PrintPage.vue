<template>
  <ion-page>
    <ion-button class="noprint" @click="back">Back</ion-button>

    <main v-html="parms.content" class="content">
    </main>
  </ion-page>
</template>

<script setup lang="ts">

import { IonButton, IonContent, IonHeader, IonButtons, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue'
import { ref, computed, watch, onMounted, onActivated } from 'vue';
// delay timer
import { DelayTimer } from "@/services/DelayTimer";


import { useRoute } from 'vue-router';
const route = useRoute()
import router from "@/router";

import { PrintStore } from "@/services/PrintStore"
const printStore = PrintStore()

const props = defineProps(
  ["title","content"]
)

const parms = ref ({})
const rdy = ref(false)

onMounted(async () => {
   parms.value = {content: await printStore.get()}
   console.log("Print mounted + loaded")
  rdy.value = true
  if (print) {
    await DelayTimer(100)
    print()
  }
})

onActivated(async () => {
  console.log("PP activated")
})


const back = async () => {
  await router.push({name: 'Workspace'})
}
/*
const parms = computed(() => {
  const c = printStore.get()
  //console.log("content", c.length)
  return {
    content:c
  }
})
*/

/*
watch(
      () => printStore.get,
      (content) => {
        console.log("content", content.length)
      }
    )
*/

</script>

<style scoped>


h2 {
  page-break-before: always;
}

.ion-page {
  overflow: auto;
  display: block;
}

.doclogo {
  width: 50%;
  margin-left:auto;
  margin-right:auto;
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
    overflow:scroll!important;
    position: static!important;
  }
  
  @page {
    size: A4 portrait; /* change to desired paper size and orientation */
    margin: 1cm; /* change to desired margin size */
  }  

  article {
    page-break-after: always;
  }

  .content  {
    width: 100%;
    position: relative;
    display: block;
  }


  h1, h2, h3 {
    text-align: center;
    padding-bottom: 1rem;
  }

  .content  > p {
    padding: 1rem;
    text-justify: inter-word;
  }

  .content  > span {
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
    overflow: auto!important;
    display: block!important;
    left: unset!important;
    right: unset!important;
    top: unset!important;
    bottom: unset!important;
    position: unset!important;
    flex-direction: unset!important;
    contain: unset!important;
    overflow: scroll!important;
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
    position:static;
    contain:unset;
    overflow:scroll;
  }
  :host {
    position:static;
    contain:unset;
    overflow:scroll;
  }

}




</style>
