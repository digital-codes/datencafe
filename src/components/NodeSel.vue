<template>
    <ion-list class="list">
      <div v-for="(option,idx) in options" :key="option.type" class="item">
      <ion-item v-if="option.implemented">
        <ion-label class="label">
          {{ nodeItem(option.type,"label") }}
        </ion-label>
          <ion-note class="tooltip">
          {{ nodeItem(option.type,"info") }}
          </ion-note>
          <ion-thumbnail slot="start">
            <img :alt='option.type' :src="option.thumb" />
          </ion-thumbnail>
        <ion-checkbox slot="end" v-model="chk[idx]" @ionChange="clk(idx)"></ion-checkbox>
      </ion-item>
    </div>
    </ion-list>
</template>

<script lang="ts" setup>
import { IonContent, IonButton } from '@ionic/vue';
import { IonItem, IonLabel, IonList, IonCheckbox } from '@ionic/vue';
import { IonNote } from '@ionic/vue';

import { ref, onMounted } from "vue"

import eventBus from '../services/eventBus';

const props = defineProps({
  signal:String,
})

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n({ useScope: 'global' })

import nodeTypes from "../assets/nodes/nodeTypes.json"
const nodeItem = (type,id) => {
  const text = nodeTypes[type][locale.value][id]
  return text
}

const options = ref([])

const chk = ref([])
const clk = async (n:number) => {
  console.log("clicked:",n)
  console.log(chk.value[n],options.value[n].type)
  if (chk.value[n]) {
    console.log('signal',props.signal)
    await eventBus.emit(props.signal, options.value[n].type);
  }
}

onMounted(() => {
  Object.keys(nodeTypes).forEach((e,i) => {
    chk.value[i] = false
    options.value[i] = {
      type: e, 
      icon: nodeTypes[e].icon, 
      thumb:nodeTypes[e].thumb,
      implemented:nodeTypes[e].implemented
     }
  })
})

</script>


<style>

ion-buttons {
  /*
  overflow:scroll;
  */
}


/* tooltip here ...
https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_tooltip
*/

.item {
  position: relative;
  overflow: hidden; 
}
.label {
  position: absolute;
  top:0;
  left: 0;
}
.tooltip {
  visibility:hidden;
  overflow: hidden; 
  color: #c00;
  height: 0;
  font-size: 80%;
}
.item:hover .tooltip {
  visibility:visible;
  position: absolute;
  left: 0;
  top: 0;
  background: #ddd;
  width:90%;
  height:100%;
  overflow-wrap: break-word;
  word-break:break-word;
  overflow: clip; 
}


</style>

