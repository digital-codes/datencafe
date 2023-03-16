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
        <div  v-for="(item,idx) in cols" :key="idx" class="popwrap">
          <div class="popfield popcheck">
            <ion-checkbox v-model="colsCheck[idx]" @ionChange="chg"></ion-checkbox>
          </div>
          <!-- 
          <ion-label class="popfield" position="stacked" >{{ item }}</ion-label>
          -->
          <ion-input class="popfield popinput" type="text" fill="outline" v-model="newCols[idx]" @ionChange="chg">
          </ion-input>
        </div>
    </ion-buttons>
    </ion-toolbar>    

    <div class="container" v-if="showPreview">
    <table>
      <thead>
        <th v-for="(name,nidx) in preview.columns" :key="nidx" class="popfield">
            {{ name }}
          </th>
        </thead>
      <tbody>
        <tr v-for="(row, rindex) in preview.values" :key="rindex">
          <td v-for="(col, cndex) in row" :key="cndex"  class="popfield">
            {{ col }}
          </td>
        </tr>
      </tbody>
    </table>
    <div ref="tbl"></div>
  </div>

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
const rows = ref([])

const preview = ref()
const showPreview = ref(false)

const chg = async () => {
  console.log('x',colsCheck.value)
  await eventBus.emit('importSelection', {"close":false,"cols":newCols,"checked":colsCheck});
  // update preview table
  const activeCols = []
  colsCheck.value.forEach((e,idx) => {if (e) activeCols.push(cols.value[idx])})
  //console.log("active:",activeCols) 
  preview.value  = props.dt.loc({columns: activeCols})
  //preview.value.print(2)
  //console.log(preview.value.columns,preview.value.values)
}


onMounted(() => {
  preview.value = props.dt
  cols.value = props.dt.columns // copy cols
  newCols.value = JSON.parse(JSON.stringify(props.dt.columns)) // copy to new as well
  props.dt.columns.forEach((i,idx) => {colsCheck.value[idx] = true}) 
  console.log("Cols:",cols.value,colsCheck.value)
  showPreview.value = true
})

const done = async () => {
  await eventBus.emit('importSelection', {"close":true,"cols":newCols,"checked":colsCheck});
}

const  cancel = async () => {
  await eventBus.emit('importSelection', {"close":true,"cols":[],"checked":[]});
}


</script>


<style>

ion-buttons {
  overflow:scroll;
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
  max-height: calc(100vh - 100px);
  max-width: calc(100vw - 200px);
}

.popcheck {
    text-align:center;
  }
  
.popwrap {
  border: solid 1px #000;
}
  
th.popfield {
  background: #ccf;
  width:5rem;
}
td.popfield {
  width:5rem;
}

ion-input.popfield {
    --background: #ccc;
    --padding-bottom: 5px;
    --padding-end: 5px;
    --padding-start: 5px;
    --padding-top: 5px;
    width:5rem;
  }
  
  

</style>
