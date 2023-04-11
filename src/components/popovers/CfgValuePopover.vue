<template>
  <ion-content class="ion-padding ion-popover">
    <p>{{ $t("flow.cfg.params") }}</p>
    <div>
    <span v-for="option in options" :key="option.id">
      <ion-item>
        <ion-label>{{ option.label }}</ion-label>
        <ion-input :value="option.value" :type="option.type" @ionchange="update(event,option.label)"></ion-input>
      </ion-item>
    </span>
    <ion-button @click="close">{{$t("flow.cfg.close")}}</ion-button>
    </div>
</ion-content>
</template>

<script lang="ts" setup>
import { IonContent, IonButton } from '@ionic/vue';
import { IonInput, IonLabel, IonSelect, IonSelectOption, IonCheckbox } from '@ionic/vue';

import { ref, onMounted } from "vue"

import eventBus from '@/services/eventBus';

export interface CfgValueParms {
    id: string // for translation 
    type: string // ui element type: url, text, number
    label: string // label
    value?: any // default and return value 
    min?: any // 
    max?: any // 
}


const props = defineProps({
  signal:String,
  options: [] as CfgValueParms[]
})

const update = async (ev,lbl) => {
  console.log('ev',ev,ev.target,lbl)
  //const inp = await getInputElement
  console.log('signal',props.signal)
  await eventBus.emit(props.signal, "x");
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

