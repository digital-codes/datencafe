
<script setup lang="ts">
import { IonButton, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonCol, IonGrid, IonRow, IonPopup } from '@ionic/vue';
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


// globals
import { Signals } from "../services/GlobalDefs"
// listener
import { LinePlot } from "../classes/LinePlot"
import { BarPlot } from "../classes/BarPlot"
import { DataInfo } from "../classes/DataInfo"
import { RandomGen } from "../classes/RandomGen"


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
  <ion-page >
    <TitleBar :title='$t("titles.work.tab")'  thumb="wand-magic-sparkles"/>

    <ion-content :fullscreen="true" ref="content">
    
    <div id="container" class="container work-container">
        <ion-grid fixed="true">
          <ion-row>

            <ion-col size="12" size-lg="7" class="flowArea">
              <section>
                <div class="headline">
                <h3>{{$t("titles.work.flow")}}
                </h3>
                <ion-button v-if="!FlowLoading"  id="scrollBottomRef" color="warning" class="scroll-btn ion-hide-lg-up" @click="scrollToBottom()">
                  <font-awesome-icon class="scroll-icon" aria-hidden="true" :icon="['fas', 'angle-down']"  />
                  <font-awesome-icon class="scroll-icon" aria-hidden="true" :icon="['fas', 'chart-area']"  />
                </ion-button>
                </div>


                <p v-if="FlowLoading" class="loading">Loading ...</p>
                <WorkFlowAsync msg="Flow demo" @add-viz="(e) => addViz(e)" @del-viz="(e) => delViz(e)" />
                </section>
            </ion-col>

            <ion-col  size="12" size-lg="5" sytle="overflow-y:scroll;" id="viz"  class="chartArea">
            <section>
              <h3>{{$t("titles.work.view.title")}}</h3>
              <p v-if="FlowLoading"  class="loading">Loading ...</p>
              <!-- 
              <DanfoPlotAsync :propItems="items"/>
              -->
              <DanfoPlot :propItems="items"/>

              <ion-button v-if="!FlowLoading"  id="scrollTopRef" color="warning" expand="block" class="scroll-btn ion-hide-lg-up" @click="scrollToTop()">
                <font-awesome-icon class="scroll-icon" aria-hidden="true" :icon="['fas', 'angle-up']"  />
                <font-awesome-icon class="scroll-icon" aria-hidden="true" :icon="['fas', 'diagram-project']"  />
              </ion-button>
              </section>
            </ion-col>

          </ion-row>
          </ion-grid>
      </div>
    </ion-content>
  </ion-page>
  <!-- tooltips --> 
  <!-- 

  <ion-popover  v-if="!FlowLoading"  trigger="scrollTopRef" trigger-action="hover" show-backdrop="false" size="auto" side="top" alignment="start">
        <ion-content class="ion-padding">{{ $t("tooltip.scrolldown") }}</ion-content>
  </ion-popover>
  <ion-popover v-if="!FlowLoading"  trigger="scrollBottomRef" trigger-action="hover" show-backdrop="false" size="auto" side="left" alignment="start">
        <ion-content class="ion-padding">{{ $t("tooltip.scrollup") }}</ion-content>
  </ion-popover>
  -->

</template>

<style scoped>

#container {
  text-align: center;
  margin:10px;
  /*
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  min-height:50%;
  */
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
  padding-left:.4rem;
  padding-right:.8rem;
  }

@media only screen and (max-width: 996px) {
  #container {
    position: absolute;
  }
  .work-container {
    /*
    top: 50%;
    transform: translateY(-20%)!important;
    */
  }

  .flowArea {
    border:solid 2px var(--ion-color-secondary-tint);
  }
  .chartArea {
    border: solid 2px var(--ion-color-primary-tint);
    height: 35%;
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


