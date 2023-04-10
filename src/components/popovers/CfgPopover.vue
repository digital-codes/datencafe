<template>
  <ion-content class="ion-padding ion-popover">
    <p>{{ $t("flow.cfg.params") }}</p>
    <div>
    <span v-for="option in options" :key="option.id">
      <ion-item>
        <ion-label>{{ option.label }}</ion-label>
        <ion-input v-if="(option.type=='url')||(option.type=='text')||(option.type=='number')" :value="option.value" :type="option.type"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>{{ option.label }}</ion-label>
        <ion-select v-if="(option.type=='math')" :value="option.value" >
          <ion-select-option value="plus">+</ion-select-option>
          <ion-select-option value="minus">-</ion-select-option>
          <ion-select-option value="mult">*</ion-select-option>
          <ion-select-option value="div">/</ion-select-option>
        </ion-select>
      </ion-item>
      <!-- 
      <ion-button v-if="option=='config'" @click="config">{{$t("flow.ctx.config")}}</ion-button>
      <ion-button v-if="option=='connect'" @click="connect">{{$t("flow.ctx.connect")}}</ion-button>
      <ion-button v-if="option=='download'" @click="connect">{{$t("flow.ctx.download")}}</ion-button>
      <ion-button v-if="option=='remove'" @click="remove">{{$t("flow.ctx.remove")}}</ion-button>
      -->
    </span>
    </div>
</ion-content>
</template>

<script lang="ts" setup>
import { IonContent, IonButton } from '@ionic/vue';
import { IonInput, IonLabel, IonSelect, IonSelectOption, IonCheckbox } from '@ionic/vue';

import { ref, onMounted } from "vue"

import eventBus from '@/services/eventBus';

export interface CfgSimpleParms {
    id: string // for translation 
    type: string // ui element: value input (url, text, number), select input , math operator (+,-,*,/), log operator (<,>,==,!=), switch
    label: string // label
    value?: any // default and return value 
    min?: any // 
    max?: any // 
}


const props = defineProps({
  signal:String,
  options: [] as CfgSimpleParms[]
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

