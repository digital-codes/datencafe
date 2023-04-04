<template>
  <ion-content class="ion-padding ion-popover">
    <p>{{ props.msg }}</p>
    <ion-list class="list">
      <div v-for="(option,idx) in options" :key="option.type" class="item">
      <ion-item >
        <ion-label class="label">
          {{ nodeItem(option.type,"label") }}
        </ion-label>
          <ion-note class="tooltip">
          {{ nodeItem(option.type,"info") }}
          </ion-note>
          <ion-thumbnail slot="start">
            <img :alt='option.type' :src="option.thumb" />
          </ion-thumbnail>
        <!-- 
        <font-awesome-icon :icon="option.icon" size="xl" slot="start"></font-awesome-icon>
        -->
        <ion-checkbox slot="end" v-model="chk[idx]" @ionChange="clk(idx)"></ion-checkbox>
      </ion-item>
    </div>
    </ion-list>
</ion-content>
</template>

<script lang="ts" setup>
import { IonContent, IonButton } from '@ionic/vue';
import { IonItem, IonLabel, IonList, IonCheckbox } from '@ionic/vue';
import { IonNote } from '@ionic/vue';

import { ref, onMounted } from "vue"

import eventBus from '../services/eventBus';

const props = defineProps({
  msg:String,
  signal:String,
  controller: Object
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
    options.value[i] = {type: e, icon: nodeTypes[e].icon, thumb:nodeTypes[e].thumb }
  })
})

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
  
  .list {
  max-height: 200px;
  max-width: 400px;
  overflow-x:hide;
  overflow-y: scroll;
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

