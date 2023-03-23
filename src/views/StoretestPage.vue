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


        <div v-if="loaded">
          data plot
          <ShowPlot :data="data" />
        </div>


      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonButton } from '@ionic/vue';

import ShowPlot from "../components/ShowPlot4.vue";
import ShowTable from "../components/ShowTable2.vue";


import { providerStore } from '../services/srcStore'
import { Client, Provider } from '../services/srcStore'
const providers = providerStore()

import { subscriberStore } from '../services/dstStore'
import { Subscriber } from '../services/dstStore'
const subscribers = subscriberStore()

import { watch, computed } from 'vue'


import * as dfd from 'danfojs/dist/danfojs-browser/src';
import * as io from "danfojs/dist/danfojs-base/io/browser"

import { ref, onMounted } from "vue"

const loaded = ref(false)
const data = ref([])

// const updates = computed(() => subscribers..find(todo => todo.id === todoId))

const itemUpdate = ref(0)

const sid = "S1"
const pid = "P1"

// const todo = computed(() => store.todos.find(todo => todo.id === todoId))
/*
const upd = computed(() => subscribers.items.find(item => item.id === pid))
watch(upd, (b,a) => {
  console.log(`Global upated changed from ${b} to ${a}`)
  if (subscribers.updateVal(sid) != itemUpdate.value) {
    console.log("Sub updated:",sid)
    itemUpdate.value = subscribers.updateVal(sid)
    if (itemUpdate.value != 0) {
      const dt = providers.getDataById(pid)
      console.log("updated with DT:",dt)
      data.value = new dfd.DataFrame(dt)
      loaded.value = true;
    } else {
      data.value = new dfd.DataFrame()
      loaded.value = false;
    }
  }
})
*/

/* event based */
import eventBus from '../services/eventBus';

//   await eventBus.emit('importSelection', {"close":false,"cols":newCols,"checked":colsCheck});



/*  works ** 
watch(() => subscribers.updated, (b,a) => {
  console.log(`Global upated changed from ${b} to ${a}`)
  if (subscribers.updateVal(sid) != itemUpdate.value) {
    console.log("Sub updated:",sid)
    itemUpdate.value = subscribers.updateVal(sid)
    if (itemUpdate.value != 0) {
      const dt = providers.getDataById(pid)
      console.log("updated with DT:",dt)
      data.value = new dfd.DataFrame(dt)
      loaded.value = true;
    } else {
      data.value = new dfd.DataFrame()
      loaded.value = false;
    }
  }
} //, { deep: true }
)
 */

 /* works as well with explicit message. maybe easier */
onMounted(async () => {
  const evnt = "UPD-" + sid
  eventBus.on(evnt, () => {
      console.log("update for:",evnt)
      console.log("Sub updated:",sid)
      if (subscribers.updateVal(sid) != 0) {
        const dt = providers.getDataById(pid)
        console.log("updated with DT:",dt)
        data.value = new dfd.DataFrame(dt)
        loaded.value = true;
      } else {
        data.value = new dfd.DataFrame()
        loaded.value = false;
      }
    })
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
.iframe {
  width: 600px;
  max-height:300px;
}
</style>
