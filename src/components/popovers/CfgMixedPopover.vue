<template>
  <ion-content class="ion-padding ion-popover">
    <p>{{ $t("flow.cfg.params") }}</p>
    <div>
    <span v-for="(option,idx) in options" :key="option.id">
      <ion-item v-if="option.select">
      <ion-label>{{ option.label }}: </ion-label>
      <ion-select :value="vals[idx]" @ionChange="selUpdate($event.detail.value,option.id,idx)" @ionCancel="cancel">
          <ion-select-option v-for="selOpt in opts[idx]" :key="selOpt">{{selOpt}}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-else>
        <ion-label>{{ option.label }}: </ion-label>
        <ion-input :value="option.value" :min="option.min" :max="option.max" :type="option.type" @ionChange="valUpdate(option.id,idx)" v-model="vals[idx]"></ion-input>
      </ion-item>
    </span>
    <ion-button @click="close">{{$t("flow.cfg.close")}}</ion-button>
    </div>
</ion-content>
</template>

<script lang="ts" setup>
/**
 * handles multiple options
 * returns single item on update  
 * teminates on close (no data)
 * 
 */ 
import { IonContent, IonButton } from '@ionic/vue';
import { IonInput, IonLabel, IonSelect, IonSelectOption, IonCheckbox } from '@ionic/vue';

import { ref, onMounted } from "vue"

import eventBus from '@/services/eventBus';

export interface CfgMixedParms {
    id: string // for translation 
    type: string // ui element type: url, text, number
    label: string // label
    select: boolean
    value?: string | [] // default and return value 
    min?: string // 
    max?: string // 
    current?: string | number
}

const vals = ref([])
const opts = ref([])

const props = defineProps({
  signal:String,
  options: [] as CfgMixedParms[]
})

onMounted(() => {
  props.options.forEach((e) => {
    console.log("Prop:",e.value)
    opts.value.push(e.value)
    vals.value.push(e.current)
  })
})


const selUpdate = async (val,id,idx) => {
  console.log('ev',val,id,idx,vals.value)
  vals.value[idx] = val
  console.log('ev',val,vals.value[idx])
  //await eventBus.emit(props.signal, {id:"close", value:String(val)} as CfgSelectParms);
}


const valUpdate = async (id,idx) => {
  console.log('ev',id,idx,vals.value)
  //const inp = await getInputElement
  //console.log('signal',props.signal)
  //await eventBus.emit(props.signal, {id:id,value:String(vals.value[idx])} as CfgMixedParms);
}

const close = async () => {
  //console.log('close')
  await eventBus.emit(props.signal, {"id":"close","value":JSON.stringify(vals.value)} as CfgMixedParms);
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

