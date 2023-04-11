<template>
  <ion-content class="ion-padding ion-popover">
    <p>{{ $t("flow.cfg.params") }}</p>
    <div>
      <span>
        <ion-label>{{ props.options.label }}</ion-label>
        <ion-select @ionChange="update($event.detail.value)" @ionCancel="cancel">
          <ion-select-option v-for="option in props.options.value" :key="option">{{option}}</ion-select-option>
        </ion-select>
      </span>
      <!-- 
      <ion-button @click="close">{{$t("flow.cfg.close")}}</ion-button>
      -->
    </div>
</ion-content>
</template>

<script lang="ts" setup>
import { IonContent, IonButton } from '@ionic/vue';
import { IonInput, IonLabel, IonSelect, IonSelectOption, IonCheckbox } from '@ionic/vue';

import { ref, onMounted } from "vue"

import eventBus from '@/services/eventBus';

export interface CfgSelectParms {
    id: string // for translation 
    type?: string // ui element: value input (url, text, number), select input , math operator (+,-,*,/), log operator (<,>,==,!=), switch
    label: string // label
    value: string | [] // [select options] or [result]     min?: any // 
  }


const props = defineProps({
  signal:String,
  options: {} as CfgSelectParms
})

const update = async (val) => {
  //console.log('ev',val)
  await eventBus.emit(props.signal, {id:"close", value:String(val)} as CfgSelectParms);
}

const cancel = async () => {
  //console.log('cancel')
  await eventBus.emit(props.signal, {"id":"cancel","value":""} as CfgSelectParms);
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

