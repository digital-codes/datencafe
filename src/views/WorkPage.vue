
<script setup lang="ts">
import { IonButton, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonCol, IonGrid, IonRow } from '@ionic/vue';
import { ref, onMounted } from "vue"
import { createAnimation } from '@ionic/vue';
import { defineAsyncComponent } from 'vue';

import TitleBar from "@/components/TitleBar.vue"

const message = ref('Hello, World!');

const FlowLoading = ref(true)
//const ShowLoading = ref(true)

const WorkFlowAsync = defineAsyncComponent({
  // A factory function that returns a Promise that resolves to
  // the component definition.
  loader: () => import('../components/WorkFlow.vue').then((module) => {
    console.log('Cyto loaded');
    // Update the ref when the async loading is complete
    FlowLoading.value = false
    return module;
  })
});
//import WorkFlow from '../components/WorkFlow.vue'

const addViz = (event) => {
  console.log("Add:",event)
  items.value.unshift(event) //push(event)
}

const delViz = (id) => {
  console.log("Del:",id)
  console.log("Items before:",items.value,items.value.length)
  const idx = items.value.findIndex((e) => e.id == id)
  if (idx == -1)
    throw(new Error("Invalid id"))
  console.log("idx:",idx)
  items.value.splice(idx,1)
  console.log("Items after:",items.value,items.value.length)
}

/*
const DanfoPlotAsync = defineAsyncComponent({
  // A factory function that returns a Promise that resolves to
  // the component definition.
  loader: () => import('../components/DanfoPlot.vue').then((module) => {
    console.log('Danfo loaded');
    // Update the ref when the async loading is complete
    ShowLoading.value = false
    return module;
  })
});
*/
import DanfoPlot from '../components/DanfoPlot.vue'



// items
const items = ref([])

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

// globals
import { Signals } from "../services/GlobalDefs"
// listener
import { LinePlot } from "../classes/LinePlot"
import { BarPlot } from "../classes/BarPlot"
import { DataInfo } from "../classes/DataInfo"
import { RandomGen } from "../classes/RandomGen"

onMounted(() => {

  /*
  const rg = new RandomGen("P1")
  rg.period = 10
  rg.cols = 5
  rg.run()

  const chart1 = new LinePlot("P2")
  chart1.name = "fkwenfj"
  // add to items
  items.value.unshift(
        {
          id:chart1.id,
          name:chart1.name,
          type:"chart"
        }
      )
  // tell listener to listen to source
  chart1.msgOn(Signals.UPDPREFIX + rg.id)
  // 
  const chart2 = new BarPlot("P3")
  chart2.name = "32rfewe"
  // add to items
  items.value.unshift(
        {
          id:chart2.id,
          name:chart2.name,
          type:"chart"
        }
      )
  // tell listener to listen to source
  chart2.msgOn(Signals.UPDPREFIX + rg.id)

  // 
  const chart3 = new DataInfo("P4")
  chart3.name = "32r Info fewe"
  // add to items
  items.value.unshift(
        {
          id:chart3.id,
          name:chart3.name,
          type:"table"
        }
      )
  // tell listener to listen to source
  chart3.msgOn(Signals.UPDPREFIX + rg.id)
        */
})

const content = ref()

const scrollToBottom = () => {
  // Passing a duration to the method makes it so the scroll slowly
  // goes to the bottom instead of instantly
  content.value.$el.scrollToBottom(500);
}
const scrollToTop = () => {
  // Passing a duration to the method makes it so the scroll slowly
  // goes to the top instead of instantly
  content.value.$el.scrollToTop(500);
}

</script>

<template>
  <ion-page>
    <TitleBar :title='$t("titles.work.tab")' />

    <ion-content :fullscreen="true" ref="content">
      <ion-header collapse="condense">
          <ion-title size="large">{{ $route.params.id }}</ion-title>
      </ion-header>
      <div id="container" class="work-container">
        <ion-grid fixed="true">
          <ion-row>

            <ion-col size="12" size-lg="7">
              <div class="headline">
              <h3>{{$t("titles.work.flow")}}
              </h3>
              <ion-button color="warning" class="scroll-btn ion-hide-lg-up" @click="scrollToBottom()">
                <font-awesome-icon class="scroll-icon" aria-hidden="true" :icon="['fas', 'angle-down']"  />
                <font-awesome-icon class="scroll-icon" aria-hidden="true" :icon="['fas', 'chart-area']"  />
              </ion-button>
              </div>


              <p v-if="FlowLoading" class="loading">Loading ...</p>
              <WorkFlowAsync msg="Flow demo" @add-viz="(e) => addViz(e)" @del-viz="(e) => delViz(e)" />
            </ion-col>

            <ion-col  size="12" size-lg="5" sytle="overflow-y:scroll;">
              <h3>{{$t("titles.work.view.title")}}</h3>
              <p v-if="FlowLoading"  class="loading">Loading ...</p>
              <!-- 
              <DanfoPlotAsync :propItems="items"/>
              -->
              <DanfoPlot :propItems="items"/>

              <ion-button color="warning" expand="block" class="scroll-btn ion-hide-lg-up" @click="scrollToTop()">
                <font-awesome-icon class="scroll-icon" aria-hidden="true" :icon="['fas', 'angle-up']"  />
                <font-awesome-icon class="scroll-icon" aria-hidden="true" :icon="['fas', 'diagram-project']"  />
              </ion-button>
            </ion-col>

          </ion-row>
          </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

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

ion-col {
  border: 1px solid #ccc;
  border-radius: 5px;
  min-height:200px;
}

.loading {
  border: 2px solid var(--ion-color-danger);
  animation: blink-animation 1s steps(3, start) infinite;
  -webkit-animation: blink-animation 1s steps(3, start) infinite;
}  
@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
@-webkit-keyframes blink-animation {
  to {
    visibility: hidden;
  }
}

.work-container {
  padding-left:.6rem;
  padding-right:.6rem;
  }
@media only screen and (max-width: 996px) {
  .work-container {
    transform: translateY(-20%)!important;
  }
}



ion-button {
  font-size: 1rem;
  margin-top: 16px;
  margin-bottom: 10px;
  font-weight: 500;
  line-height: 1.2;  
}
.scroll-icon {
  padding-left:.5rem;
  padding-right:.5rem;
}

.headline h3 {
  display:inline-block;
}
.headline ion-button {
  display:block;
  float:right;
}

</style>


