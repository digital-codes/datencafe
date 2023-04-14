<template>
  <ion-content class="ion-padding ion-popover">
    <p>{{ $t("flow.cfg.params") }}</p>
    <div>
    <ion-item>
      <ion-textarea placeholder="Type something here" :auto-grow="true" maxlength=1000 wrap="soft" inputmode="text"
        value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tellus sem, auctor accumsan egestas sed, venenatis at ex. Nam consequat ex odio, suscipit rhoncus orci dictum eget. Aenean sit amet ligula varius felis facilisis lacinia nec volutpat nulla. Duis ullamcorper sit amet turpis sed blandit. Integer pretium massa eu faucibus interdum.">
      </ion-textarea>
  </ion-item>
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
import { IonItem, IonTextarea } from '@ionic/vue';

import { ref, onMounted } from "vue"

import eventBus from '@/services/eventBus';

export interface CfgValueParms {
    id: string // for translation 
    type: string // ui element type: url, text, number
    label: string // label
    value?: string | [] // default and return value 
    min?: string // 
    max?: string // 
}

const vals = ref([])

const props = defineProps({
  signal:String,
  options: [] as CfgValueParms[]
})

onMounted(() => {
  props.options.forEach(e => vals.value.push(e.value))
})

const update = async (id,idx) => {
  console.log('ev',id,idx,vals.value)
  //const inp = await getInputElement
  console.log('signal',props.signal)
  await eventBus.emit(props.signal, {id:id,value:String(vals.value[idx])} as CfgValueParms);
}

const close = async () => {
  //console.log('close')
  await eventBus.emit(props.signal, {"id":"close","value":JSON.stringify(vals.value)} as CfgValueParms);
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

