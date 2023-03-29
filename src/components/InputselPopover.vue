<template>
  <ion-content class="ion-padding ion-popover">
    <p>{{ props.msg }}</p>
    <ion-button @click="select(0)">A</ion-button>
    <ion-button @click="select(1)">B</ion-button>
</ion-content>
</template>

<script lang="ts" setup>
import { IonContent, IonButton } from '@ionic/vue';

import { ref, onMounted } from "vue"

import eventBus from '../services/eventBus';

const props = defineProps({
  msg:String,
  signal:String
})

const select = async (s:number) => {
  console.log('sel',s)
  console.log('signal',props.signal)
  await eventBus.emit(props.signal, s == 0?"A":"B");
}

</script>


<style>

ion-buttons {
  /*
  overflow:scroll;
  */
}

ion-popover {
  margin:5px;
  --width: auto;
  --height: auto;
  /*
  --width: auto;
  --height: auto;
  --min-width: 200px;
  --min-height: 200px;
  --max-height: calc(100vh - 100px);
  --max-width: calc(100vw - 30px);
  */
}

ion-popover ion-content {
  max-height: calc(80vh - 100px);
  max-width: calc(100vw - 200px);
  overflow: clip;
}

.popcheck {
    text-align:center;
  }
  
  

</style>
