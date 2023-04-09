<template>
  <ion-content class="ion-padding ion-popover">
    <p>{{ props.msg }}</p>
    <div>
    <ion-button v-for="(item,idx) in portBtns" :key="idx" @click="select(item)">{{item}}</ion-button>
    </div>
</ion-content>
</template>

<script lang="ts" setup>
import { IonContent, IonButton } from '@ionic/vue';

import { ref, onMounted } from "vue"

import eventBus from '@/services/eventBus';

const props = defineProps({
  msg:String,
  signal:String,
  ports:{}
})

const portBtns = ref([])

onMounted(() => {
  //console.log("Ports:",props.ports,props.ports.A)
  Object.keys(props.ports).forEach(e => {
    if (!props.ports[e]) {
      console.log("btn:",e)
      portBtns.value.push(e)
    }
  });
  //console.log("Btns:",portBtns.value)
})


const select = async (s:string) => {
  console.log('sel',s)
  console.log('signal',props.signal)
  await eventBus.emit(props.signal, s);
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

