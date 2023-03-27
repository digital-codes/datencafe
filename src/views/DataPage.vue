<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Data</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-grid fixed="true">
          <ion-row>
            <ion-col size="7">
              Flow
              <CytoFlow msg="Flow demo" />
            </ion-col>
            <ion-col size="5" sytle="overflow-y:scroll;">
              Viz
              <DanfoPlot :propItems="items"/>
            </ion-col>
          </ion-row>
          </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonCol, IonGrid, IonRow } from '@ionic/vue';
import CytoFlow from '../components/CytoFlow.vue'
import DanfoPlot from '../components/DanfoPlot.vue'
import { ref } from "vue"

// items
const items = ref([
])

/*
const items = ref([
{id:"P1","name":"sskdmk",type:"chart"},
{id:"P2","name":"cwe",type:"table"}
])

const update = () => {
  items.value.push(
      {
        id:"P" + String(items.value.length),
        "name":"cwe",
        type:"table"
      }
    )
    console.log("Items:",items.value.length)
    setTimeout(update, 2000)    
  }

setTimeout(update, 2000)
*/

import { RandomGen } from "../classes/RandomGen"
const rg = new RandomGen("P2")
rg.period = 3
rg.run()

// globals
import { Signals } from "../services/GlobalDefs"
// listener
import { LinePlot } from "../classes/LinePlot"
const lp1 = new LinePlot("P1")
lp1.name = "fkwenfj"
// add to items
items.value.push(
      {
        id:lp1.id,
        name:lp1.name,
        type:"chart"
      }
    )
// tell listener to listen to source
lp1.msgOn(Signals.UPDPREFIX + rg.id)
// 
import { BarPlot } from "../classes/BarPlot"
const lp2 = new BarPlot("P2")
lp2.name = "32rfewe"
// add to items
items.value.push(
      {
        id:lp2.id,
        name:lp2.name,
        type:"table"
      }
    )
// tell listener to listen to source
lp2.msgOn(Signals.UPDPREFIX + rg.id)



//////////////


</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  min-height:50%;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}

ion-grid {
    --ion-grid-width: 100%;
  }

</style>


