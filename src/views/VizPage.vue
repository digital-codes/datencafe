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

        <div >
    <ion-button @click="toggleShow">{{ showFrame?"Hide":"Show" }} </ion-button>
    <div v-if="showFrame">
      <p>{{ showUrl }}</p>
      <iframe :src="showUrl" class="iframe"/>
    </div>
  </div>

        <div>
      drop file
      <DropFile @newData="newData"/>
  </div>

  <div>
      url loading
      <DataLoader @newData="newData" />
  </div>

  <div v-if="loaded">
    columns table
    <SelectTable :data="data" />
  </div>



  <div v-if="loaded">
    data plot
    <ShowPlot :data="data" />
  </div>

  <div v-if="loaded">
    data table
    <ShowTable :data="data" />
  </div>


  <div>
    data processing
    <data-processing
      :data="data"
      @update-data="updateData"
    ></data-processing>

    <diagram
      :data="data"
      :options="options"
      :selected="selected"
      @select="select"
    ></diagram>
  </div>

  <div>
    show geo
    <ShowGeo />
  </div>

  <div>
    Pipeline Demo 
    <PipelineDemo/>
  </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { IonButton } from '@ionic/vue';

import PipelineDemo from "../components/PipelineDemo.vue";
import DropFile from "../components/DropFile.vue";
import DataLoader from "../components/DataLoader.vue";
import ShowPlot from "../components/ShowPlot4.vue";
import ShowTable from "../components/ShowTable2.vue";
import ShowGeo from "../components/OpenGeo.vue";
import SelectTable from "../components/SelectTable.vue";



import * as dfd from 'danfojs/dist/danfojs-browser/src';
import * as io from "danfojs/dist/danfojs-base/io/browser"

import { ref, onMounted } from "vue"

const loaded = ref(false)
const data = ref([])

onMounted(async () => {
  return
  /*
  const csvOpts = {
    delimiter: ",",
    escapeChar:"\\",
    quoteChar:"\"",
    header:true, // header row
    preview:0, // > 0 is how many lines previews
    skipEmptyLines:true
  }

    try {
      const f = '/us-comma.csv'
      //const f = '/d3-sample.csv'
      data.value = await io.readCSVBrowser(f,csvOpts)
      loaded.value = true;
      console.log("loaded:",data.value)
    } catch (error) {
      loaded.value = false;
      console.error(error);
    } finally {
      console.log("Loaded:",loaded.value)
    }
    */
  }
)

function newData(df) {
  console.log("new data:", df)
  data.value = df
  loaded.value = true;
}

const showFrame = ref(false)
const showUrl = ref("")

function toggleShow() {
  showFrame.value = ! showFrame.value
  const urls = [
    "https://geoportal.karlsruhe.de/server/rest/services/Stadtplan/Stadtplan_POIs_Radverkehr/MapServer/3/query?where=GRUPPENNAME_DE+%3D+%27Fahrradabstellpl%C3%A4tze%27&outFields=NAME%2CGRUPPENNAME_DE%2CUPDATED&returnGeometry=true&f=geojson",
    "https://transparenz.karlsruhe.de/dataset/74561f6a-4783-4d70-b86a-008deec09441/resource/026da0ed-7df8-4446-b4fb-e756c0dde2a5/download/bevolkerung-anteil-der-bevolkerung-mit-hauptwohnung.csv",
    "https://transparenz.karlsruhe.de/dataset/74561f6a-4783-4d70-b86a-008deec09441/resource/71ef348f-0f5b-46a0-8250-e87aae9f91bd/download/bevolkerung-wohnberechtigte-bevolkerung.csv"
  ]
  showUrl.value = showFrame.value? urls[Math.floor(Math.random() * urls.length)]:"" 
}

</script>

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
.iframe {
  width: 600px;
  max-height:300px;
}
</style>
