<template>
  <ion-content class="ion-padding ion-popover">
    <p>{{ $t("flow.ctx.actions") }}</p>
    <div>
    <span v-for="option in options" :key="option">
      <ion-button v-if="option=='config'" @click="config">{{$t("flow.ctx.config")}}</ion-button>
      <ion-button v-if="option=='connect'" @click="connect">{{$t("flow.ctx.connect")}}</ion-button>
      <ion-button v-if="option=='download'" @click="connect">{{$t("flow.ctx.download")}}</ion-button>
      <ion-button v-if="option=='remove'" @click="remove">{{$t("flow.ctx.remove")}}</ion-button>
    </span>
    </div>
</ion-content>
</template>

<script lang="ts" setup>
import { IonContent, IonButton } from '@ionic/vue';

import { ref, onMounted } from "vue"

import eventBus from '@/services/eventBus';

const props = defineProps({
  signal:String,
  options: [] as string[]
})

const config = async () => {
  console.log('signal',props.signal)
  await eventBus.emit(props.signal, "config");
}
const download = async () => {
  console.log('signal',props.signal)
  await eventBus.emit(props.signal, "download");
}
const connect = async () => {
  console.log('signal',props.signal)
  await eventBus.emit(props.signal, "connect");
}
const remove = async () => {
  console.log('signal',props.signal)
  await eventBus.emit(props.signal, "remove");
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

ion-content.ion-popover::part(scroll) {
  overflow:clip;
  }


.popcheck {
    text-align:center;
  }
  
  

</style>

