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
    <!-- 

    <ion-toolbar>
      <ion-buttons>
        <div  v-for="(item,idx) in cols" :key="idx" class="popwrap">
          <div class="popfield popcheck">
            <ion-checkbox v-model="colsCheck[idx]" @ionChange="chg"></ion-checkbox>
          </div>
          <ion-input class="popfield popinput" type="text" fill="outline" v-model="newCols[idx]" @ionChange="chg">
          </ion-input>
        </div>
    </ion-buttons>
    </ion-toolbar>    
    -->

    <div class="container" v-if="showPreview">
    <table>
      <thead class="pophead">
        <th  v-for="(item,idx) in cols" :key="idx" class="popwrap">
          <div class="popfield popcheck">
            <ion-checkbox v-model="colsCheck[idx]" @ionChange="chg"></ion-checkbox>
          </div>
          <ion-input class="popfield popinput" type="text" fill="outline" v-model="newCols[idx]" @ionChange="chg">
          </ion-input>
        </th>

      </thead>
      <!-- 
        using active/disabled classes we don't neccessarily need the simple header ...
      <thead>
        <th v-for="(name,nidx) in preview.columns" :key="nidx" class="popfield">
            {{ name }}
          </th>
        </thead>
      -->
      <tbody class="popbody">
        <tr v-for="(row, rindex) in preview.values" :key="rindex">
          <td v-for="(col, cindex) in row" :key="cindex"  :class="isActive(cindex)">
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
import  { DataFrame } from 'danfojs/dist/danfojs-browser/src';

import eventBus from '@/services/eventBus';

const props = defineProps({
  msg:String,
  dt: {
    type: DataFrame, 
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
  // we could use .loc to just display selected columns or
  // or use a class to show status 
  preview.value  = props.dt //.loc({columns: activeCols})
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

const isActive = (i) => { 
  return colsCheck.value[i] ? "popfield activeCol" : "popfield disabledCol"
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

.popcheck {
    text-align:center;
  }
  
th.popwrap {
  border: solid 1px #000;
  width:5rem;
}

thead.pophead {
  box-sizing: border-box;
  display:block;
  margin-right:10px;
}

tbody.popbody {
  box-sizing: border-box;
  display:block;
  overflow:scroll;
  max-height: calc(20vh);
}


th.popfield {
  box-sizing: border-box;
  background-color: var(--ion-color-light);
  border:solid 2px var(--ion-color-dark);
}
td.popfield {
  box-sizing: border-box;
  width:5rem;
  border:solid 1px var(--ion-color-dark);
  --padding-bottom: 5px;
  --padding-end: 5px;
  --padding-start: 5px;
  --padding-top: 5px;
}

td.popfield.activeCol {
  background-color:var(--ion-color-light);
}
td.popfield.disabledCol {
  background-color:var(--ion-color-light-shade);
}


ion-input.popfield {
  box-sizing: border-box;
    --background: var(--ion-color-light-tint);
    --padding-bottom: 5px;
    --padding-end: 5px;
    --padding-start: 5px;
    --padding-top: 5px;
  }
  
  

</style>
