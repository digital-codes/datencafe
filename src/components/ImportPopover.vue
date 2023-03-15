<template>
  <ion-content class="ion-padding ion-popover">
  <!-- 
    <p>{{ props.msg }}</p>
    <ion-segment :value="cols[0]" v-model="seg1" @ionChange="newSeg1">
        <ion-segment-button v-for="(item,idx) in cols" :key="idx" :value="item">
        <ion-label>{{ item }}</ion-label>
        </ion-segment-button>
    </ion-segment>    
  -->
    <p>{{ props.msg }}</p>
    <ion-button @click="done">OK</ion-button>
    <ion-button @click="cancel">Cancel</ion-button>
    <ion-toolbar>
      <ion-buttons>
        <div  v-for="(item,idx) in cols" :key="idx" >
          <ion-label class="popfield" position="stacked" >{{ item }}</ion-label>
          <ion-input class="popfield" type="text" fill="outline" v-model="newCols[idx]" >
          </ion-input>
          <div class="popfield">
            <ion-checkbox v-model="colsCheck[idx]" ></ion-checkbox>
          </div>
        </div>
    </ion-buttons>
    </ion-toolbar>    
  </ion-content>
</template>

<script lang="ts" setup>
import { IonContent } from '@ionic/vue';
import { defineComponent } from 'vue';

import { IonLabel, IonToolbar, IonInput, IonButton, IonButtons, IonCheckbox } from '@ionic/vue';


import { ref, onMounted } from "vue"
import * as dfd from 'danfojs/dist/danfojs-browser/src';

import eventBus from '../services/eventBus';

const props = defineProps({
  msg:String,
  dt: {
    type: dfd.DataFrame, 
    required: true,
  },
})

const cols = ref([])
const newCols = ref([])
const colsCheck = ref([])

onMounted(() => {
  cols.value = props.dt.columns // copy cols
  newCols.value = JSON.parse(JSON.stringify(props.dt.columns)) // copy to new as well
  props.dt.columns.forEach((i,idx) => {colsCheck.value[idx] = true}) 
  console.log("Cols:",cols.value,colsCheck.value)
})

const done = async () => {
  await eventBus.emit('importSelection', {"cols":newCols,"checked":colsCheck});

}

const  cancel = async () => {
  await eventBus.emit('importSelection', {"cols":[],"checked":[]});

}


</script>


<style>
ion-popover {
  --width: auto;
  --height: auto;
  width: auto !important;
  height: auto !important;
  /*
  max-width: calc(100vw - 30px);
  max-height: calc(100vh - 30px);
  */
}

ion-popover ion-content {
  --max-height: calc(100vh - 100px);
}

ion-popover {
  height: 1.5rem;
  text-align:left;
  padding:3px;
  margin:3px;

}

ion-input.popfield {
    --background: #ccc;
    --padding-bottom: 5px;
    --padding-end: 5px;
    --padding-start: 5px;
    --padding-top: 5px;
  }
  

</style>
